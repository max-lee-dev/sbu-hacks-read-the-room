import { Frame, RecordingMeta } from '../types';

type CameraRecorderOptions = {
  fps?: number;
  quality?: number;
  maxDurationMs?: number;
  videoConstraints?: MediaTrackConstraints;
};

type RecorderState = {
  isRecording: boolean;
  frames: Frame[];
  blob?: Blob;
};

type EventHandlers = {
  onFrame?: (frame: Frame) => void;
  onNoise?: (level: 'low' | 'medium' | 'high') => void;
  onStop?: (meta: RecordingMeta) => void;
};

export class CameraRecorder {
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private frameTimer: number | null = null;
  private maxDurationTimer: number | null = null;
  private chunks: BlobPart[] = [];
  private startTime: number = 0;
  private recordingId: string | null = null;

  private state: RecorderState = {
    isRecording: false,
    frames: [],
  };

  private handlers: EventHandlers = {};
  private options: Required<Pick<CameraRecorderOptions, 'fps' | 'quality' | 'maxDurationMs'>> & {
    videoConstraints: MediaTrackConstraints;
  };

  constructor(options: CameraRecorderOptions = {}) {
    this.options = {
      fps: options.fps ?? 1,
      quality: options.quality ?? 0.7,
      maxDurationMs: options.maxDurationMs ?? 60000,
      videoConstraints: options.videoConstraints ?? {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };
  }

  on<K extends keyof EventHandlers>(event: K, handler: NonNullable<EventHandlers[K]>) {
    this.handlers[event] = handler;
  }

  getState(): RecorderState {
    return { ...this.state };
  }

  getElapsedMs(): number {
    if (!this.state.isRecording || !this.startTime) return 0;
    return Date.now() - this.startTime;
  }

  getRecordingId(): string | null {
    return this.recordingId;
  }

  async start(videoElement: HTMLVideoElement): Promise<void> {
    if (this.state.isRecording) {
      throw new Error('Already recording');
    }

    this.videoElement = videoElement;
    this.recordingId = crypto.randomUUID();
    this.chunks = [];
    this.state.frames = [];
    this.state.elapsedMs = 0;
    this.startTime = Date.now();

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: this.options.videoConstraints,
        audio: true,
      });

      videoElement.srcObject = this.stream;
      await videoElement.play();

      const videoTrack = this.stream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      const width = settings.width || 720;
      const height = settings.height || 1280;

      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;

      this.setupAudioAnalysis();
      this.setupMediaRecorder();
      this.startFrameCapture();
      this.startMaxDurationTimer();

      this.state.isRecording = true;
    } catch (error) {
      this.cleanup();
      throw error;
    }
  }

  private setupAudioAnalysis() {
    if (!this.stream) return;

    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      source.connect(this.analyser);
    } catch (error) {
      console.warn('Audio analysis setup failed:', error);
    }
  }

  private setupMediaRecorder() {
    if (!this.stream) return;

    const mimeTypes = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/mp4;codecs=h264',
      'video/webm',
    ];

    let mimeType: string | undefined;
    for (const type of mimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        mimeType = type;
        break;
      }
    }

    this.mediaRecorder = new MediaRecorder(this.stream, mimeType ? { mimeType } : undefined);
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blobType = mimeType?.split(';')[0] || 'video/webm';
      const blob = new Blob(this.chunks, { type: blobType });
      this.state.blob = blob;
      this.finalizeRecording();
    };

    this.mediaRecorder.start();
  }

  private startFrameCapture() {
    if (!this.videoElement || !this.canvas) return;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    const targetMs = Math.max(250, Math.round(1000 / this.options.fps));
    const dataArray = new Uint8Array(this.analyser?.fftSize || 2048);

    const captureFrame = () => {
      if (!this.state.isRecording || !this.videoElement || !this.canvas || !ctx) return;

      try {
        ctx.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);
        const dataUrl = this.canvas.toDataURL('image/jpeg', this.options.quality);
        const t = Date.now() - this.startTime;

        const frame: Frame = {
          id: crypto.randomUUID(),
          t,
          dataUrl,
          w: this.canvas.width,
          h: this.canvas.height,
        };

        this.state.frames.push(frame);
        this.handlers.onFrame?.(frame);

        if (this.analyser && dataArray.length > 0) {
          this.analyser.getByteTimeDomainData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const v = (dataArray[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / dataArray.length);
          const level: 'low' | 'medium' | 'high' =
            rms < 0.03 ? 'low' : rms < 0.07 ? 'medium' : 'high';
          this.handlers.onNoise?.(level);
        }
      } catch (error) {
        console.warn('Frame capture error:', error);
      }

      this.frameTimer = window.setTimeout(captureFrame, targetMs);
    };

    captureFrame();
  }

  private startMaxDurationTimer() {
    this.maxDurationTimer = window.setTimeout(() => {
      if (this.state.isRecording) {
        this.stop();
      }
    }, this.options.maxDurationMs);
  }

  stop(): void {
    if (!this.state.isRecording) return;

    this.state.isRecording = false;

    if (this.frameTimer !== null) {
      window.clearTimeout(this.frameTimer);
      this.frameTimer = null;
    }

    if (this.maxDurationTimer !== null) {
      window.clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = null;
    }

    this.mediaRecorder?.stop();
    this.cleanup();
  }

  private finalizeRecording() {
    const durationMs = Date.now() - this.startTime;
    const thumbnailDataUrl = this.state.frames[0]?.dataUrl;

    const meta: RecordingMeta = {
      id: this.recordingId!,
      startedAt: this.startTime,
      durationMs,
      fps: this.options.fps,
      frameCount: this.state.frames.length,
      thumbnailDataUrl,
    };

    this.handlers.onStop?.(meta);
  }

  private cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }

    if (this.audioContext) {
      this.audioContext.close().catch(console.warn);
      this.audioContext = null;
    }

    this.analyser = null;
    this.canvas = null;
    this.mediaRecorder = null;
  }

  reset(): void {
    this.stop();
    this.state = {
      isRecording: false,
      frames: [],
    };
    this.recordingId = null;
    this.chunks = [];
    this.startTime = 0;
  }
}


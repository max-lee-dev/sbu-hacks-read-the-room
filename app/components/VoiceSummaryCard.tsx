'use client';

import { Headphones } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  audioUrl: string;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const generateWaveform = (bars: number = 100): number[] => {
  const waveform: number[] = [];
  for (let i = 0; i < bars; i++) {
    waveform.push(Math.random() * 0.3 + 0.1);
  }
  return waveform;
};

export const VoiceSummaryCard = ({ audioUrl }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveform] = useState(() => generateWaveform(120));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (duration > 0) {
        setProgress((audio.currentTime / duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    // Autoplay with retry mechanism (try for 5 seconds)
    const attemptAutoplay = async () => {
      try {
        await audio.play();
        // Success - clear any pending retry
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
        retryCountRef.current = 0;
      } catch (err) {
        retryCountRef.current += 1;
        const elapsedSeconds = retryCountRef.current;

        if (elapsedSeconds < 5) {
          // Retry every second for up to 5 seconds
          retryTimeoutRef.current = setTimeout(() => {
            attemptAutoplay();
          }, 1000);
        } else {
          // After 5 seconds of trying, give up
          console.log('Autoplay failed after 5 seconds, user interaction required');
          retryCountRef.current = 0;
        }
      }
    };

    // Try autoplay immediately
    retryCountRef.current = 0;
    attemptAutoplay();

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);

      // Clean up retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      retryCountRef.current = 0;
    };
  }, [audioUrl, duration]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSeek = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
  };

  const handleSkipToStart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
  };

  const handleSkipToEnd = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = duration;
  };

  const handleWaveformClick = (e: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * duration;
  };

  if (!audioUrl) return null;

  const playedBars = Math.floor((progress / 100) * waveform.length);

  return (
    <div className="rounded-lg border border-black bg-white p-4 shadow-sm" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040' }}>
      <div className="mb-2 flex items-center gap-2">
        <Headphones className="h-5 w-5 text-black" style={{ color: '#FFFFFF' }} />
        <h2 className="text-lg font-bold text-black" style={{ color: '#FFFFFF' }}>Voice Summary</h2>
      </div>
      {/* Waveform */}
      <div
        className="mb-3 mt-2 flex h-12 cursor-pointer items-end justify-center gap-0.5"
        onClick={handleWaveformClick}
      >
        {waveform.map((height, index) => {
          const barHeight = Math.max(4, height * 100);
          const isPlayed = index < playedBars;
          return (
            <div
              key={index}
              className="w-1 rounded-sm transition-colors"
              style={{
                height: `${barHeight}%`,
                backgroundColor: isPlayed ? '#FFB380' : '#404040',
                minHeight: '4px',
              }}
            />
          );
        })}
      </div>

      {/* Time Display */}
      <div className="mb-4 flex items-center justify-between text-sm text-black" style={{ color: '#B0B0B0' }}>
        <span className="font-medium">{formatTime(currentTime)}</span>
        <span className="font-medium">{formatTime(duration || 0)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {/* Skip Backward */}
        <button
          onClick={handleSkipToStart}
          className="flex h-8 w-8 items-center justify-center rounded-full text-black transition-opacity hover:opacity-70"
          style={{ color: '#FFFFFF' }}
          aria-label="Skip to start"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 19l-7-7 7-7" />
            <line x1="11" y1="12" x2="11" y2="12" strokeWidth={3} />
          </svg>
        </button>

        {/* Rewind 10s */}
        <button
          onClick={() => handleSeek(-10)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white text-black transition-opacity hover:opacity-70"
          style={{ backgroundColor: '#353535', borderColor: '#404040', color: '#FFFFFF' }}
          aria-label="Rewind 10 seconds"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" fill="none" />
            <path
              d="M12 8L8 12l4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 12h8"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-[10px] font-bold">10</span>
        </button>

        {/* Play/Pause */}
        <button
          onClick={handlePlayPause}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-black transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#FFB380', borderColor: '#FFB380' }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </button>

        {/* Fast Forward 10s */}
        <button
          onClick={() => handleSeek(10)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white text-black transition-opacity hover:opacity-70"
          style={{ backgroundColor: '#353535', borderColor: '#404040', color: '#FFFFFF' }}
          aria-label="Fast forward 10 seconds"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" fill="none" />
            <path
              d="M12 8l4 4-4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 12H8"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-[10px] font-bold">10</span>
        </button>

        {/* Skip Forward */}
        <button
          onClick={handleSkipToEnd}
          className="flex h-8 w-8 items-center justify-center rounded-full text-black transition-opacity hover:opacity-70"
          style={{ color: '#FFFFFF' }}
          aria-label="Skip to end"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 5l7 7-7 7" />
            <line x1="13" y1="12" x2="13" y2="12" strokeWidth={3} />
          </svg>
        </button>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
};


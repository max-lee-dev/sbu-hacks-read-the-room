export type Emotion =
  | 'happy'
  | 'neutral'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'fearful'
  | 'disgust'
  | 'confused'
  | 'bored'
  | 'engaged';

export type Availability =
  | 'available'
  | 'busy'
  | 'in-conversation'
  | 'approachable'
  | 'unapproachable'
  | 'unknown';

export type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Frame = {
  id: string;
  t: number;
  dataUrl: string;
  w: number;
  h: number;
};

export type RecordingMeta = {
  id: string;
  startedAt: number;
  durationMs: number;
  fps: number;
  frameCount: number;
  thumbnailDataUrl?: string;
  noiseLevel?: 'low' | 'medium' | 'high';
};

export type PersonInsight = {
  id: string;
  bbox: BBox;
  emotion: Emotion;
  availability: Availability;
  engagement: 'low' | 'medium' | 'high';
  interactingWith?: string[];
  confidence?: number;
};

export type RoomInsight = {
  peopleCount: number;
  energyLevel: 'low' | 'medium' | 'high';
  noiseLevel?: 'low' | 'medium' | 'high' | null;
  groups: Array<{
    memberIds: string[];
    openness: 'open' | 'closed' | 'unknown';
  }>;
  recommendedTargets: Array<{
    personId: string;
    reason: string;
  }>;
  doNotApproach: Array<{
    personId: string;
    reason: string;
  }>;
  suggestions: string[];
};

export type AnalysisResult = {
  recordingId: string;
  model: string;
  createdAt: number;
  rawText: string;
  insights: RoomInsight;
  perFrame?: Array<{
    t: number;
    people: PersonInsight[];
  }>;
};


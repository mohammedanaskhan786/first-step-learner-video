export type Coordinate = {
  lat: number;
  lon: number;
};

export type VisualBeatType =
  | "cold_open"
  | "cinematic_text"
  | "location"
  | "map"
  | "timeline"
  | "photo"
  | "document"
  | "newspaper"
  | "evidence"
  | "quote"
  | "statistic"
  | "unknown"
  | "ending";

export type VisualBeat = {
  id: string;
  start: number;
  end: number;
  type: VisualBeatType | string;
  text: string;
  data?: Record<string, unknown>;
  asset?: string;
  sourceClaimId?: string;
};

export type SubtitleCue = {
  start: number;
  end: number;
  text: string;
};

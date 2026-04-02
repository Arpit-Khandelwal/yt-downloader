export type DownloadMode = "direct" | "client_wasm" | "server_fallback";

export type FallbackJobStatus = "queued" | "processing" | "completed" | "failed";

export interface NormalizedVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  author: string;
  lengthSeconds: number;
  webpageUrl: string;
}

export interface NormalizedFormat {
  itag: number;
  url: string;
  mimeType: string;
  container: string;
  qualityLabel: string | null;
  audioBitrate: number | null;
  bitrate: number | null;
  contentLength: number | null;
  hasAudio: boolean;
  hasVideo: boolean;
}

export interface InfoFlags {
  policyMode: "strict";
  extractor: "@ybd-project/ytdl-core" | "@distube/ytdl-core";
  fallbackEnabled: boolean;
}

export interface InfoResponse {
  video: NormalizedVideo;
  audioFormats: NormalizedFormat[];
  videoFormats: NormalizedFormat[];
  muxedFormats: NormalizedFormat[];
  flags: InfoFlags;
}

export interface CapabilityProfile {
  wasm: boolean;
  sharedArrayBuffer: boolean;
  crossOriginIsolated: boolean;
  deviceMemoryGb: number | null;
  hardwareConcurrency: number | null;
  storageEstimateMb: number | null;
  isMobile: boolean;
  userAgent: string;
}

export interface StrategySelection {
  muxedItag?: number;
  audioItag?: number;
  videoItag?: number;
  estimatedSizeBytes?: number;
  output: "mp4" | "mp3";
}

export interface StrategyRequest {
  capabilityProfile: CapabilityProfile;
  selection: StrategySelection;
}

export interface StrategyDecision {
  mode: DownloadMode;
  reasons: string[];
}

export interface FallbackJobRequest {
  url: string;
  audioItag?: number;
  videoItag?: number;
  output: "mp4" | "mp3";
  estimatedSizeBytes?: number;
}

export interface DownloadJob {
  jobId: string;
  status: FallbackJobStatus;
  progressPct: number;
  downloadUrl?: string;
  errorCode?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: unknown;
}

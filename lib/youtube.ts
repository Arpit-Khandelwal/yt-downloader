import type { InfoResponse, NormalizedFormat } from "@/lib/types";

const INVALID_QUERY_VALUES = new Set(["", "undefined", "null", "nan"]);

const hasInvalidParamValue = (url: URL, key: string): boolean => {
  const values = url.searchParams.getAll(key);
  return values.some((value) => INVALID_QUERY_VALUES.has(value.trim().toLowerCase()));
};

export const isValidStreamUrl = (value: unknown): value is string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return false;
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false;
  }

  if (
    hasInvalidParamValue(parsed, "sig") ||
    hasInvalidParamValue(parsed, "n") ||
    hasInvalidParamValue(parsed, "lsig")
  ) {
    return false;
  }

  return true;
};

const parseNumberOrNull = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const getQualityScore = (qualityLabel: string | null): number => {
  if (!qualityLabel) {
    return 0;
  }

  const parsed = Number.parseInt(qualityLabel, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeFormat = (format: any): NormalizedFormat | null => {
  if (!format || !isValidStreamUrl(format.url)) {
    return null;
  }

  const itag = Number(format.itag);

  if (!Number.isFinite(itag)) {
    return null;
  }

  const mimeType = typeof format.mimeType === "string" ? format.mimeType : "";
  const container = typeof format.container === "string" ? format.container : "mp4";
  const hasAudio = Boolean(format.hasAudio || mimeType.includes("audio"));
  const hasVideo = Boolean(format.hasVideo || mimeType.includes("video"));

  if (!hasAudio && !hasVideo) {
    return null;
  }

  return {
    itag,
    url: format.url,
    mimeType,
    container,
    qualityLabel: typeof format.qualityLabel === "string" ? format.qualityLabel : null,
    audioBitrate: parseNumberOrNull(format.audioBitrate),
    bitrate: parseNumberOrNull(format.bitrate),
    contentLength: parseNumberOrNull(format.contentLength),
    hasAudio,
    hasVideo,
  };
};

const sortAudioFormats = (left: NormalizedFormat, right: NormalizedFormat): number => {
  const leftRate = left.audioBitrate ?? 0;
  const rightRate = right.audioBitrate ?? 0;

  if (rightRate !== leftRate) {
    return rightRate - leftRate;
  }

  const leftSize = left.contentLength ?? 0;
  const rightSize = right.contentLength ?? 0;
  return rightSize - leftSize;
};

const sortVideoFormats = (left: NormalizedFormat, right: NormalizedFormat): number => {
  const leftQuality = getQualityScore(left.qualityLabel);
  const rightQuality = getQualityScore(right.qualityLabel);

  if (rightQuality !== leftQuality) {
    return rightQuality - leftQuality;
  }

  const leftRate = left.bitrate ?? 0;
  const rightRate = right.bitrate ?? 0;
  return rightRate - leftRate;
};

export const normalizeVideoInfo = (
  info: any,
  sourceUrl: string,
  fallbackEnabled: boolean,
  extractor: InfoResponse["flags"]["extractor"] = "@ybd-project/ytdl-core"
): InfoResponse => {
  const rawFormats: any[] = Array.isArray(info?.formats) ? info.formats : [];

  const normalizedFormats = rawFormats
    .map((format: any) => normalizeFormat(format))
    .filter((value: NormalizedFormat | null): value is NormalizedFormat => Boolean(value));

  const audioFormats = normalizedFormats
    .filter((format) => format.hasAudio && !format.hasVideo)
    .sort(sortAudioFormats);

  const videoFormats = normalizedFormats
    .filter((format) => format.hasVideo && !format.hasAudio)
    .sort(sortVideoFormats);

  const muxedFormats = normalizedFormats
    .filter((format) => format.hasVideo && format.hasAudio)
    .sort(sortVideoFormats);

  const thumbnails = info?.videoDetails?.thumbnails ?? [];
  const thumbnailUrl = thumbnails.length > 0 ? thumbnails[thumbnails.length - 1].url : "";

  return {
    video: {
      id: String(info?.videoDetails?.videoId ?? ""),
      title: String(info?.videoDetails?.title ?? "Untitled Video"),
      thumbnailUrl,
      author: String(info?.videoDetails?.author?.name ?? info?.videoDetails?.author ?? "Unknown"),
      lengthSeconds: Number(info?.videoDetails?.lengthSeconds ?? 0),
      webpageUrl: sourceUrl,
    },
    audioFormats,
    videoFormats,
    muxedFormats,
    flags: {
      policyMode: "strict",
      extractor,
      fallbackEnabled,
    },
  };
};

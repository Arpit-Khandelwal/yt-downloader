export const formatDuration = (lengthSeconds: number): string => {
  if (!Number.isFinite(lengthSeconds) || lengthSeconds <= 0) {
    return "Unknown";
  }

  const hours = Math.floor(lengthSeconds / 3600);
  const minutes = Math.floor((lengthSeconds % 3600) / 60);
  const seconds = Math.floor(lengthSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const formatBytes = (bytes?: number | null): string => {
  if (!bytes || bytes <= 0) {
    return "Unknown size";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const precision = value >= 100 || unitIndex === 0 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
};

export const formatCapabilityValue = (value: number | null, suffix = ""): string => {
  if (value === null || Number.isNaN(value)) {
    return "Unknown";
  }

  return `${value}${suffix}`;
};

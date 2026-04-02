export const sanitizeFileName = (input: string): string => {
  const cleaned = input
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.length > 0 ? cleaned : "download";
};

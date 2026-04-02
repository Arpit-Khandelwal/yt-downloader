import { describe, expect, it } from "vitest";
import { resolveVideoInfo } from "@/lib/info-service";

const videoUrl = "https://www.youtube.com/watch?v=abc123def45";

const createRawInfo = (formats: Array<Record<string, unknown>>) => {
  return {
    videoDetails: {
      videoId: "abc123def45",
      title: "Sample",
      thumbnails: [{ url: "https://img.test/thumb.jpg" }],
      author: { name: "Author" },
      lengthSeconds: "61",
    },
    formats,
  };
};

describe("resolveVideoInfo", () => {
  it("falls back to secondary extractor when primary output has no usable formats", async () => {
    const malformedPrimary = createRawInfo([
      {
        itag: 18,
        url: "https://video.test/primary.mp4?sig=undefined&n=good",
        mimeType: 'video/mp4; codecs="avc1.42001E, mp4a.40.2"',
        container: "mp4",
        hasAudio: true,
        hasVideo: true,
        bitrate: 178253,
      },
    ]);

    const validFallback = createRawInfo([
      {
        itag: 18,
        url: "https://video.test/fallback.mp4?sig=abc123&n=good",
        mimeType: 'video/mp4; codecs="avc1.42001E, mp4a.40.2"',
        container: "mp4",
        hasAudio: true,
        hasVideo: true,
        bitrate: 178253,
      },
    ]);

    const result = await resolveVideoInfo(videoUrl, false, {
      primary: async () => malformedPrimary,
      fallback: async () => validFallback,
    });

    expect(result.info.flags.extractor).toBe("@distube/ytdl-core");
    expect(result.info.muxedFormats).toHaveLength(1);
    expect(result.notes).toContain("primary extractor returned no usable formats");
  });

  it("throws when neither extractor can return usable formats", async () => {
    const malformed = createRawInfo([
      {
        itag: 18,
        url: "https://video.test/malformed.mp4?sig=undefined&n=undefined",
        mimeType: 'video/mp4; codecs="avc1.42001E, mp4a.40.2"',
        container: "mp4",
        hasAudio: true,
        hasVideo: true,
      },
    ]);

    await expect(
      resolveVideoInfo(videoUrl, false, {
        primary: async () => {
          throw new Error("primary failed");
        },
        fallback: async () => malformed,
      })
    ).rejects.toThrow("No usable downloadable formats were extracted");
  });
});

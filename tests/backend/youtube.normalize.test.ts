import { describe, expect, it } from "vitest";
import { normalizeVideoInfo } from "@/lib/youtube";

const sourceUrl = "https://www.youtube.com/watch?v=abc123def45";

const baseInfo = {
  videoDetails: {
    videoId: "abc123def45",
    title: "Sample",
    thumbnails: [{ url: "https://img.test/thumb.jpg" }],
    author: { name: "Author" },
    lengthSeconds: "61",
  },
};

describe("normalizeVideoInfo", () => {
  it("filters formats that contain malformed stream URL params", () => {
    const info = {
      ...baseInfo,
      formats: [
        {
          itag: 18,
          url: "https://video.test/ok.mp4?sig=abc123&n=good",
          mimeType: 'video/mp4; codecs="avc1.42001E, mp4a.40.2"',
          container: "mp4",
          hasAudio: true,
          hasVideo: true,
          qualityLabel: "360p",
          audioBitrate: 96,
          bitrate: 178253,
          contentLength: "1338240",
        },
        {
          itag: 22,
          url: "https://video.test/bad.mp4?sig=undefined&n=good",
          mimeType: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
          container: "mp4",
          hasAudio: true,
          hasVideo: true,
          qualityLabel: "720p",
          audioBitrate: 128,
          bitrate: 2500000,
          contentLength: "2500000",
        },
      ],
    };

    const normalized = normalizeVideoInfo(info, sourceUrl, false, "@ybd-project/ytdl-core");

    expect(normalized.muxedFormats).toHaveLength(1);
    expect(normalized.muxedFormats[0]?.itag).toBe(18);
  });
});

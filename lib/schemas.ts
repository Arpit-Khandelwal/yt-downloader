import { z } from "zod";

const isYouTubeUrl = (value: string): boolean => {
  try {
    const hostname = new URL(value).hostname.toLowerCase().replace(/^www\./, "");
    return (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "music.youtube.com" ||
      hostname === "youtu.be" ||
      hostname.endsWith(".youtube.com")
    );
  } catch {
    return false;
  }
};

export const infoQuerySchema = z.object({
  url: z
    .string()
    .url()
    .refine(isYouTubeUrl, {
      message: "Only YouTube URLs are supported.",
    }),
});

export const capabilityProfileSchema = z.object({
  wasm: z.boolean(),
  sharedArrayBuffer: z.boolean(),
  crossOriginIsolated: z.boolean(),
  deviceMemoryGb: z.number().min(0).max(128).nullable(),
  hardwareConcurrency: z.number().int().min(1).max(256).nullable(),
  storageEstimateMb: z.number().min(0).nullable(),
  isMobile: z.boolean(),
  userAgent: z.string().max(400),
});

export const strategySelectionSchema = z
  .object({
    muxedItag: z.number().int().positive().optional(),
    audioItag: z.number().int().positive().optional(),
    videoItag: z.number().int().positive().optional(),
    estimatedSizeBytes: z.number().nonnegative().optional(),
    output: z.enum(["mp4", "mp3"]),
  })
  .refine((value) => Boolean(value.muxedItag || value.audioItag || value.videoItag), {
    message: "At least one selected format must be provided",
    path: ["muxedItag"],
  });

export const strategyRequestSchema = z.object({
  capabilityProfile: capabilityProfileSchema,
  selection: strategySelectionSchema,
});

export const fallbackJobRequestSchema = z
  .object({
    url: z.string().url().refine(isYouTubeUrl, {
      message: "Only YouTube URLs are supported for fallback jobs.",
    }),
    audioItag: z.number().int().positive().optional(),
    videoItag: z.number().int().positive().optional(),
    output: z.enum(["mp4", "mp3"]),
    estimatedSizeBytes: z.number().nonnegative().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.output === "mp4" && (!value.audioItag || !value.videoItag)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "mp4 output requires both audioItag and videoItag",
        path: ["videoItag"],
      });
    }

    if (value.output === "mp3" && !value.audioItag) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "mp3 output requires audioItag",
        path: ["audioItag"],
      });
    }
  });

export const fallbackWorkerStartResponseSchema = z.object({
  jobId: z.string().min(1),
  status: z.enum(["queued", "processing", "completed", "failed"]).default("queued"),
  progressPct: z.number().min(0).max(100).optional(),
  downloadUrl: z.string().url().optional(),
  errorCode: z.string().optional(),
});

export const fallbackWorkerStatusSchema = z.object({
  status: z.enum(["queued", "processing", "completed", "failed"]),
  progressPct: z.number().min(0).max(100),
  downloadUrl: z.string().url().optional(),
  errorCode: z.string().optional(),
});

export type StrategyRequestInput = z.infer<typeof strategyRequestSchema>;
export type FallbackJobRequestInput = z.infer<typeof fallbackJobRequestSchema>;

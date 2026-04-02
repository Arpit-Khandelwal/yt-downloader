/// <reference lib="webworker" />

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

type WorkerStartMessage = {
  type: "start";
  payload: {
    audioUrl: string;
    videoUrl: string;
    audioExtension: string;
    videoExtension: string;
    outputFileName: string;
    multiThread: boolean;
  };
};

type WorkerCancelMessage = {
  type: "cancel";
};

type WorkerIncomingMessage = WorkerStartMessage | WorkerCancelMessage;

let ffmpeg: FFmpeg | null = null;
let loadedMode: "single" | "multi" | null = null;
let isRunning = false;

const emit = (type: string, payload?: Record<string, unknown>) => {
  self.postMessage({ type, ...(payload ?? {}) });
};

const createFfmpegInstance = (): FFmpeg => {
  const instance = new FFmpeg();

  instance.on("progress", ({ progress }: { progress: number; time: number }) => {
    emit("progress", {
      ratio: progress,
    });
  });

  instance.on("log", ({ message }: { message: string }) => {
    emit("log", { message });
  });

  return instance;
};

const loadFfmpeg = async (preferMultiThread: boolean): Promise<void> => {
  if (!ffmpeg) {
    ffmpeg = createFfmpegInstance();
  }

  if (loadedMode) {
    return;
  }

  emit("phase", {
    phase: "loading_core",
  });

  const singleThreadBase = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  const multiThreadBase = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd";

  if (preferMultiThread) {
    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${multiThreadBase}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${multiThreadBase}/ffmpeg-core.wasm`, "application/wasm"),
        workerURL: await toBlobURL(`${multiThreadBase}/ffmpeg-core.worker.js`, "text/javascript"),
      });
      loadedMode = "multi";
      emit("phase", { phase: "core_ready_multi" });
      return;
    } catch {
      // Fall back to single-thread core when mt prerequisites are not satisfied.
      ffmpeg.terminate();
      ffmpeg = createFfmpegInstance();
      loadedMode = null;
      emit("phase", { phase: "core_mt_failed_fallback_single" });
    }
  }

  await ffmpeg.load({
    coreURL: await toBlobURL(`${singleThreadBase}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${singleThreadBase}/ffmpeg-core.wasm`, "application/wasm"),
  });

  loadedMode = "single";
  emit("phase", { phase: "core_ready_single" });
};

const fetchBinary = async (url: string, label: string): Promise<Uint8Array> => {
  emit("phase", {
    phase: "fetching_inputs",
    label,
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${label}: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
};

const toTransferableBuffer = (bytes: Uint8Array): ArrayBuffer => {
  return bytes.slice().buffer as ArrayBuffer;
};

const runMerge = async (message: WorkerStartMessage): Promise<void> => {
  const {
    audioUrl,
    videoUrl,
    audioExtension,
    videoExtension,
    outputFileName,
    multiThread,
  } = message.payload;

  await loadFfmpeg(multiThread);

  if (!ffmpeg) {
    throw new Error("FFmpeg failed to initialize.");
  }

  const audioFileName = `input-audio.${audioExtension}`;
  const videoFileName = `input-video.${videoExtension}`;

  const [audioData, videoData] = await Promise.all([
    fetchBinary(audioUrl, "audio"),
    fetchBinary(videoUrl, "video"),
  ]);

  await ffmpeg.writeFile(audioFileName, audioData);
  await ffmpeg.writeFile(videoFileName, videoData);

  emit("phase", { phase: "muxing" });

  await ffmpeg.exec([
    "-i",
    videoFileName,
    "-i",
    audioFileName,
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    outputFileName,
  ]);

  const outputData = (await ffmpeg.readFile(outputFileName)) as Uint8Array;
  const transferable = toTransferableBuffer(outputData);

  self.postMessage(
    {
      type: "complete",
      fileName: outputFileName,
      mimeType: `video/${videoExtension}`,
      buffer: transferable,
    },
    [transferable]
  );

  try {
    await ffmpeg.deleteFile(audioFileName);
    await ffmpeg.deleteFile(videoFileName);
    await ffmpeg.deleteFile(outputFileName);
  } catch {
    // Ignore cleanup failures in worker FS.
  }
};

const cancelWork = (): void => {
  if (ffmpeg) {
    try {
      ffmpeg.terminate();
    } catch {
      // Ignore terminate errors and recreate instance on next start.
    }
  }

  ffmpeg = null;
  loadedMode = null;
  isRunning = false;
  emit("cancelled");
};

self.onmessage = async (event: MessageEvent<WorkerIncomingMessage>) => {
  const message = event.data;

  if (message.type === "cancel") {
    cancelWork();
    return;
  }

  if (isRunning) {
    emit("error", {
      message: "A merge job is already running.",
    });
    return;
  }

  isRunning = true;

  try {
    await runMerge(message);
  } catch (error) {
    emit("error", {
      message: error instanceof Error ? error.message : "Unknown ffmpeg worker error",
    });
  } finally {
    isRunning = false;
  }
};

export {};

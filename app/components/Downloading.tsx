"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge, Box, Button, HStack, Progress, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import type { NormalizedFormat } from "@/lib/types";
import { sanitizeFileName } from "@/lib/file";

type WorkerMessage =
  | { type: "phase"; phase: string; label?: string }
  | { type: "progress"; ratio: number }
  | { type: "log"; message: string }
  | { type: "complete"; fileName: string; mimeType: string; buffer: ArrayBuffer }
  | { type: "cancelled" }
  | { type: "error"; message: string };

interface DownloadingProps {
  audio: NormalizedFormat;
  video: NormalizedFormat;
  title: string;
  onClose: () => void;
}

const formatPhase = (phase: string): string => {
  switch (phase) {
    case "loading_core":
      return "Loading FFmpeg core";
    case "core_ready_multi":
      return "FFmpeg core ready (multithread)";
    case "core_mt_failed_fallback_single":
      return "Multithread unavailable, switched to single-thread";
    case "core_ready_single":
      return "FFmpeg core ready (single-thread)";
    case "fetching_inputs":
      return "Fetching audio and video streams";
    case "muxing":
      return "Muxing streams";
    default:
      return phase;
  }
};

export default function Downloading({ audio, video, title, onClose }: DownloadingProps) {
  const workerRef = useRef<Worker | null>(null);
  const mergedUrlRef = useRef<string | null>(null);

  const [phase, setPhase] = useState("Preparing merge task");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("output.mp4");
  const [isRunning, setIsRunning] = useState(false);

  const panelBg = useColorModeValue("rgba(255, 255, 255, 0.88)", "rgba(8, 14, 30, 0.8)");
  const panelBorder = useColorModeValue("rgba(14, 165, 233, 0.28)", "rgba(56, 189, 248, 0.42)");
  const headingColor = useColorModeValue("rgba(15, 23, 42, 0.96)", "white");
  const subText = useColorModeValue("rgba(51, 65, 85, 0.92)", "rgba(203, 213, 225, 0.94)");
  const helperText = useColorModeValue("rgba(71, 85, 105, 0.9)", "rgba(148, 163, 184, 0.9)");
  const progressBg = useColorModeValue("rgba(148, 163, 184, 0.22)", "rgba(30, 41, 59, 0.74)");
  const closeBorder = useColorModeValue("rgba(51, 65, 85, 0.35)", "rgba(148, 163, 184, 0.45)");
  const closeColor = useColorModeValue("rgba(15, 23, 42, 0.92)", "rgba(226, 232, 240, 0.94)");

  const multiThread = useMemo(() => {
    return typeof window !== "undefined" && window.crossOriginIsolated && typeof SharedArrayBuffer !== "undefined";
  }, []);

  const disposeWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  const clearOutputUrl = useCallback(() => {
    if (mergedUrlRef.current) {
      URL.revokeObjectURL(mergedUrlRef.current);
      mergedUrlRef.current = null;
    }
    setOutputUrl(null);
  }, []);

  const bootWorker = useCallback(() => {
    disposeWorker();

    const worker = new Worker(new URL("../workers/ffmpeg.worker.ts", import.meta.url), {
      type: "module",
    });

    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;

      if (message.type === "phase") {
        setPhase(formatPhase(message.phase));
        return;
      }

      if (message.type === "progress") {
        setProgress(Math.max(0, Math.min(100, Math.round(message.ratio * 100))));
        return;
      }

      if (message.type === "complete") {
        const blob = new Blob([message.buffer], { type: message.mimeType });
        const url = URL.createObjectURL(blob);
        mergedUrlRef.current = url;
        setOutputUrl(url);
        setOutputFileName(message.fileName);
        setPhase("Merge complete");
        setIsRunning(false);
        setProgress(100);
        return;
      }

      if (message.type === "cancelled") {
        setPhase("Merge cancelled");
        setIsRunning(false);
        return;
      }

      if (message.type === "error") {
        setError(message.message);
        setIsRunning(false);
      }
    };

    workerRef.current = worker;
  }, [disposeWorker]);

  const startMerge = useCallback(() => {
    clearOutputUrl();
    setError(null);
    setProgress(0);
    setPhase("Preparing merge task");
    setIsRunning(true);

    if (!workerRef.current) {
      bootWorker();
    }

    const fileName = `${sanitizeFileName(title)}.${video.container || "mp4"}`;

    workerRef.current?.postMessage({
      type: "start",
      payload: {
        audioUrl: audio.url,
        videoUrl: video.url,
        audioExtension: audio.container || "m4a",
        videoExtension: video.container || "mp4",
        outputFileName: fileName,
        multiThread,
      },
    });
  }, [audio.container, audio.url, bootWorker, clearOutputUrl, multiThread, title, video.container, video.url]);

  const cancelMerge = useCallback(() => {
    workerRef.current?.postMessage({ type: "cancel" });
    setIsRunning(false);
  }, []);

  useEffect(() => {
    bootWorker();
    startMerge();

    return () => {
      clearOutputUrl();
      disposeWorker();
    };
  }, [bootWorker, clearOutputUrl, disposeWorker, startMerge]);

  return (
    <Box border="1px solid" borderColor={panelBorder} borderRadius="xl" p={4} bg={panelBg}>
      <Stack spacing={3}>
        <HStack justify="space-between" align="center" flexWrap="wrap">
          <Text fontWeight="semibold" color={headingColor}>
            Client merge in progress
          </Text>

          <HStack spacing={2}>
            <Badge colorScheme="blue">Client merge</Badge>
            <Badge colorScheme={multiThread ? "green" : "gray"}>{multiThread ? "Multithread" : "Single-thread"}</Badge>
          </HStack>
        </HStack>

        <Text fontSize="sm" color={subText}>
          {phase}
        </Text>

        <Progress value={progress} size="sm" colorScheme="blue" rounded="md" bg={progressBg} />

        <Text fontSize="xs" color={helperText}>
          Progress {progress}%
        </Text>

        {error && (
          <Text fontSize="sm" color="rose.200">
            {error}
          </Text>
        )}

        <Stack direction={{ base: "column", md: "row" }} spacing={2}>
          {isRunning ? (
            <Button
              minH="44px"
              bg="rgba(251, 146, 60, 0.2)"
              color="orange.100"
              border="1px solid"
              borderColor="rgba(251, 146, 60, 0.5)"
              _hover={{ bg: "rgba(251, 146, 60, 0.28)" }}
              onClick={cancelMerge}
            >
              Cancel merge
            </Button>
          ) : (
            <Button
              minH="44px"
              bg="rgba(56, 189, 248, 0.2)"
              color="cyan.100"
              border="1px solid"
              borderColor="rgba(56, 189, 248, 0.5)"
              _hover={{ bg: "rgba(56, 189, 248, 0.28)" }}
              onClick={startMerge}
            >
              Retry merge
            </Button>
          )}

          {outputUrl && (
            <Button
              as="a"
              href={outputUrl}
              download={outputFileName}
              minH="44px"
              bg="linear-gradient(100deg, #34d399 0%, #10b981 100%)"
              color="white"
              _hover={{ filter: "brightness(1.08)" }}
              _active={{ filter: "brightness(0.96)" }}
            >
              Download merged file
            </Button>
          )}

          <Button minH="44px" variant="outline" borderColor={closeBorder} color={closeColor} onClick={onClose}>
            Close panel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

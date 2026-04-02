"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  HStack,
  Progress,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type {
  CapabilityProfile,
  DownloadJob,
  DownloadMode,
  FallbackJobRequest,
  InfoResponse,
  NormalizedFormat,
  StrategyRequest,
} from "@/lib/types";
import { sanitizeFileName } from "@/lib/file";
import { collectCapabilityProfile } from "@/app/lib/capability";
import { downloaderApi } from "@/app/lib/client-api";
import { formatBytes } from "@/app/lib/format";
import Downloading from "@/app/components/Downloading";

interface DownloadButtonsProps {
  sourceUrl: string;
  info: InfoResponse;
  policyAccepted: boolean;
  capabilityProfile?: CapabilityProfile | null;
}

type BusyAction = "deciding" | "queueing" | null;
type FormatView = "audio" | "video";

const fallbackPollMs = 2500;

const formatFileName = (title: string, extension: string): string => {
  return `${sanitizeFileName(title)}.${extension}`;
};

const estimateVideoPairBytes = (video: NormalizedFormat, audio: NormalizedFormat): number | undefined => {
  const videoBytes = video.contentLength ?? 0;
  const audioBytes = audio.contentLength ?? 0;
  const total = videoBytes + audioBytes;
  return total > 0 ? total : undefined;
};

const modeColorMap: Record<DownloadMode, string> = {
  direct: "green",
  client_wasm: "blue",
  server_fallback: "orange",
};

const modeLabelMap: Record<DownloadMode, string> = {
  direct: "Direct delivery",
  client_wasm: "Client merge",
  server_fallback: "Server fallback",
};

const modeHintMap: Record<DownloadMode, string> = {
  direct: "Progressive format selected; no merge overhead.",
  client_wasm: "Device profile supports local merge in browser.",
  server_fallback: "Selection exceeded local safety thresholds.",
};

const getFallbackStatusColor = (status: DownloadJob["status"]): string => {
  if (status === "completed") {
    return "green";
  }

  if (status === "failed") {
    return "red";
  }

  if (status === "processing") {
    return "blue";
  }

  return "orange";
};

export default function DownloadButtons({
  sourceUrl,
  info,
  policyAccepted,
  capabilityProfile,
}: DownloadButtonsProps) {
  const [showCustomFormats, setShowCustomFormats] = useState(false);
  const [formatView, setFormatView] = useState<FormatView>("audio");
  const [busyAction, setBusyAction] = useState<BusyAction>(null);

  const [activeMode, setActiveMode] = useState<DownloadMode | null>(null);
  const [decisionReasons, setDecisionReasons] = useState<string[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const [mergeTask, setMergeTask] = useState<{ audio: NormalizedFormat; video: NormalizedFormat } | null>(null);
  const [fallbackJob, setFallbackJob] = useState<DownloadJob | null>(null);

  const pollTimerRef = useRef<number | null>(null);

  const panelBorder = useColorModeValue("rgba(15, 23, 42, 0.14)", "rgba(148, 163, 184, 0.3)");
  const panelBg = useColorModeValue("rgba(255, 255, 255, 0.78)", "rgba(7, 12, 25, 0.78)");
  const helperText = useColorModeValue("rgba(71, 85, 105, 0.95)", "rgba(148, 163, 184, 0.92)");
  const bodyInk = useColorModeValue("rgba(51, 65, 85, 0.95)", "rgba(203, 213, 225, 0.94)");
  const modeCardBg = useColorModeValue("rgba(255,255,255,0.76)", "rgba(2,6,23,0.72)");
  const tabsBg = useColorModeValue("rgba(241,245,249,0.86)", "rgba(3,7,18,0.72)");
  const fallbackBg = useColorModeValue("rgba(255,251,235,0.84)", "rgba(55,33,6,0.38)");
  const fallbackErrorText = useColorModeValue("orange.800", "orange.200");
  const alertIconColor = useColorModeValue("rose.700", "rose.200");
  const errorBg = useColorModeValue("rgba(254, 242, 242, 0.92)", "rgba(69, 10, 25, 0.46)");
  const errorBorder = useColorModeValue("rgba(244, 63, 94, 0.32)", "rgba(251, 113, 133, 0.42)");
  const errorText = useColorModeValue("rgba(136, 19, 55, 0.95)", "rgba(254, 226, 226, 0.92)");

  const isBusy = busyAction !== null;

  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current !== null) {
      window.clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearPollTimer();
    };
  }, [clearPollTimer]);

  useEffect(() => {
    clearPollTimer();
    setShowCustomFormats(false);
    setFormatView("audio");
    setBusyAction(null);
    setActiveMode(null);
    setDecisionReasons([]);
    setActionError(null);
    setMergeTask(null);
    setFallbackJob(null);
  }, [clearPollTimer, info.video.id, sourceUrl]);

  const triggerDirectDownload = useCallback(
    (format: NormalizedFormat) => {
      const anchor = document.createElement("a");
      anchor.href = format.url;
      anchor.download = formatFileName(info.video.title, format.container || "mp4");
      anchor.rel = "noopener noreferrer";
      anchor.target = "_blank";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    },
    [info.video.title]
  );

  const pollFallbackJob = useCallback(
    async (jobId: string) => {
      try {
        const job = await downloaderApi.getFallbackJob(jobId);
        setFallbackJob(job);

        if (job.status === "queued" || job.status === "processing") {
          clearPollTimer();
          pollTimerRef.current = window.setTimeout(() => {
            void pollFallbackJob(jobId);
          }, fallbackPollMs);
        }
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Fallback polling failed.");
      }
    },
    [clearPollTimer]
  );

  const queueFallbackJob = useCallback(
    async (audio: NormalizedFormat, video: NormalizedFormat, estimatedSizeBytes?: number) => {
      setBusyAction("queueing");
      clearPollTimer();

      const payload: FallbackJobRequest = {
        url: sourceUrl,
        audioItag: audio.itag,
        videoItag: video.itag,
        output: "mp4",
        estimatedSizeBytes,
      };

      const queued = await downloaderApi.createFallbackJob(payload);

      setFallbackJob({
        jobId: queued.jobId,
        status: queued.status,
        progressPct: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      });

      await pollFallbackJob(queued.jobId);
    },
    [clearPollTimer, pollFallbackJob, sourceUrl]
  );

  const resolveCapabilityProfile = useCallback(async (): Promise<CapabilityProfile> => {
    if (capabilityProfile) {
      return capabilityProfile;
    }

    return collectCapabilityProfile();
  }, [capabilityProfile]);

  const runAdaptiveVideoDownload = useCallback(
    async (video: NormalizedFormat, audio: NormalizedFormat, muxed?: NormalizedFormat) => {
      if (!policyAccepted) {
        setActionError("Accept the policy before downloading.");
        return;
      }

      setBusyAction("deciding");
      setActionError(null);
      setMergeTask(null);
      setFallbackJob(null);

      try {
        const estimatedSizeBytes = muxed?.contentLength ?? estimateVideoPairBytes(video, audio);
        const capability = await resolveCapabilityProfile();

        const strategyPayload: StrategyRequest = {
          capabilityProfile: capability,
          selection: {
            muxedItag: muxed?.itag,
            audioItag: audio.itag,
            videoItag: video.itag,
            estimatedSizeBytes,
            output: "mp4",
          },
        };

        const decision = await downloaderApi.decideStrategy(strategyPayload);
        setActiveMode(decision.mode);
        setDecisionReasons(decision.reasons);

        if (decision.mode === "direct") {
          if (!muxed) {
            throw new Error("Direct mode selected but no progressive stream is available.");
          }

          triggerDirectDownload(muxed);
          return;
        }

        if (decision.mode === "client_wasm") {
          setMergeTask({ audio, video });
          return;
        }

        if (!info.flags.fallbackEnabled) {
          throw new Error("This format requires server fallback, but fallback is disabled right now.");
        }

        await queueFallbackJob(audio, video, estimatedSizeBytes);
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Unable to execute adaptive download.");
      } finally {
        setBusyAction(null);
      }
    },
    [info.flags.fallbackEnabled, policyAccepted, queueFallbackJob, resolveCapabilityProfile, triggerDirectDownload]
  );

  const bestAudio = useMemo(() => info.audioFormats[0], [info.audioFormats]);
  const bestVideo = useMemo(() => info.videoFormats[0], [info.videoFormats]);
  const bestMuxed = useMemo(() => info.muxedFormats[0], [info.muxedFormats]);

  const downloadBestAudio = useCallback(() => {
    if (!policyAccepted) {
      setActionError("Accept the policy before downloading.");
      return;
    }

    if (!bestAudio) {
      setActionError("No audio-only format is available for this source.");
      return;
    }

    setActionError(null);
    setActiveMode("direct");
    setDecisionReasons(["Audio-only output can be delivered directly without merge."]);
    triggerDirectDownload(bestAudio);
  }, [bestAudio, policyAccepted, triggerDirectDownload]);

  const downloadBestVideo = useCallback(async () => {
    if (!bestVideo || !bestAudio) {
      setActionError("No compatible audio/video pair is available for adaptive video download.");
      return;
    }

    await runAdaptiveVideoDownload(bestVideo, bestAudio, bestMuxed);
  }, [bestAudio, bestMuxed, bestVideo, runAdaptiveVideoDownload]);

  return (
    <Box
      className="surface-card"
      border="1px solid"
      borderColor={panelBorder}
      bg={panelBg}
      borderRadius="2xl"
      p={{ base: 5, md: 7 }}
    >
      <Stack spacing={5}>
        <Box>
          <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.12em" color={helperText}>
            Stage 3
          </Text>
          <Text mt={1} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color={bodyInk}>
            Execute Download Flow
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
          <Button
            minH="46px"
            bg="linear-gradient(100deg, #34d399 0%, #10b981 100%)"
            color="white"
            _hover={{ filter: "brightness(1.08)" }}
            _active={{ filter: "brightness(0.96)" }}
            onClick={downloadBestAudio}
            isDisabled={!policyAccepted || isBusy}
          >
            Download best audio
          </Button>

          <Button
            minH="46px"
            bg="linear-gradient(100deg, #14b8a6 0%, #0ea5e9 100%)"
            color="white"
            _hover={{ filter: "brightness(1.08)" }}
            _active={{ filter: "brightness(0.96)" }}
            onClick={() => {
              void downloadBestVideo();
            }}
            isLoading={busyAction === "deciding" || busyAction === "queueing"}
            isDisabled={!policyAccepted || isBusy}
          >
            Smart best video
          </Button>

          <Button
            minH="46px"
            variant="outline"
            borderColor={panelBorder}
            onClick={() => setShowCustomFormats((value) => !value)}
          >
            {showCustomFormats ? "Hide format matrix" : "Open format matrix"}
          </Button>
        </SimpleGrid>

        <Text color={helperText}>
          The strategy engine prioritizes direct stream delivery, then browser merge, then server fallback.
        </Text>

        {activeMode && (
          <Box border="1px solid" borderColor={panelBorder} borderRadius="xl" p={4} bg={modeCardBg}>
            <HStack spacing={2} flexWrap="wrap" mb={decisionReasons.length > 0 ? 2 : 0}>
              <Badge colorScheme={modeColorMap[activeMode]}>{modeLabelMap[activeMode]}</Badge>
              <Text fontSize="sm" color={bodyInk}>
                {modeHintMap[activeMode]}
              </Text>
            </HStack>

            {decisionReasons.length > 0 && (
              <Stack spacing={1}>
                {decisionReasons.map((reason) => (
                  <Text key={reason} fontSize="sm" color={helperText}>
                    • {reason}
                  </Text>
                ))}
              </Stack>
            )}
          </Box>
        )}

        {showCustomFormats && (
          <Box>
            <Tabs
              variant="unstyled"
              onChange={(nextIndex) => {
                setFormatView(nextIndex === 0 ? "audio" : "video");
              }}
              index={formatView === "audio" ? 0 : 1}
            >
              <TabList p={1} border="1px solid" borderColor={panelBorder} borderRadius="xl" bg={tabsBg} gap={2}>
                <Tab flex="1" minH="44px" borderRadius="lg" _selected={{ bg: "rgba(52, 211, 153, 0.2)", color: "green.100" }}>
                  Audio tracks
                </Tab>
                <Tab flex="1" minH="44px" borderRadius="lg" _selected={{ bg: "rgba(56, 189, 248, 0.22)", color: "cyan.100" }}>
                  Video tracks
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel px={0} pt={4}>
                  <Stack spacing={2}>
                    {info.audioFormats.length === 0 && (
                      <Box className="format-empty-state">
                        <Text color={helperText}>No audio-only formats exposed for this source.</Text>
                      </Box>
                    )}

                    {info.audioFormats.map((format) => (
                      <Button
                        key={format.itag}
                        className="format-row"
                        minH="54px"
                        justifyContent="space-between"
                        onClick={() => triggerDirectDownload(format)}
                        isDisabled={!policyAccepted || isBusy}
                      >
                        <HStack spacing={3}>
                          <Badge colorScheme="green" variant="subtle">
                            {format.audioBitrate ?? "?"} kbps
                          </Badge>
                          <Text>{format.container || "audio"}</Text>
                        </HStack>
                        <Text fontSize="sm">{formatBytes(format.contentLength)}</Text>
                      </Button>
                    ))}
                  </Stack>
                </TabPanel>

                <TabPanel px={0} pt={4}>
                  <Stack spacing={2}>
                    {info.videoFormats.length === 0 && (
                      <Box className="format-empty-state">
                        <Text color={helperText}>No video-only formats exposed for this source.</Text>
                      </Box>
                    )}

                    {info.videoFormats.map((format) => (
                      <Button
                        key={format.itag}
                        className="format-row"
                        minH="54px"
                        justifyContent="space-between"
                        isDisabled={!policyAccepted || !bestAudio || isBusy}
                        onClick={() => {
                          if (!bestAudio) {
                            setActionError("No audio track available for this selection.");
                            return;
                          }

                          void runAdaptiveVideoDownload(format, bestAudio);
                        }}
                      >
                        <HStack spacing={3}>
                          <Badge colorScheme="blue" variant="subtle">
                            {format.qualityLabel ?? "Unknown"}
                          </Badge>
                          <Text>{format.container || "video"}</Text>
                        </HStack>
                        <Text fontSize="sm">{formatBytes(format.contentLength)}</Text>
                      </Button>
                    ))}
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        )}

        {fallbackJob && (
          <Box border="1px solid" borderColor={panelBorder} borderRadius="xl" p={4} bg={fallbackBg}>
            <Stack spacing={3}>
              <HStack justify="space-between" flexWrap="wrap">
                <Badge colorScheme={getFallbackStatusColor(fallbackJob.status)}>Fallback worker</Badge>
                <Text fontSize="sm" color={bodyInk}>
                  {fallbackJob.status}
                </Text>
              </HStack>

              <Progress value={fallbackJob.progressPct} size="sm" rounded="md" colorScheme="orange" />

              {fallbackJob.downloadUrl && (
                <Button
                  as="a"
                  href={fallbackJob.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  minH="44px"
                  bg="linear-gradient(100deg, #34d399 0%, #10b981 100%)"
                  color="white"
                  _hover={{ filter: "brightness(1.08)" }}
                  _active={{ filter: "brightness(0.96)" }}
                >
                  Download fallback output
                </Button>
              )}

              {fallbackJob.errorCode && (
                <Text fontSize="sm" color={fallbackErrorText}>
                  Error: {fallbackJob.errorCode}
                </Text>
              )}
            </Stack>
          </Box>
        )}

        {mergeTask && (
          <Downloading
            audio={mergeTask.audio}
            video={mergeTask.video}
            title={info.video.title}
            onClose={() => {
              setMergeTask(null);
            }}
          />
        )}

        {actionError && (
          <Alert status="error" borderRadius="xl" bg={errorBg} border="1px solid" borderColor={errorBorder}>
            <AlertIcon color={alertIconColor} />
            <AlertDescription color={errorText}>{actionError}</AlertDescription>
          </Alert>
        )}
      </Stack>
    </Box>
  );
}

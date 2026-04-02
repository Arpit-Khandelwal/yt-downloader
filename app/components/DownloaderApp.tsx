"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import DownloadButtons from "@/app/components/DownloadButtons";
import { collectCapabilityProfile } from "@/app/lib/capability";
import { downloaderApi } from "@/app/lib/client-api";
import { formatCapabilityValue, formatDuration } from "@/app/lib/format";
import type { CapabilityProfile, InfoResponse } from "@/lib/types";

const POLICY_STORAGE_KEY = "ytd_policy_ack_v1";

const isLikelyYouTubeUrl = (value: string): boolean => {
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

export default function DownloaderApp() {
  const { colorMode, toggleColorMode } = useColorMode();

  const [inputUrl, setInputUrl] = useState("");
  const [activeUrl, setActiveUrl] = useState("");
  const [info, setInfo] = useState<InfoResponse | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [capabilityProfile, setCapabilityProfile] = useState<CapabilityProfile | null>(null);
  const [loadingCapability, setLoadingCapability] = useState(true);

  const sectionBorder = useColorModeValue("rgba(15, 23, 42, 0.14)", "rgba(148, 163, 184, 0.3)");
  const sectionBg = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(7, 12, 25, 0.8)");
  const sectionShadow = useColorModeValue("0 22px 72px rgba(15, 23, 42, 0.12)", "0 30px 96px rgba(2, 6, 23, 0.42)");
  const headingInk = useColorModeValue("rgba(15, 23, 42, 0.96)", "rgba(241, 245, 249, 0.96)");
  const bodyInk = useColorModeValue("rgba(51, 65, 85, 0.94)", "rgba(203, 213, 225, 0.92)");
  const helperInk = useColorModeValue("rgba(71, 85, 105, 0.94)", "rgba(148, 163, 184, 0.92)");
  const inputBg = useColorModeValue("rgba(255,255,255,0.92)", "rgba(2,6,23,0.72)");
  const previewBg = useColorModeValue("rgba(247,250,252,0.9)", "rgba(3,7,18,0.8)");
  const dangerBg = useColorModeValue("rgba(254, 242, 242, 0.9)", "rgba(69, 10, 25, 0.42)");
  const dangerBorder = useColorModeValue("rgba(244, 63, 94, 0.32)", "rgba(251, 113, 133, 0.4)");
  const dangerInk = useColorModeValue("rgba(136, 19, 55, 0.95)", "rgba(254, 226, 226, 0.9)");

  useEffect(() => {
    const accepted = window.localStorage.getItem(POLICY_STORAGE_KEY) === "true";
    setPolicyAccepted(accepted);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const collect = async () => {
      try {
        const profile = await collectCapabilityProfile();

        if (!cancelled) {
          setCapabilityProfile(profile);
        }
      } finally {
        if (!cancelled) {
          setLoadingCapability(false);
        }
      }
    };

    void collect();

    return () => {
      cancelled = true;
    };
  }, []);

  const acceptPolicy = useCallback(() => {
    window.localStorage.setItem(POLICY_STORAGE_KEY, "true");
    setPolicyAccepted(true);
    setErrorMessage(null);
  }, []);

  const resetSession = useCallback(() => {
    setInfo(null);
    setErrorMessage(null);
    setActiveUrl("");
  }, []);

  const analyzeUrl = useCallback(async () => {
    if (!policyAccepted) {
      setErrorMessage("Accept the policy before analyzing a URL.");
      return;
    }

    const normalized = inputUrl.trim();

    if (!normalized) {
      setErrorMessage("Enter a YouTube URL to continue.");
      return;
    }

    if (!isLikelyYouTubeUrl(normalized)) {
      setErrorMessage("This tool currently supports YouTube URLs only.");
      return;
    }

    setLoadingInfo(true);
    setErrorMessage(null);
    setInfo(null);

    try {
      const response = await downloaderApi.fetchInfo(normalized);
      setInfo(response);
      setActiveUrl(normalized);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch media metadata.");
    } finally {
      setLoadingInfo(false);
    }
  }, [inputUrl, policyAccepted]);

  const capabilitySignals = useMemo(() => {
    if (!capabilityProfile) {
      return [];
    }

    return [
      {
        label: "WebAssembly",
        value: capabilityProfile.wasm ? "Available" : "Unavailable",
      },
      {
        label: "Isolation",
        value: capabilityProfile.crossOriginIsolated ? "Isolated" : "Standard",
      },
      {
        label: "Threads",
        value: formatCapabilityValue(capabilityProfile.hardwareConcurrency),
      },
      {
        label: "Device memory",
        value: formatCapabilityValue(capabilityProfile.deviceMemoryGb, " GB"),
      },
      {
        label: "Storage quota",
        value:
          capabilityProfile.storageEstimateMb === null
            ? "Unknown"
            : `${Math.round(capabilityProfile.storageEstimateMb)} MB`,
      },
      {
        label: "Device class",
        value: capabilityProfile.isMobile ? "Mobile" : "Desktop",
      },
    ];
  }, [capabilityProfile]);

  return (
    <Box className="studio-root" minH="100vh" pb={{ base: 12, md: 16 }}>
      <Container maxW="7xl" px={{ base: 4, md: 8 }} pt={{ base: 8, md: 14 }}>
        <Stack spacing={{ base: 5, md: 8 }}>
          <Flex
            className="section-enter delay-1"
            direction={{ base: "column", lg: "row" }}
            justify="space-between"
            align={{ base: "stretch", lg: "flex-start" }}
            gap={5}
          >
            <Box maxW="900px">
              <HStack spacing={2} mb={4} flexWrap="wrap">
                <Badge colorScheme="cyan" px={3} py={1} borderRadius="full">
                  Direct-first
                </Badge>
                <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                  WASM merge
                </Badge>
                <Badge colorScheme="orange" px={3} py={1} borderRadius="full">
                  Quota fallback
                </Badge>
              </HStack>

              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "6xl" }}
                lineHeight={{ base: 1.08, md: 1 }}
                letterSpacing="-0.03em"
                color={headingInk}
              >
                Adaptive Downloader Control Center
              </Heading>

              <Text mt={4} fontSize={{ base: "md", md: "lg" }} color={bodyInk} maxW="760px" lineHeight="1.8">
                Start with metadata intelligence, choose resilient download paths automatically, and keep heavy work on
                the client when possible.
              </Text>
            </Box>

            <Button
              alignSelf={{ base: "flex-start", lg: "flex-start" }}
              minH="44px"
              px={5}
              variant="outline"
              borderColor={sectionBorder}
              onClick={toggleColorMode}
            >
              {colorMode === "dark" ? "Switch to light" : "Switch to dark"}
            </Button>
          </Flex>

          <SimpleGrid columns={{ base: 1, xl: 5 }} spacing={5} className="section-enter delay-2">
            <Box
              className="surface-card"
              gridColumn={{ base: "auto", xl: "span 3" }}
              border="1px solid"
              borderColor={sectionBorder}
              bg={sectionBg}
              boxShadow={sectionShadow}
              borderRadius="2xl"
              p={{ base: 5, md: 7 }}
            >
              <Stack spacing={5}>
                <Flex justify="space-between" align="center" gap={4} flexWrap="wrap">
                  <Box>
                    <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.12em" color={helperInk}>
                      Stage 1
                    </Text>
                    <Heading as="h2" mt={1} fontSize={{ base: "xl", md: "2xl" }} color={headingInk}>
                      Analyze Source URL
                    </Heading>
                  </Box>

                  <Button minH="44px" variant="ghost" onClick={resetSession} isDisabled={loadingInfo}>
                    Clear results
                  </Button>
                </Flex>

                {!policyAccepted && (
                  <Box className="policy-callout" border="1px solid" borderColor={dangerBorder} bg={dangerBg} borderRadius="xl" p={4}>
                    <Stack spacing={3}>
                      <Text fontWeight="semibold" color={dangerInk}>
                        Policy gate required
                      </Text>
                      <Text color={dangerInk}>
                        Download only content you are authorized to save. Public-hosted mode excludes auth-cookie bypass
                        and private access flows.
                      </Text>
                      <Button
                        alignSelf="flex-start"
                        minH="44px"
                        px={5}
                        bg="linear-gradient(100deg, #fb7185 0%, #f43f5e 100%)"
                        color="white"
                        _hover={{ filter: "brightness(1.08)" }}
                        _active={{ filter: "brightness(0.96)" }}
                        onClick={acceptPolicy}
                      >
                        I understand
                      </Button>
                    </Stack>
                  </Box>
                )}

                <Box
                  as="form"
                  onSubmit={(event: React.FormEvent<HTMLDivElement>) => {
                    event.preventDefault();
                    void analyzeUrl();
                  }}
                >
                  <FormControl>
                    <FormLabel color={bodyInk}>YouTube video URL</FormLabel>
                    <Flex direction={{ base: "column", md: "row" }} gap={3}>
                      <Input
                        value={inputUrl}
                        onChange={(event) => setInputUrl(event.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        size="lg"
                        minH="52px"
                        bg={inputBg}
                        borderColor={sectionBorder}
                        _focusVisible={{
                          borderColor: "cyan.400",
                          boxShadow: "0 0 0 3px rgba(34, 211, 238, 0.2)",
                        }}
                      />
                      <Button
                        type="submit"
                        minH="52px"
                        minW={{ base: "100%", md: "220px" }}
                        bg="linear-gradient(102deg, #14b8a6 0%, #0ea5e9 100%)"
                        color="white"
                        _hover={{ filter: "brightness(1.08)" }}
                        _active={{ filter: "brightness(0.96)" }}
                        isLoading={loadingInfo}
                        isDisabled={!policyAccepted}
                      >
                        Analyze
                      </Button>
                    </Flex>
                    <FormHelperText color={helperInk}>
                      Single video URLs are supported. Playlists and channels are intentionally blocked.
                    </FormHelperText>
                  </FormControl>
                </Box>

                {errorMessage && (
                  <Box border="1px solid" borderColor={dangerBorder} bg={dangerBg} borderRadius="xl" p={3}>
                    <Text color={dangerInk}>{errorMessage}</Text>
                  </Box>
                )}

                {loadingInfo && (
                  <HStack spacing={3} py={3}>
                    <Spinner color="cyan.300" />
                    <Text color={helperInk}>Querying extractor and normalizing formats...</Text>
                  </HStack>
                )}
              </Stack>
            </Box>

            <Box
              className="surface-card"
              gridColumn={{ base: "auto", xl: "span 2" }}
              border="1px solid"
              borderColor={sectionBorder}
              bg={sectionBg}
              boxShadow={sectionShadow}
              borderRadius="2xl"
              p={{ base: 5, md: 6 }}
            >
              <Stack spacing={4}>
                <Box>
                  <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.12em" color={helperInk}>
                    Runtime snapshot
                  </Text>
                  <Heading as="h2" mt={1} fontSize={{ base: "xl", md: "2xl" }} color={headingInk}>
                    Device Capability
                  </Heading>
                </Box>

                {loadingCapability && (
                  <HStack spacing={3}>
                    <Spinner size="sm" color="cyan.300" />
                    <Text color={helperInk}>Collecting browser capability profile...</Text>
                  </HStack>
                )}

                {!loadingCapability && capabilitySignals.length > 0 && (
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2.5}>
                    {capabilitySignals.map((signal) => (
                      <Box key={signal.label} className="runtime-chip">
                        <Text className="runtime-chip-label">{signal.label}</Text>
                        <Text className="runtime-chip-value">{signal.value}</Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                )}

                {!loadingCapability && capabilitySignals.length === 0 && (
                  <Text color={helperInk}>Capability telemetry is unavailable in this browser context.</Text>
                )}
              </Stack>
            </Box>
          </SimpleGrid>

          {info && (
            <Stack spacing={5} className="section-enter delay-3">
              <Box
                className="surface-card"
                border="1px solid"
                borderColor={sectionBorder}
                bg={sectionBg}
                boxShadow={sectionShadow}
                borderRadius="2xl"
                p={{ base: 5, md: 7 }}
              >
                <Stack spacing={6}>
                  <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }} gap={3}>
                    <Box>
                      <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.12em" color={helperInk}>
                        Stage 2
                      </Text>
                      <Heading as="h2" mt={1} fontSize={{ base: "2xl", md: "3xl" }} color={headingInk}>
                        Delivery Strategy
                      </Heading>
                    </Box>

                    <HStack spacing={2} flexWrap="wrap">
                      <Badge colorScheme="green">{info.muxedFormats.length} direct</Badge>
                      <Badge colorScheme="blue">{info.videoFormats.length} video-only</Badge>
                      <Badge colorScheme="yellow">{info.audioFormats.length} audio-only</Badge>
                      <Badge colorScheme={info.flags.fallbackEnabled ? "green" : "red"}>
                        {info.flags.fallbackEnabled ? "fallback enabled" : "fallback disabled"}
                      </Badge>
                    </HStack>
                  </Flex>

                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
                    <Box border="1px solid" borderColor={sectionBorder} borderRadius="xl" overflow="hidden" bg={previewBg}>
                      {info.video.thumbnailUrl ? (
                        <AspectRatio ratio={16 / 9}>
                          <Image
                            src={info.video.thumbnailUrl}
                            alt={`Thumbnail for ${info.video.title}`}
                            w="100%"
                            h="100%"
                            objectFit="cover"
                          />
                        </AspectRatio>
                      ) : (
                        <Flex align="center" justify="center" minH="220px">
                          <Text color={helperInk}>No thumbnail available</Text>
                        </Flex>
                      )}
                    </Box>

                    <Stack spacing={3.5}>
                      <Heading as="h3" fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.2" color={headingInk}>
                        {info.video.title}
                      </Heading>

                      <Text color={bodyInk}>{info.video.author}</Text>

                      <HStack spacing={2} flexWrap="wrap">
                        <Badge colorScheme="green" variant="subtle">
                          {formatDuration(info.video.lengthSeconds)}
                        </Badge>
                        <Badge colorScheme="purple" variant="subtle">
                          {info.video.id}
                        </Badge>
                      </HStack>

                      <Divider borderColor={sectionBorder} />

                      <Button
                        as="a"
                        href={info.video.webpageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        minH="44px"
                        alignSelf="flex-start"
                        variant="outline"
                        borderColor={sectionBorder}
                      >
                        Open source video
                      </Button>
                    </Stack>
                  </SimpleGrid>
                </Stack>
              </Box>

              <DownloadButtons
                sourceUrl={activeUrl || inputUrl.trim()}
                info={info}
                policyAccepted={policyAccepted}
                capabilityProfile={capabilityProfile}
              />
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

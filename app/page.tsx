"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Heading,
  Input,
  Image,
  Skeleton,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Button,
  Spinner,
} from "@chakra-ui/react";
import "@fontsource/cormorant-garamond";
import "@fontsource/judson";
import DownloadGrid from "./downloadGrid";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ytdl from "ytdl-core";

import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

// Extending theme to include custom fonts
const theme = extendTheme({
  fonts: {
    heading: `'Cormorant Garamond', serif`,
    body: `'Judson', serif`,
  },
});

const App = () => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [audio, setAudio] = useState([]);
  const [video, setVideo] = useState([]);

  const [loading, setLoading] = useState(false);

  // const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const getDetails = async (url: string) => {
      setLoading(true);
      let info: any;

      if (url) {
        // info = await ytdl.getInfo(url);
        const res = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
        // try {
        //   console.log(url)
        //   info = await ytdl.getInfo(url as string);
        // } catch (error) {
        //   console.log("lmao: ",error)
        // }
        info = await res.json();
      } else {
        info = "";
      }

      setLoading(false);
      if (info) {
        let thumbnails =
          info?.player_response?.videoDetails?.thumbnail?.thumbnails;
        let thumbnailUrl = thumbnails?.length
          ? thumbnails[thumbnails.length - 1].url
          : "";
        const videoDetails = info?.player_response?.videoDetails;
        if (videoDetails) {
          setTitle(videoDetails.title);
          setThumbnailUrl(thumbnailUrl);
          const formats = info.formats || [];
          setAudio(
            formats.filter((item: any) => item.mimeType.includes("audio"))
          );
          setVideo(
            formats.filter(
              (item: any) => item.mimeType.includes("video") && item.hasAudio
            )
          );
          console.log("video: ", video);
          console.log("audio: ", audio);
        } else {
          console.error("Video details not found.");
        }
      } else {
        console.log("Error:", info);
        setTitle(info["message"]);
        setThumbnailUrl("");
      }
    };
    getDetails(url);
  }, [url]);

  return (
    <ChakraProvider theme={theme}>
      <Analytics />
      <SpeedInsights />
      <Box
        maxW="3xl"
        mx="auto"
        py={{ base: 12, md: 24 }}
        px={{ base: 4, md: 6 }}
      >
        <Box textAlign="center" mb={6}>
          <Heading as="h1" size="2xl" fontWeight="bold">
            Download YouTube Videos
          </Heading>
          <Text mt={4} color="gray.500" maxW="600px" mx="auto">
            Easily download your favorite YouTube videos in audio or video
            format with our simple and fast downloader.
          </Text>
        </Box>
        <Box
          bg="gray.100"
          _dark={{ bg: "gray.800" }}
          rounded="xl"
          p={{ base: 6, md: 8 }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={6}
        >
          <Input
            type="text"
            placeholder="Enter Youtube video URL"
            size="lg"
            w="full"
            maxW="md"
            value={url}
            onChange={async (e) => {
              setUrl(e.target.value);
            }}
            alignContent={"center"}
            margin={"2rem"}
          />
          {loading ? (
            <Spinner size="xl" />
          ) : (
            title && (
              <Box
                // display="grid"
                // gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }}
                // gap={4}
                w="full"
              >
                <Box>
                  {thumbnailUrl && (
                    <Image
                      src={thumbnailUrl}
                      alt="Video Thumbnail"
                      w="full"
                      h="auto"
                      rounded="xl"
                      bg="white"
                      _dark={{ bg: "gray.950" }}
                      boxSize={"auto"}
                    />
                  )}
                  <Text fontSize="3xl">{title}</Text>
                </Box>
                <Tabs variant="soft-rounded" colorScheme="teal">
                  <TabList>
                    <Tab>Audio</Tab>
                    <Tab>Video</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      {audio &&
                        audio.map((element, index) => (
                          <DownloadGrid key={index} media={element} name=""/>
                        ))}
                    </TabPanel>
                    <TabPanel>
                      {video &&
                        video.map((element, index) => (
                          <DownloadGrid key={index} media={element} name=""/>
                        ))}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            )
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default App;

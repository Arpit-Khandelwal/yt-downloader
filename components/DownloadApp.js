// components/DownloadApp.js
'use client'

import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Heading,
  Input,
  Image,
  extendTheme,
  Skeleton,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab
} from "@chakra-ui/react";
import "@fontsource/cormorant-garamond";
import "@fontsource/judson";
import DownloadGrid from "./DownloadGrid";
import { Analytics } from "@vercel/analytics/react";

// Extending theme to include custom fonts
const theme = extendTheme({
  fonts: {
    heading: `'Cormorant Garamond', serif`,
    body: `'Judson', serif`,
  },
});

const DownloadApp = () => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [audio, setAudio] = useState([]);
  const [video, setVideo] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDetails = async () => {
    setLoading(true);
    const res = await fetch(`/api/info?url=${encodeURIComponent(url)}`);

    let data = await res.json();
    setLoading(false);
    if (res.ok) {
      let thumbnailUrl =
        data["player_response"]["videoDetails"]["thumbnail"]["thumbnails"] || "";
      thumbnailUrl = thumbnailUrl[thumbnailUrl.length - 1]["url"];

      setTitle(data["player_response"]["videoDetails"]["title"]);
      setThumbnailUrl(thumbnailUrl);
      setAudio(data.formats.filter((item) => item.mimeType.includes("audio")));
      setVideo(data.formats.filter((item) => item.mimeType.includes("video") && item.hasAudio));
    } else {
      console.log("Error:", data);
      setTitle(data["message"]);
      setThumbnailUrl("");
    }
  };

  useEffect(() => {
    if (url) {
      getDetails();
    }
  }, [url]);

  return (
    <ChakraProvider theme={theme}>
      <Analytics />
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

          {title && (
            <Skeleton isLoaded={!loading}>
              <Box w="full">
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
                      <DownloadGrid media={audio} />
                    </TabPanel>
                    <TabPanel>
                      <DownloadGrid media={video} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Skeleton>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default DownloadApp;

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
  Button,
  Spinner,
  Center,
} from "@chakra-ui/react";
import "@fontsource/cormorant-garamond";
import "@fontsource/judson";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import DownloadButtons from "./components/DownloadButtons";

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

  const [toggleOptions, setToogleOptions] = useState(false);

  const [loading, setLoading] = useState(false);


  const getDetails = async (url: string) => {

    setLoading(true);

    const res = await fetch("/api/info?url=" + encodeURIComponent(url)).then((res) => res.json());
    console.log(res);

    setTitle(res.videoDetails.title);
    setThumbnailUrl(res.videoDetails.thumbnails[res.videoDetails.thumbnails.length - 1].url);




    setLoading(false);

  }



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
          // margin={"2rem"}
          />
          <Button colorScheme="red" size="lg" onClick={() => getDetails(url)} >Submit </Button>



          {loading ? (
            <Spinner size="xl" />
          ) : (
            thumbnailUrl && (
              <Box
                // display="grid"
                // gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }}
                // gap={4}
                alignContent="center"
                w="full"
              >
                <Center>
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
                    <Text fontSize="3xl" textAlign="center">{title}</Text>

                  </Box>
                </Center>
                <DownloadButtons toggleOptions={toggleOptions} setToogleOptions={setToogleOptions} url={url} />

              </Box>
            )
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default App;

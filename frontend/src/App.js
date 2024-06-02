// app.jsx
import React from "react";
import { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Heading,
  Input,
  Button,
  Image,
  extendTheme,
  Spinner,
  Skeleton,
  Center,
  Flex,
  Stack,
  Spacer,
} from "@chakra-ui/react";
import "@fontsource/cormorant-garamond";
import "@fontsource/judson";
import { MdAudiotrack, MdCloudDownload } from "react-icons/md";

// Extending theme to include custom fonts
const theme = extendTheme({
  fonts: {
    heading: `'Cormorant Garamond', serif`,
    body: `'Judson', serif`,
  },
});

const App = () => {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("");

  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const callBackend = async (event) => {
    console.log("url from call backend: ", url);
    const res = await fetch(
      `http://192.168.29.157:3001/download?url=${encodeURIComponent(
        url
      )}&quality=${quality}`
    );
    if (!res.ok) {
      console.error("Server error");
      setTitle(res.status);
      setThumbnailUrl("");
      return;
    }
    const blob = await res.blob();
    const urlObject = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = urlObject;
    let extension = quality.includes("audio") ? "mp3" : "mp4";
    link.download = `title.${extension}`; //todo: get video title from ytdl.getinfo
    // link.click();
  };

  const getDetails = async (event) => {
    setLoading(true);
    const res = await fetch(
      `http://192.168.29.157:3001/info?url=${encodeURIComponent(url)}`
    );

    let data = await res.json();
    setLoading(false);
    if (res.ok) {
      let thumbnailUrl =
        data["player_response"]["videoDetails"]["thumbnail"]["thumbnails"];
      thumbnailUrl = thumbnailUrl[thumbnailUrl.length - 1]["url"]; //todo: make adaptive based on device resolution

      setTitle(data["player_response"]["videoDetails"]["title"]);
      setThumbnailUrl(thumbnailUrl);
    } else {
      console.log(data);
      setTitle(data["message"]);
      setThumbnailUrl("");
    }
  };

  useEffect(() => {
    if (url && quality) {
      callBackend();
    }
  }, [quality]);

  useEffect(() => {
    if (url) {
      getDetails();
    }
  }, [url]);

  return (
    <ChakraProvider theme={theme}>
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
                      // objectFit="cover"
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
                {thumbnailUrl && (
                  <Stack direction={["column", "row"]} spacing="1rem">
                    {/* todo: center these buttons */}
                    <Button
                      margin="1rem"
                      leftIcon={<MdAudiotrack />}
                      colorScheme="teal"
                      size="lg"
                      onClick={() => setQuality("highestaudio")}
                    >
                      Audio
                    </Button>
                    <Button
                      margin="1rem"
                      leftIcon={<MdCloudDownload />}
                      colorScheme="teal"
                      size="lg"
                      onClick={() => setQuality("highest")}
                    >
                      Video
                    </Button>
                  </Stack>
                )}
              </Box>
            </Skeleton>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default App;

import "./App.css";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  ChakraProvider,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";

function App() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("");

  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const callBackend = async (event) => {
    console.log("url from call backend: ", url);
    const res = await fetch(
      `http://localhost:3001/download?url=${encodeURIComponent(
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
    link.click();
  };

  const getDetails = async (event) => {
    console.log("inside get details wit url:", url);

    const res = await fetch(
      `http://localhost:3001/info?url=${encodeURIComponent(url)}`
    );

    let data = await res.json();
    if (res.ok) {
      console.log(data["player_response"]["videoDetails"]["title"]);

      let thumbnailUrl =
        data["player_response"]["videoDetails"]["thumbnail"]["thumbnails"];
      thumbnailUrl = thumbnailUrl[0]["url"]; //todo: make adaptive based on device resolution

      setTitle(data["player_response"]["videoDetails"]["title"]);
      setThumbnailUrl(thumbnailUrl);
    } else {
      console.log(data);
      setTitle(data["message"]);
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
    <ChakraProvider>
      <div className="App">
        <Box
          w="100vw"
          h="100vh"
          bgGradient="linear(to-tr, teal.300, yellow.400)"
          display="box"
          // justifyContent="center"
          // alignItems="center"
          padding="10rem"
        >
          <Input
            type="text"
            placeholder="Enter Youtube URL"
            value={url}
            onChange={async (e) => {
              setUrl(e.target.value);
            }}
            alignContent={"center"}
            margin={"2rem"}
          />
          <Box alignContent={"center"} >
            {thumbnailUrl && <Image src={thumbnailUrl} />}
            {title && (
              <Box >

                <Text>{title}</Text>
                <Button margin={"2rem"} onClick={() => setQuality("highestaudio")}>
                  Audio
                </Button>
                <Button onClick={() => setQuality("highest")}>Video</Button>
              </Box>
            )}
          </Box>
        </Box>
      </div>
    </ChakraProvider>
  );
}

export default App;

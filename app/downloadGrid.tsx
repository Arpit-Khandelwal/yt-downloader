"use client";
import { Text, Link, Box, Stack, Button, Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";



const DownloadGrid = ({ media, url }: any) => {

  const [downloadId, setDownloadId] = useState("");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");

  const [message, setMessage] = useState("Get");

  const start = async function initiateDownload() {
    const res = await fetch(`https://ytdl.socialplug.io/api/start-download?url=${encodeURIComponent(url)}&quality=${media}`);
    const resJson = await res.json();
    const downloadId = resJson.download_id;
    setDownloadId(downloadId);
    await getProgess();
  }
  async function getProgess() {
    if (!downloadId) return;
    const interval = setInterval(async () => {
      const res = await fetch(`https://ytdl.socialplug.io/api/get-download?download_id=${downloadId}`);
      const resJson = await res.json();
      if (resJson.download_url) {
        setProgress(100);
        clearInterval(interval);
        setDownloadUrl(resJson.download_url);
        setMessage("Download");
      }
      setProgress(resJson.progress / 10);
      setMessage(progress + "%");
    }, 2000);

  }


  return (
    <Grid
      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
      gap={4}
      padding={2}
    >
      <Box bg="white" p={2} rounded="md" boxShadow="md" flexDir="row">
        {media && (
          <>
            <Text fontSize="lg" display="inline" mr={2}>
              {media}
            </Text>
            <Button onClick={start} colorScheme="red" size="sm">
              {
                !downloadUrl ? (
                  <> {message} </>
                ) : (
                  <Link href={downloadUrl} download/>
                )
              }
            </Button>
          </>
        )}
      </Box>
    </Grid>
  );
};

export default DownloadGrid;

"use client";
import { Text, Link, Box, Stack, Button, Grid } from "@chakra-ui/react";
import { useEffect } from "react";



const DownloadGrid = ({ media, url,setDownloadId }: any) => {

  const start = async function initiateDownload() {
    const res = await fetch(`https://ytdl.socialplug.io/api/start-download?url=${encodeURIComponent(url)}&quality=${media}`);
    const resJson = await res.json();
    const downloadId = resJson.download_id;
    setDownloadId(downloadId);
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
            <Button color="teal.500" display="inline" onClick={start}>
                Download

            </Button>
          </>
        )}
      </Box>
    </Grid>
  );
};

export default DownloadGrid;

import {  Text, Link, Box, Stack } from "@chakra-ui/react";

const DownloadGrid = ({ media }) => {
  const download = async (event) => {
    event.preventDefault();
    const url = event.target.href;
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'video.mp4'; // or 'video.mp3' based on the type
    link.click();
  };
  
  const sortedMedia = [...media].sort((a, b) => b.contentLength - a.contentLength);


  return (
    <Stack gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
      {sortedMedia.map(({ qualityLabel, contentLength, container, url }, index) => (
        <Box
        //   as="datalist"
          key={index}
          bg="white"
          p={4}
          rounded="md"
          boxShadow="md"
        >
          {qualityLabel && (
            <Text fontSize="lg" mb={2}>
              Quality: {qualityLabel}
            </Text>
          )}
          {contentLength && (
            <Text fontSize="lg" mb={2}>
              Size: {(contentLength / 1_000_000).toFixed(1)} MB
            </Text>
          )}
          <Text fontSize="lg" mb={2}>
            Type: {container}
          </Text>
          <Link href={`/api/download?url=${encodeURIComponent(url)}&quality=${qualityLabel}`} color="teal.500" onClick={download}>
            Download
          </Link>
        </Box>
      ))}
    </Stack>
  );
};

export default DownloadGrid;

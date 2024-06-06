import {  Text, Link, Box, Stack } from "@chakra-ui/react";

const DownloadGrid = ({ media }: any) => {
  const download = async (event: any) => {};
  
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
          <Link href={url} color="teal.500" onClick={download}>
            Download
          </Link>
        </Box>
      ))}
    </Stack>
  );
};

export default DownloadGrid;

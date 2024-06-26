"use client";
import { Text, Link, Box, Stack, Button } from "@chakra-ui/react";
import { URL } from "url";

const DownloadGrid = ({ media, name }: any) => {
  return (
    <Stack
      gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      margin={2}
    >
      <Box bg="white" p={4} rounded="md" boxShadow="md">
        {media.qualityLabel && (
          <Text fontSize="lg" mb={2}>
            Quality: {media.qualityLabel}
          </Text>
        )}
        {media.contentLength && (
          <Text fontSize="lg" mb={2}>
            Size: {(media.contentLength / 1_000_000).toFixed(1)} MB
          </Text>
        )}
        <Text fontSize="lg" mb={2}>
          Type: {media.container}
        </Text>
        <Button color="teal.500">
          <Link href={media.url} isExternal>
            Download
          </Link>
        </Button>
      </Box>
    </Stack>
  );
};

export default DownloadGrid;

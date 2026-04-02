"use client";

import { Alert, AlertIcon, AlertDescription, Box } from "@chakra-ui/react";

export default function DownloadGrid() {
  return (
    <Box>
      <Alert status="info" rounded="md">
        <AlertIcon />
        <AlertDescription>
          This legacy component is deprecated. Use the adaptive download controls on the main page.
        </AlertDescription>
      </Alert>
    </Box>
  );
}

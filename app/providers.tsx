"use client";

import type { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { appTheme } from "@/app/theme";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <ChakraProvider theme={appTheme}>{children}</ChakraProvider>;
}

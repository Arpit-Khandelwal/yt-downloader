import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

export const appTheme = extendTheme({
  config,
  fonts: {
    heading: "'Cormorant Garamond', Georgia, serif",
    body: "'Judson', 'Iowan Old Style', serif",
  },
  styles: {
    global: {
      body: {
        color: "var(--ink-10)",
        bg: "transparent",
      },
      "*::placeholder": {
        color: "var(--ink-40)",
      },
    },
  },
  radii: {
    xl: "1rem",
    '2xl': "1.35rem",
  },
});

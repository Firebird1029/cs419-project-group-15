"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

// Simplified theme that works with client components
const customTheme = extendTheme({
  colors: {
    brand: {
      50: "#E8F4FF",
      100: "#C4E4FF",
      200: "#9FD4FF",
      300: "#7BC4FF",
      400: "#56B4FF",
      500: "#3B82F6",
      600: "#2563EB",
      700: "#1D4ED8",
      800: "#1E40AF",
      900: "#1E3A8A",
    },
    purple: {
      50: "#F3F1FF",
      100: "#E8E4FF",
      200: "#D6CCFF",
      300: "#C4B5FF",
      400: "#B19EFF",
      500: "#8B5CF6",
      600: "#7C3AED",
      700: "#6D28D9",
      800: "#5B21B6",
      900: "#4C1D95",
    },
  },
  fonts: {
    heading:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.900",
        _dark: {
          bg: "gray.900",
          color: "white",
        },
      },
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export default function CustomChakraProvider({ children }) {
  return <ChakraProvider theme={customTheme}>{children}</ChakraProvider>;
}

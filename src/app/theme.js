"use client";

import { createTheme } from "@mui/material";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const interFontFamily = inter.style.fontFamily;

const theme = createTheme({
  typography: {
    font: inter,
  },
  palette: {
    blue: {
      main: "#2196f3",
      gradient: "linear-gradient(to bottom right, #ADD8E6, #87CEFA, #ADD8E6)",
      animation: "linear-gradient(to right, #2196f3, #1e88e5, #87CEFA)",
      light: '#ADD8E6',
    },
    grey: {
      dark: "#222222",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: interFontFamily,
          color: '#222222',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: interFontFamily,
          color: '#222222',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(to bottom right, #ADD8E6, #87CEFA, #ADD8E6)", // Set gradient background
          color: "#fff",
          minHeight: "100vh",
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

export default theme;

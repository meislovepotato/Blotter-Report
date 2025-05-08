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
    green: {
      main: "rgb(149, 189, 151)",
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
          color: 'black',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: interFontFamily,
          color: 'black',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(to right, #66bb6a, #4fc3f7, #1976d2)", // Set gradient background
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

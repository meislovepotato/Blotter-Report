"use client";

import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

// Load Inter font
const inter = Inter({ subsets: ["latin"] });
const interFontFamily = inter.style.fontFamily;

const theme = createTheme({
  typography: {
    fontFamily: interFontFamily,
    fontSize: 14,
    button: {
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      main: "#6ca86a",
      light: "#99cf98",
      dark: "#4f7942",
    },
    secondary: {
      main: "#6eca6b",
    },
    background: {
      default: "#f6f9f6",
    },
    text: {
      primary: "#0d0e0d",
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
      styleOverrides: {
        outlined: {
          borderRadius: 8,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 8,
          marginTop: 4,
          backgroundColor: theme.palette.background.default,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
          maxHeight: 240,
          overflowY: "auto",
        }),
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          "& .MuiFormLabel-asterisk": {
            color: "#ff0000",
            fontWeight: 500,
          },
          userSelect: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 24,
          padding: 24,
          gap: 32,
          backgroundColor: theme.palette.background.default,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
          minHeight: 120,
        }),
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontWeight: "bold",
          fontSize: "1.875rem",
          padding: 0,
        }),
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          userSelect: "none",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }),
      },
    },
  },
});

export default theme;

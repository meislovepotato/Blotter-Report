import { Inter } from "next/font/google";
import "./globals.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

// Define the fonts with correct names
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Blotter System",
  description: "Generated by FriendsFries",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <body className={`${inter.variable}`}>
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}

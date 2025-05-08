import { Box, styled, Typography } from "@mui/material";
import { BarangayLogo } from "./components/images/index";

export const Container = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100%",
}));

export const StyledHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  background: theme.palette.green.main,
  height: 60,
  width: "100%",
  padding: "0 10px",
  marginBottom: 40,
}));

export const HeaderLogo = ({ sizefactor = 0.7 }) => (
  <BarangayLogo width={100 * sizefactor} height={90 * sizefactor} />
);

export const StyledTypography = styled(Typography)(({ theme }) => ({
  cursor: "pointer",
  color: "white",
  fontSize: 25,
  fontWeight: 700,
}));

export const StyledButton = styled("button")(({ theme }) => ({
  background: "white",
  color: theme.palette.green.main,
  fontSize: 21,
  border: `1px solid ${theme.palette.green.main}`,
  borderRadius: 5,
  cursor: "pointer",
  height: 40,
  width: 100,
}));

export const ContentContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 30,
}));

export const BackgroundContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  minHeight: "100vh",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("/background.jpg")', // replace with your path
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 1, // control image opacity here
    zIndex: 1,
  },

  // Make sure content appears on top
  "> *": {
    position: "relative",
    zIndex: 1,
  },
}));

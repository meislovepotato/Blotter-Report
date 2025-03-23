import { Box, styled, Typography } from "@mui/material";

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
  background: theme.palette.grey.dark,
  color: "#87CEFA",
  height: 60,
  width: "100%",
  padding: "0 10px",
  marginBottom: 40,
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  cursor: "pointer",
  color: theme.palette.blue.main,
  fontSize: 25,
  fontWeight: 700,
  // animation
  background: "linear-gradient(to right, #2196f3, #1e88e5, #87CEFA)",
  backgroundSize: "200% 100%", // Ensure the gradient is large enough to move
  WebkitBackgroundClip: "text", // For Webkit browsers (Chrome, Safari)
  WebkitTextFillColor: "transparent", // Make text transparent so the gradient is visible
  "&:hover": {
    animation: "moveGradient 3s linear infinite", // Keep animation on hover
  },
}));

export const StyledButton = styled("button")(({ theme }) => ({
  background: theme.palette.blue.main,
  color: "#fff",
  fontSize: 20,
  border: `1px solid ${theme.palette.blue.light}`,
  borderRadius: 5,
  cursor: "pointer",
  height: 40,
  width: 100,
  "&:hover": {
    background: "linear-gradient(to right, #2196f3, #1e88e5, #87CEFA)",
    backgroundSize: "200% 100%", // Ensure the gradient is large enough to move
    animation: "moveGradient 3s linear infinite", // Keep animation on hover
  },
}));

export const ContentContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 30,
}));
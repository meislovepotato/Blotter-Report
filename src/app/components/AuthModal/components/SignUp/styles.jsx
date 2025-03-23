import { Button, styled } from "@mui/material";

export const StyledButton = styled(Button)(({ theme }) => ({
  background: theme.palette.blue.main,
  color: "#fff",
  fontSize: 15,
  border: `1px solid ${theme.palette.blue.light}`,
  borderRadius: 5,
  cursor: "pointer",
  width: '100%',
  "&:hover": {
    background: "linear-gradient(to right, #2196f3, #1e88e5, #87CEFA)",
    backgroundSize: "200% 100%", // Ensure the gradient is large enough to move
    animation: "moveGradient 3s linear infinite", // Keep animation on hover
  },
}));
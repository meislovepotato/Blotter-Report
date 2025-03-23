import { Box, Paper, styled } from "@mui/material";

export const InputBox = styled(Paper)(() => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  boxShadow: 24,
  padding: 20,
  borderRadius: 8,

}));

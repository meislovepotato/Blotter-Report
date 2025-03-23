"use client";

import { useState } from "react";
import {
  Button,
  Box,
  Typography,
  Container,
  Modal,
  IconButton,
} from "@mui/material";
import { BlotterForm, SignIn, SignUp, StaffDashboard } from "./components";
import CloseIcon from "@mui/icons-material/Close";
import { ContentContainer, StyledButton, StyledHeader, StyledTypography } from "./styles";

const Page = () => {
  const [isRoute, setRoute] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);

  return (
    <Box>
      <StyledHeader>
        <StyledTypography onClick={() => setRoute(false)}>
          Blotter Reporting System
        </StyledTypography>
        <StyledButton onClick={() => setModalOpen(true)}>Staff</StyledButton>
      </StyledHeader>

      <ContentContainer>
        {isRoute === true ? (
          <BlotterForm />
        ) : (
          <>
            <Typography sx={{ fontSize: 40, }}>
              Welcome to the Blotter Reporting Page
            </Typography>
            <Typography sx={{ fontSize: 23, width: "50%" }}>
              This page allows civilians to report incidents, complaints, and
              other community concerns. Barangay workers will act on these
              reports. You can create an account to submit reports or log in to
              view and manage previous reports.
            </Typography>
            <StyledButton sx={{ width: "50%" }} onClick={() => setRoute(true)}>
              Blotter Form
            </StyledButton>
          </>
        )}
      </ContentContainer>

      {/* Staff Authentication Modal */}
      <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 10, right: 10 }}
            onClick={() => setModalOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" align="center" gutterBottom>
            {isSignIn ? "Staff Sign In" : "Staff Sign Up"}
          </Typography>
          {isSignIn ? (
            <SignIn onSignInSuccess={() => setModalOpen(false)} />
          ) : (
            <SignUp />
          )}
          <Button
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => setIsSignIn((prev) => !prev)}
          >
            {isSignIn
              ? "Create an account"
              : "Already have an account? Sign in"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Page;

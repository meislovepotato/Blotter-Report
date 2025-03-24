"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { AuthModal, BlotterForm, StaffDashboard } from "./components";
import {
  ContentContainer,
  StyledButton,
  StyledHeader,
  StyledTypography,
} from "./styles";

const Page = () => {
  const [isRoute, setRoute] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignInSuccess = () => {
    setIsAuthenticated(true);
    setModalOpen(false); // Close the modal
  };

  return (
    <Box>
      <StyledHeader>
        <StyledTypography onClick={() => setRoute(false)}>
          Blotter Reporting System
        </StyledTypography>
        <StyledButton onClick={() => setModalOpen(true)}>Staff</StyledButton>
      </StyledHeader>

      <ContentContainer>
        {!isAuthenticated &&
          (isRoute === true ? (
            <BlotterForm />
          ) : (
            <>
              <Typography sx={{ fontSize: 40 }}>
                Welcome to the Blotter Reporting Page
              </Typography>
              <Typography sx={{ fontSize: 23, width: "50%" }}>
                This page allows civilians to report incidents, complaints, and
                other community concerns. Barangay workers will act on these
                reports. You can create an account to submit reports or log in
                to view and manage previous reports.
              </Typography>
              <StyledButton
                sx={{ width: "50%" }}
                onClick={() => setRoute(true)}
              >
                Blotter Form
              </StyledButton>
            </>
          ))}
      </ContentContainer>

      {/* Staff Authentication Modal */}
      <AuthModal
        open={isModalOpen}
        isSignIn={isSignIn}
        setIsSignIn={setIsSignIn}
        onClose={() => setModalOpen(false)}
        onSignInSuccess={handleSignInSuccess}
      />

      {isAuthenticated ? <StaffDashboard /> : null}
    </Box>
  );
};

export default Page;

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
            <Typography sx={{ fontSize: 40 }}>
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
      <AuthModal
        open={isModalOpen}
        isSignIn={isSignIn}
        setIsSignIn={setIsSignIn}
        onClose={() => setModalOpen(false)}
      />

    </Box>
  );
};

export default Page;

"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { AuthModal, BlotterForm, AdminDashboard } from "./components";
import {
  ContentContainer,
  HeaderLogo,
  StyledButton,
  StyledHeader,
  StyledTypography,
} from "./styles";
import background from "./assets/background.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleSignInSuccess = () => {
    setIsAuthenticated(true);
    setModalOpen(false); // Close the modal
    router.push("/AdminDashboard"); // Redirect to the admin dashboard
  };

  return (
    <Box>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "150%",
          zIndex: -1, // Ensure it's behind the content
        }}
      >
        <Image
          src={background}
          alt="background"
          layout="fill"
          style={{
            objectFit: "cover", // Ensures the image covers the container
            opacity: 0.2,
          }}
        />
      </Box>

      <StyledHeader>
        <HeaderLogo />
        <StyledTypography onClick={() => router.push("/")}>
          Barangay Blotter Reporting System
        </StyledTypography>
        <StyledButton onClick={() => setModalOpen(true)}>Admin</StyledButton>
      </StyledHeader>

      <ContentContainer>
        <>
          <Typography sx={{ fontSize: 40, color: "white" }}>
            Welcome to the Blotter Reporting Page
          </Typography>
          <Typography sx={{ fontSize: 23, width: "50%", color: "white" }}>
            This page allows civilians to report incidents, complaints, and
            other community concerns. Barangay workers will act on these
            reports. You can create an account to submit reports or log in to
            view and manage previous reports.
          </Typography>
        </>
        <BlotterForm />
      </ContentContainer>

      {/* Admin Authentication Modal */}
      <AuthModal
        open={isModalOpen}
        isSignIn={isSignIn}
        setIsSignIn={setIsSignIn}
        onClose={() => setModalOpen(false)}
        onSignInSuccess={handleSignInSuccess}
      />

    </Box>
  );
};

export default Page;

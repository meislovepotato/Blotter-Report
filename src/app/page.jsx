"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { SignUp, SignIn, BlotterForm, StaffDashboard } from "./components";

const Page = () => {
  const [view, setView] = useState(null);
  const [role, setRole] = useState(null);

  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignInSuccess = (role) => {
    setRole(role);
  };

  return (
    <>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Blotter Reporting System
          </Typography>
          <Button color="inherit" onClick={() => setView("signin")}>
            Sign In
          </Button>
          <Button color="inherit" onClick={() => setView("signup")}>
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Container sx={{ mt: 4 }}>
        {role === "civilian" ? (
          <BlotterForm />
        ) : role === "staff" ? (
          <StaffDashboard />
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Welcome to the Blotter Reporting Page
            </Typography>
            <Typography variant="body1">
              This page allows civilians to report incidents, complaints, and
              other community concerns. Barangay workers will act on these
              reports. You can create an account to submit reports or log in to
              view and manage previous reports.
            </Typography>
            <Box sx={{ mt: 4 }}>
              {view === "signin" && (
                <SignIn onSignInSuccess={handleSignInSuccess} />
              )}
              {view === "signup" && <SignUp />}
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default Page;

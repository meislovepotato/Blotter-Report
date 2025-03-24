"use client";

import { Button, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SignIn, SignUp } from "./components";
import { InputBox } from "./styles";

const AuthModal = ({ isSignIn, setIsSignIn, open, onClose, onSignInSuccess }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <InputBox>
        <IconButton
          sx={{ position: "absolute", top: 10, right: 10 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" align="center" gutterBottom>
          {isSignIn ? "Sign In" : "Sign Up"}
        </Typography>
        {isSignIn ? (
          <SignIn onSignInSuccess={onSignInSuccess} />
        ) : (
          <SignUp onSignInSuccess={onClose} />
        )}
        <Button
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => setIsSignIn((prev) => !prev)}
        >
          {isSignIn ? "Create an account" : "Already have an account? Sign in"}
        </Button>
      </InputBox>
    </Modal>
  );
};

export default AuthModal;

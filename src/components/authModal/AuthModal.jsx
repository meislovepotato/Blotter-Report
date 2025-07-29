"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { FeedbackSnackbar, PrimaryButton, SecondaryButton } from "@/components";
import { INITIAL_SIGNUP_DATA, LOGIN_FORM_DATA } from "@/constants";
import { useRouter } from "next/navigation";
import { formatPHPhoneInput } from "@/lib";
import { CloseRounded } from "@mui/icons-material";
import { useSocket } from "@/context";

const AuthModal = ({ open, onClose }) => {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [loginForm, setLoginForm] = useState(LOGIN_FORM_DATA);
  const [signupForm, setSignupForm] = useState(INITIAL_SIGNUP_DATA);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const router = useRouter();

  const handleSwitch = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (mode === "login") {
      setLoginForm((prev) => ({ ...prev, [name]: value }));
    } else if (name === "phoneNumber") {
      const formatted = formatPHPhoneInput(value);
      setSignupForm((prev) => ({ ...prev, phoneNumber: formatted }));
    } else {
      setSignupForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const socket = useSocket();

  const handleSubmit = async () => {
    setLoading(true);

    if (mode === "login") {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setSnackbar({
          open: true,
          message: data?.message || "Login failed",
          severity: "error",
        });
        return;
      }

      setSnackbar({
        open: true,
        message: "Login successful!",
        severity: "success",
      });

      router.push("/admin");
      onClose();
    } else {
      if (signupForm.password !== signupForm.confirmPassword) {
        setSnackbar({
          open: true,
          message: "Passwords do not match",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setSnackbar({
          open: true,
          message: data?.message || "Signup failed",
          severity: "error",
        });
        return;
      }

      setSnackbar({
        open: true,
        message: "Signup successful! Wait for approval.",
        severity: "success",
      });

      if (socket) {
        socket.emit("admin-updated", {
          timestamp: Date.now(),
          message: "New admin request submitted!",
        });
        console.log("✅ admin-updated event emitted");
      }

      onClose();
      setSignupForm(INITIAL_SIGNUP_DATA);
    }
  };

  const resetAndClose = () => {
    onClose();
    setMode("login");
    setLoginForm(LOGIN_FORM_DATA);
    setSignupForm(INITIAL_SIGNUP_DATA);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={resetAndClose}
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle className="relative flex flex-col gap-2 text-center select-none">
          {mode === "login" ? "Log In" : "Sign Up"}
          <span className="text-xs font-normal text-text/50">
            {mode === "login"
              ? "Enter your admin ID and password to access the dashboard."
              : "Your request will be reviewed and approved before access is granted."}
          </span>
          <div
            onClick={resetAndClose}
            className="h-8 aspect-square absolute top-0 right-0 flex items-center justify-center *:text-text/50 cursor-pointer "
          >
            <CloseRounded />
          </div>
        </DialogTitle>
        <DialogContent className="flex flex-col gap-4 !pt-2">
          {mode === "signup" ? (
            <>
              <TextField
                label="Full Name"
                name="name"
                value={signupForm.name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                select
                label="Barangay Position"
                name="hierarchyRole"
                value={signupForm.hierarchyRole}
                onChange={handleChange}
                fullWidth
              >
                {["SECRETARY", "KAGAWAD", "SK_CHAIR", "CLERK", "TANOD"].map(
                  (role) => (
                    <MenuItem key={role} value={role}>
                      {role
                        .toLowerCase()
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </MenuItem>
                  )
                )}
              </TextField>
              <TextField
                label="Email"
                name="email"
                value={signupForm.email}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={signupForm.phoneNumber}
                onChange={handleChange}
                fullWidth
                type="tel"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">+63</InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Password"
                name="password"
                value={signupForm.password}
                onChange={handleChange}
                fullWidth
                type="password"
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                value={signupForm.confirmPassword}
                onChange={handleChange}
                fullWidth
                type="password"
              />
            </>
          ) : (
            <>
              <TextField
                label="Admin ID"
                name="adminId"
                value={loginForm.adminId}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Password"
                name="password"
                value={loginForm.password}
                onChange={handleChange}
                fullWidth
                type="password"
              />
            </>
          )}
        </DialogContent>

        <DialogActions className="flex flex-col gap-12">
          <PrimaryButton
            type="submit"
            disabled={loading}
            className="w-full"
            isForm
          >
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Submitting..."
              : mode === "login"
                ? "Log In"
                : "Sign Up"}
          </PrimaryButton>

          <span className="text-xs w-full text-center select-none text-text/60 md:text-sm">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <SecondaryButton
              onClick={handleSwitch}
              className="!text-xs !font-medium md:!text-sm"
              isForm
              type="button"
            >
              {mode === "login" ? "Sign Up" : "Log In"}
            </SecondaryButton>
          </span>
        </DialogActions>
      </Dialog>

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default AuthModal;

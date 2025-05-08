import { useState } from "react";
import { Container, TextField, Button, Box, Typography, InputAdornment, IconButton } from "@mui/material";
import { StyledButton } from "../SignUp/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const SignIn = ({ onSignInSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    adminKey: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async () => {
    // Check if adminKey is provided
    if (!formData.adminKey.trim()) {
      alert("admin key is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token); // Save the JWT token
        alert("Sign-in successful!");
        onSignInSuccess();
      } else {
        alert(data.message || "Invalid credentials, please try again.");
      }
    } catch (err) {
      console.error("Error during sign-in:", err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Email"
          name="email"
          type="email"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          onChange={handleChange}
          value={formData.password}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="admin Key"
          name="adminKey"
          onChange={handleChange}
          value={formData.adminKey}
          required
        />

        <StyledButton onClick={handleSignIn} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </StyledButton>
      </Box>
    </Container>
  );
}

export default SignIn;
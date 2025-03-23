import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";

export default function SignIn({ onSignInSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    staffKey: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
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
      <Typography variant="h4" gutterBottom>
        Barangay Staff Sign In
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <TextField
          fullWidth
          label="Staff Key"
          name="staffKey"
          onChange={handleChange}
          value={formData.staffKey}
          required
        />

        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>
      </form>
    </Container>
  );
}

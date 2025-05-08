import { useState } from "react";
import { Container, TextField, Box, InputAdornment, IconButton } from "@mui/material";
import { StyledButton } from "./styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Signup = ({ onSignInSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    adminId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    setIsSubmitting(true);
    setError("");

    if (!formData.name || !formData.email || !formData.address || !formData.password || !formData.adminId) {
      setError("All fields, including admin ID, are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("Sign-up successful!");
      setFormData({
        name: "",
        email: "",
        address: "",
        password: "",
        adminId: "",
      });

      if (onSignInSuccess) onSignInSuccess(); // Close modal after sign-up

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required />
        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        <TextField label="Address" name="address" value={formData.address} onChange={handleChange} required />
        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
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
        <TextField label="admin ID Number" name="adminId" value={formData.adminId} onChange={handleChange} />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <StyledButton onClick={handleSignUp} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Sign Up"}
        </StyledButton>
      </Box>
    </Container>
  );
}

export default Signup;
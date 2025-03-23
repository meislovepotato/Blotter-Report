import { useState } from "react";
import { Container, TextField, Box } from "@mui/material";
import { StyledButton } from "./styles";

const Signup = ({ onSignInSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    staffId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    setIsSubmitting(true);
    setError("");

    if (!formData.name || !formData.email || !formData.address || !formData.password || !formData.staffId) {
      setError("All fields, including Staff ID, are required.");
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
        staffId: "",
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
        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
        <TextField label="Staff ID Number" name="staffId" value={formData.staffId} onChange={handleChange} />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <StyledButton onClick={handleSignUp} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Sign Up"}
        </StyledButton>
      </Box>
    </Container>
  );
}

export default Signup;
import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";

export default function SignUp({ onSignInSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    staffId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.staffId.trim()) {
      alert("Staff ID is required.");
      return;
    }

    setIsSubmitting(true);

    fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          alert("Sign-up successful!");
          setFormData({
            name: "",
            email: "",
            address: "",
            password: "",
            staffId: "",
          });
        } else {
          alert(data.message || "Something went wrong");
        }
      })
      .catch((err) => {
        alert("Network error. Please try again.");
        console.error(err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Barangay Staff Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Staff ID Number"
          name="staffId"
          value={formData.staffId}
          
          onChange={handleChange}
          required
        />

        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </Button>
        </Box>
      </form>
    </Container>
  );
}

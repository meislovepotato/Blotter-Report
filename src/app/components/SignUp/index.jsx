import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";

export default function SignUp({ onSignInSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "civilian",
    staffId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate staffId if role is staff
    if (formData.role === "staff" && !formData.staffId.trim()) {
      alert("Staff ID is required for staff role.");
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
            role: "civilian",
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
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          margin="normal"
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          margin="normal"
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          margin="normal"
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          margin="normal"
          onChange={handleChange}
          required
        />

        <Typography variant="h6" gutterBottom>
          Sign Up As
        </Typography>
        <RadioGroup
          row
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <FormControlLabel
            value="civilian"
            control={<Radio />}
            label="Civilian"
          />
          <FormControlLabel
            value="staff"
            control={<Radio />}
            label="Barangay Staff"
          />
        </RadioGroup>

        {formData.role === "staff" && (
          <TextField
            fullWidth
            label="Staff ID Number"
            name="staffId"
            value={formData.staffId}
            margin="normal"
            onChange={handleChange}
            required
          />
        )}

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

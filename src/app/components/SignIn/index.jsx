import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

export default function SignIn({ onSignInSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "", role: "civilian", staffkey: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Replace with API call
    onSignInSuccess(formData.role);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>

      <RadioGroup row name="role" value={formData.role} onChange={handleChange}>
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
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          margin="normal"
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          margin="normal"
          onChange={handleChange}
          required
        />
        {formData.role === "staff" && (
          <TextField
            fullWidth
            label="Staff Key"
            name="staffkey"
            margin="normal"
            onChange={handleChange}
            required
          />
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign In
        </Button>
      </form>
    </Container>
  );
}

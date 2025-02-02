import { useState } from "react";
import { Container, TextField, Button, Typography, RadioGroup, FormControlLabel, Radio, Box } from "@mui/material";

export default function SignIn({ onSignInSuccess }) {
  const [formData, setFormData] = useState({ name: "", email: "", address: "", password: "", role: "civilian", staffId: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Replace with API call
    onSignInSuccess()
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Sign Up</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Name" name="name" margin="normal" onChange={handleChange} required />
        <TextField fullWidth label="Email" name="email" type="email" margin="normal" onChange={handleChange} required />
        <TextField fullWidth label="Address" name="address" margin="normal" onChange={handleChange} required />
        <TextField fullWidth label="Password" name="password" type="password" margin="normal" onChange={handleChange} required />
        
        <Typography variant="h6" gutterBottom>Sign Up As</Typography>
        <RadioGroup row name="role" value={formData.role} onChange={handleChange}>
          <FormControlLabel value="civilian" control={<Radio />} label="Civilian" />
          <FormControlLabel value="staff" control={<Radio />} label="Barangay Staff" />
        </RadioGroup>

        {formData.role === "staff" && (
          <TextField fullWidth label="Staff ID Number" name="staffId" margin="normal" onChange={handleChange} required />
        )}

        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>Sign Up</Button>
        </Box>
      </form>
    </Container>
  );
}

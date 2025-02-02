"use client";

import { useState } from "react";
import { Container, TextField, Button, Typography, MenuItem } from "@mui/material";

const BlotterForm = () => {
  const [formData, setFormData] = useState({
    complainant: "",
    respondent: "",
    incidentDate: "",
    location: "",
    description: "",
    category: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Blotter Submitted:", formData);
    // Perform API call or state update here
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Blotter Report Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Complainant Name" name="complainant" margin="normal" onChange={handleChange} required />
        <TextField fullWidth label="Respondent Name" name="respondent" margin="normal" onChange={handleChange} required />
        <TextField fullWidth label="Incident Date" name="incidentDate" type="date" margin="normal" onChange={handleChange} required InputLabelProps={{ shrink: true }} />
        <TextField fullWidth label="Location" name="location" margin="normal" onChange={handleChange} required />
        <TextField fullWidth label="Incident Description" name="description" multiline rows={4} margin="normal" onChange={handleChange} required />
        <TextField fullWidth select label="Category" name="category" margin="normal" onChange={handleChange} required>
          <MenuItem value="Theft">Theft</MenuItem>
          <MenuItem value="Assault">Assault</MenuItem>
          <MenuItem value="Property Damage">Property Damage</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Submit Report
        </Button>
      </form>
    </Container>
  );
};

export default BlotterForm;

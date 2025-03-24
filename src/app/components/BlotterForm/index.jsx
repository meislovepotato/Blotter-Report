"use client";

import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { StyledButton } from "./styles";

const BlotterForm = () => {
  const [formData, setFormData] = useState({
    complainant: "",
    fullAddress: "",
    description: "",
    phoneNumber: "",
    otherContacts: "",
    attachmentFront: null,
    attachmentBack: null,
    previewFront: null, // Added for previewing the front attachment
    previewBack: null, // Added for previewing the back attachment
  });
  const [phoneError, setPhoneError] = useState(false);
  const [phoneHelperText, setPhoneHelperText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, phoneNumber: value });

    const phonePattern = /^(09\d{9}|\+639\d{9})$/;
    if (!phonePattern.test(value)) {
      setPhoneError(true);
      setPhoneHelperText(
        "Invalid phone number. Please use the correct format (e.g., 09171234567 or +639171234567)."
      );
    } else {
      setPhoneError(false);
      setPhoneHelperText("");
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log("File loaded:", event.target.result);
        console.log("File name:", name);
        setFormData({
          ...formData,
          [name]: event.target.result,
          [name === "attachmentFront" ? "previewFront" : "previewBack"]:
            event.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    console.log("Submitting form data:", formData);

    const response = await fetch("/api/blotter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // Send the data (including Base64 files) to the backend
    });

    if (response.ok) {
      alert("Blotter submitted successfully!");
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Card
        sx={{
          backgroundColor: "white",
          boxShadow: 3,
          padding: 2,
          borderRadius: 5,
        }}
      >
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Blotter Report Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Complainant Name"
              name="complainant"
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Full Address (e.g., Block/Lot/Street/Subd, Barangay, City)"
              name="fullAddress"
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Incident Description"
              name="description"
              multiline
              rows={4}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Phone Number (e.g., 09xxxxxxxxx or +639xxxxxxxxx)"
              name="phoneNumber"
              type="tel"
              fullWidth
              required
              onChange={handlePhoneChange}
              value={formData.phoneNumber}
              error={phoneError}
              helperText={phoneHelperText}
              sx={{ mb: 2 }}
            />
            <Typography variant="body1" gutterBottom>
              Attach Proof of Address (e.g., Barangay ID, National ID, Passport,
              Utility Bill, etc.):
            </Typography>
            <Button
              variant="outlined"
              component="label"
              sx={{ mt: 1, mb: 1, width: "100%" }}
            >
              Upload Front Proof
              <input
                type="file"
                name="attachmentFront"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {formData.previewFront && (
              <img
                src={formData.previewFront}
                alt="Front Proof Preview"
                style={{ width: "100%", marginBottom: "1rem" }}
              />
            )}
            <Button
              variant="outlined"
              component="label"
              sx={{ mt: 1, mb: 2, width: "100%" }}
            >
              Upload Back Proof
              <input
                type="file"
                name="attachmentBack"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {formData.previewBack && (
              <img
                src={formData.previewBack}
                alt="Back Proof Preview"
                style={{ width: "100%", marginBottom: "1rem" }}
              />
            )}
            <TextField
              fullWidth
              label="Other Contacts (e.g.,Facebook)(Optional)"
              name="otherContacts"
              onChange={handleChange}
              value={formData.otherContacts}
              sx={{ mb: 2 }}
            />
            <StyledButton type="submit">
              {loading ? "Submitting..." : "Submit Report"}
            </StyledButton>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BlotterForm;

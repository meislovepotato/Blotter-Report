"use client";

import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import streets from "./streets";

const BlotterForm = () => {
  const [formData, setFormData] = useState({
    complainant: "",
    street: "",
    description: "",
    phoneNumber: "",
    attachmentFront: null,
    attachmentBack: null,
    previewFront: null,
    previewBack: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          [name]: file,
          [name === "attachmentFront" ? "previewFront" : "previewBack"]:
            event.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target.form;
    const attachmentFront = form.elements["attachmentFront"].files.length;
    const attachmentBack = form.elements["attachmentBack"].files.length;

    if (!attachmentFront || !attachmentBack) {
      alert("Please upload both front and back ID.");
      return;
    }

    // Proceed with form submission
    form.submit();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Blotter Report Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Complainant Name"
          name="complainant"
          margin="normal"
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="House Number"
          name="houseNumber"
          margin="normal"
          onChange={handleChange}
          required
          type="number" // Ensures only numbers are entered
          InputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          onInput={(e) => {
            // Prevent the negative sign from being entered
            if (e.target.value && e.target.value[0] === "-") {
              e.target.value = e.target.value.replace("-", "");
            }
          }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Street</InputLabel>
          <Select
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
          >
            {streets.map((street) => (
              <MenuItem key={street} value={street}>
                {street}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Incident Description"
          name="description"
          multiline
          rows={4}
          margin="normal"
          onChange={handleChange}
          required
        />
        <TextField
          label="Phone Number (Optional)"
          name="phoneNumber"
          type="tel"
          fullWidth
          sx={{ mt: 2, mb: 2 }}
        />
        <Typography variant="body1" gutterBottom>
          Attach Barangay ID (Front and Back):
        </Typography>
        <Button
          variant="outlined"
          component="label"
          sx={{ mt: 1, mb: 1, width: "100%" }}
        >
          Upload Front ID
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
            alt="Front ID Preview"
            style={{ width: "100%", marginBottom: "1rem" }}
          />
        )}
        <Button
          variant="outlined"
          component="label"
          sx={{ mt: 1, mb: 2, width: "100%" }}
        >
          Upload Back ID
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
            alt="Back ID Preview"
            style={{ width: "100%", marginBottom: "1rem" }}
          />
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Submit Report
        </Button>
      </form>
    </Container>
  );
};

export default BlotterForm;

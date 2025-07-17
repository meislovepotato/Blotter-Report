"use client";

import { formatPHPhoneInput } from "@/lib";
import { InputAdornment, TextField } from "@mui/material";

const PersonalInfo = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const formatted = formatPHPhoneInput(value);
      setFormData((prev) => ({ ...prev, phoneNumber: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <TextField
          label="First Name"
          name="complainantFirstName"
          value={formData.complainantFirstName}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="given-name"
        />
        <TextField
          label="Middle Name (optional)"
          name="complainantMiddleName"
          value={formData.complainantMiddleName}
          onChange={handleChange}
          fullWidth
          autoComplete="additional-name"
        />
        <TextField
          label="Last Name"
          name="complainantLastName"
          value={formData.complainantLastName}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="family-name"
        />
      </div>

      <div className="flex flex-col gap-4">
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="tel-national"
          type="tel"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">+63</InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="Other Contacts (optional)"
          name="otherContacts"
          value={formData.otherContacts}
          onChange={handleChange}
          fullWidth
          type="email"
        />
      </div>

      <TextField
        label="Full Address"
        name="fullAddress"
        value={formData.fullAddress}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        required
        autoComplete="street-address"
      />
    </div>
  );
};

export default PersonalInfo;

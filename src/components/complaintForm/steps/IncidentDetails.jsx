"use client";

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { BLOTTER_CATEGORY_OPTIONS, categorySeverityMap } from "@/constants";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const CONTEXT_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 1500;

const DateTimeInput = ({ label, value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        maxDateTime={dayjs()}
        label={label}
        value={value ? dayjs(value) : null} // Convert ISO string to dayjs
        onChange={(newValue) =>
          onChange(newValue ? newValue.toISOString() : "")
        }
        format="MMMM DD, YYYY hh:mm A"
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
            InputProps: {
              sx: {
                borderRadius: "8px",
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

const IncidentDetails = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // If category changes, update severity as well
      if (name === "category") {
        const severity = categorySeverityMap[value] || "INFORMATIONAL";
        updated.severity = severity;
        console.log("Category:", value);
        console.log("Severity:", severity);
      }

      return updated;
    });
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <TextField
          label="Subject Name (optional)"
          name="subjectName"
          value={formData.subjectName}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Subject Context (optional)"
          name="subjectContext"
          value={formData.subjectContext}
          multiline
          minRows={2}
          maxRows={2}
          onChange={handleChange}
          fullWidth
          slotProps={{ htmlInput: { maxLength: CONTEXT_MAX_LENGTH } }}
          helperText={
            <span className="flex justify-end w-full text-text/50">
              {formData.subjectContext.length}/{CONTEXT_MAX_LENGTH}
            </span>
          }
        />
        <FormControl fullWidth size="small" required>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            name="category"
            value={formData.category}
            label="Category"
            onChange={handleChange}
          >
            {BLOTTER_CATEGORY_OPTIONS.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Incident Description"
          name="description"
          value={formData.description}
          multiline
          minRows={3}
          maxRows={3}
          onChange={handleChange}
          fullWidth
          slotProps={{ htmlInput: { maxLength: DESCRIPTION_MAX_LENGTH } }}
          helperText={
            <span className="flex justify-end w-full text-text/50">
              {formData.description.length}/{DESCRIPTION_MAX_LENGTH}
            </span>
          }
        />
        <DateTimeInput
          label="Date and Time of Incident"
          value={formData.incidentDateTime}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, incidentDateTime: val }))
          }
        />
        <TextField
          label="Incident location (optional)"
          name="location"
          value={formData.location}
          multiline
          minRows={2}
          maxRows={2}
          onChange={handleChange}
          fullWidth
        />
      </div>
    </div>
  );
};

export default IncidentDetails;

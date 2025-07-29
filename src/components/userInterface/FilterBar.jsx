"use client";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { BLOTTER_CATEGORY_OPTIONS } from "@/constants";
import { PrimaryButton, SecondaryButton } from ".";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function FilterBar({ filters, setFilters, onApply, onClear }) {
  const handle = (key) => (input) => {
    const value =
      input && input.target ? input.target.value : input?.toISOString?.() || "";
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const DateInput = ({ label, value, onChange, className }) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          maxDate={dayjs()}
          label={label}
          value={value ? dayjs(value) : null}
          onChange={onChange}
          format="MMMM DD, YYYY"
          slotProps={{
            textField: {
              size: "small",
              InputProps: {
                sx: {
                  borderRadius: "8px",
                },
              },
            },
          }}
          className={className}
        />
      </LocalizationProvider>
    );
  };

  return (
    <div className="flex items-end w-full gap-4 flex-wrap">
      <TextField
        label="Search"
        size="small"
        value={filters.q}
        onChange={handle("q")}
        placeholder="Name or Tracking ID"
        className="w-75"
      />

      <FormControl size="small" className="w-36">
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.category}
          onChange={handle("category")}
          label="Category"
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {BLOTTER_CATEGORY_OPTIONS.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DateInput
        label="From"
        value={filters.dateFrom}
        onChange={handle("dateFrom")}
        className="w-45"
      />

      <DateInput
        label="To"
        value={filters.dateTo}
        onChange={handle("dateTo")}
        className="w-45"
      />

      <SecondaryButton onClick={onClear}>Clear</SecondaryButton>
    </div>
  );
}

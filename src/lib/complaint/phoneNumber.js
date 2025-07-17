// Removes formatting and country code for storage
export const normalizePhoneNumber = (input) => {
  const digits = input.replace(/\D/g, "");
  return digits.startsWith("09") ? digits.slice(1) : digits;
};

// Adds spacing for user input display (optional)
export const formatPHPhoneInput = (input) => {
  const digits = input.replace(/\D/g, "").slice(0, 11);

  const startsWith09 = digits.startsWith("09");

  if (startsWith09) {
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  } else {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
};

// Simple format check for PH numbers (ex: 9171234567)
export const isValidPhoneNumber = (input) => {
  const normalized = normalizePhoneNumber(input);
  return /^9\d{9}$/.test(normalized);
};

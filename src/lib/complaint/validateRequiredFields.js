export function validateRequiredFields(data) {
  const required = [
    "complainantFirstName",
    "complainantLastName",
    "phoneNumber",
    "fullAddress",
    "category",
    "incidentDateTime",
    "proofType",
  ];

  if (data.proofType === "ID") {
    required.push("attachmentIDFront", "attachmentIDBack");
  } else if (data.proofType === "UTILITY_BILL") {
    required.push("attachmentUtility");
  }

  const missing = required.filter((field) => !data[field]);
  return missing.length === 0 ? null : missing;
}

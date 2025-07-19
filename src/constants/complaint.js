export const INITIAL_FORM_DATA = {
  complainantFirstName: "",
  complainantMiddleName: "",
  complainantLastName: "",
  phoneNumber: "",
  fullAddress: "",
  otherContacts: "",
  proofType: "ID",
  attachmentIDFront: null,
  attachmentIDBack: null,
  attachmentUtility: null,
  previewIDFront: null,
  previewIDBack: null,
  previewUtility: null,
  subjectName: "",
  subjectContext: "",
  description: "",
  category: "",
  severity: "",
  incidentDateTime: new Date().toISOString(),
  location: "",
  complaintAttachment: [],
};

export const MAX_FILE_SIZE = 20 * 1024 * 1024;

export const STATUS_STYLES = {
  // Complaint statuses
  PENDING: "bg-[#fffbea] text-[#b58105]", // Soft amber – “just submitted”
  IN_PROGRESS: "bg-[#e6f0ff] text-[#2563eb]", // Calm blue – “being worked on”
  ESCALATION_REQUESTED: "bg-[#fff4e5] text-[#c2410c]", // Alert orange – “may escalate”
  ESCALATED: "bg-[#f3e8ff] text-[#9333ea]", // Purple – “legal/formal, moved to blotter”
  RESOLVED: "bg-[#e8f5e9] text-[var(--color-primary)]", // Your green – “peaceful resolution”
  REJECTED: "bg-[#fdecea] text-[#d32f2f]", // Soft red – “invalid/rejected”

  // Blotter statuses
  FILED: "bg-[#fef9c3] text-[#b45309]", // Pale yellow – “formally logged”
  UNDER_MEDIATION: "bg-[#e0f2fe] text-[#0284c7]", // Light blue – “ongoing mediation”
  REFERRED: "bg-[#ede9fe] text-[#7c3aed]", // Soft violet – “outside jurisdiction”

  // Fallback
  DEFAULT: "bg-gray-100 text-gray-800",
};

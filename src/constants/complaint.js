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
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  ESCALATION_REQUESTED: "bg-orange-100 text-orange-800",
  ESCALATED: "bg-purple-100 text-purple-800",
  RESOLVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",

  // Blotter statuses
  FILED: "bg-yellow-100 text-yellow-800",
  UNDER_MEDIATION: "bg-blue-100 text-blue-800",
  REFERRED: "bg-purple-100 text-purple-800",

  // Fallback
  DEFAULT: "bg-gray-100 text-gray-800",
};

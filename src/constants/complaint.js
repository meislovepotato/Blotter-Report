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
  incidentDateTime: new Date().toISOString(),
  location: "",
  complaintAttachment: [],
};

export const MAX_FILE_SIZE = 20 * 1024 * 1024;

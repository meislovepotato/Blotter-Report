import { z } from "zod";
import { BLOTTER_CATEGORIES } from "@/constants/categories";
import { isValidPhoneNumber } from "../complaint/phoneNumber";
import { MAX_FILE_SIZE } from "@/constants";

// Constants

// Step 1: Personal Info
export const personalInfoSchema = z.object({
  complainantFirstName: z.string().min(1, "First name is required"),
  complainantMiddleName: z.string().optional(),
  complainantLastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().refine(isValidPhoneNumber, {
    message: "Must be a valid PH mobile number (starts with 09 or 9)",
  }),
  fullAddress: z.string().min(1, "Address is required"),
  otherContacts: z.string().optional(),
});

// Step 2: Proof of Residency
const fileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= MAX_FILE_SIZE, "Max size is 20MB");

export const proofOfResidencySchema = z
  .object({
    proofType: z.enum(["ID", "UTILITY_BILL"]),
    attachmentIDFront: fileSchema.nullable().optional(),
    attachmentIDBack: fileSchema.nullable().optional(),
    attachmentUtility: fileSchema.nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.proofType === "ID") {
      if (!data.attachmentIDFront) {
        ctx.addIssue({
          path: ["attachmentIDFront"],
          message: "Required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.attachmentIDBack) {
        ctx.addIssue({
          path: ["attachmentIDBack"],
          message: "Required",
          code: z.ZodIssueCode.custom,
        });
      }
    } else if (data.proofType === "UTILITY_BILL") {
      if (!data.attachmentUtility) {
        ctx.addIssue({
          path: ["attachmentUtility"],
          message: "Required",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

// Step 3: Incident Details
export const incidentDetailsSchema = z.object({
  category: z.enum(Object.keys(BLOTTER_CATEGORIES)),
  description: z.string().optional(),
  incidentDateTime: z.coerce.date(),
  location: z.string().optional(),
  subjectName: z.string().optional(),
  subjectContext: z.string().optional(),
});

// Step 4: Proof of Incident
const isValidFile = (val) => {
  return (
    val instanceof File ||
    (val && typeof val === "object" && "size" in val && "type" in val)
  );
};

export const incidentProofSchema = z.object({
  complaintAttachment: z
    .array(
      z.object({
        file: z.custom(isValidFile, { message: "Invalid file" }).refine(
          (f) => {
            return f.size <= MAX_FILE_SIZE;
          },
          {
            message: "Each file must be under 20MB",
          }
        ),
        data: z.string(),
        isVideo: z.boolean(),
      })
    )
    .optional(),
});

export const stepSchemas = [
  personalInfoSchema,
  proofOfResidencySchema,
  incidentDetailsSchema,
  incidentProofSchema,
  z.any(), // Step 5: Review (no validation)
];

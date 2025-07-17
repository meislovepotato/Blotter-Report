"use client";

import {
  FormNavigation,
  FormStepper,
  PersonalInfo,
  ProofOfResidency,
  IncidentDetails,
  IncidentProof,
  Review,
} from "@/components/complaintForm";
import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { INITIAL_FORM_DATA } from "@/constants";
import { fileToBase64, stepSchemas } from "@/lib";

const steps = [
  "Personal Info",
  "Proof of Residency",
  "Incident Details",
  "Proof of Incident",
  "Review",
];

const ComplaintForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transformData = { ...formData };
    const schema = stepSchemas[activeStep];
    const parsed = schema.safeParse(transformData);

    if (!parsed.success) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "error",
      });
      return;
    }

    // Step 3: Convert incident attachments to base64
    if (formData.complaintAttachment?.length) {
      console.log("Incident attachments (raw):", formData.complaintAttachment);
      transformData.complaintAttachment = await Promise.all(
        formData.complaintAttachment.map((fileObj) =>
          fileToBase64(fileObj.file)
        )
      );
      console.log("Encoded attachments:", formData.complaintAttachment);
    }

    // Always base64-encode individual proof files
    if (formData.attachmentIDFront) {
      console.log("attachmentIDFront (raw):", formData.attachmentIDFront);
      transformData.attachmentIDFront = await fileToBase64(
        formData.attachmentIDFront
      );
      console.log(
        "Encoded attachmentIDFront:",
        transformData.attachmentIDFront
      );
    }
    if (formData.attachmentIDBack) {
      console.log("attachmentIDBack (raw):", formData.attachmentIDBack);
      transformData.attachmentIDBack = await fileToBase64(
        formData.attachmentIDBack
      );
      console.log("Encoded attachmentIDBack:", transformData.attachmentIDBack);
    }
    if (formData.attachmentUtility) {
      console.log("attachmentUtility (raw):", formData.attachmentUtility);
      transformData.attachmentUtility = await fileToBase64(
        formData.attachmentUtility
      );
      console.log(
        "Encoded attachmentUtility:",
        transformData.attachmentUtility
      );
    }

    if (activeStep === steps.length - 1) {
      try {
        const res = await fetch("/api/complaint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transformData),
        });

        if (typeof window !== "undefined") {
          const channel = new BroadcastChannel("complaint-updates");
          channel.postMessage("refresh");
          channel.close(); // optional but tidy
        }

        if (!res.ok) throw new Error("Submission failed");

        setSnackbar({
          open: true,
          message: "Complaint submitted successfully!",
          severity: "success",
        });

        setFormData(INITIAL_FORM_DATA);
        setActiveStep(0);
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Something went wrong. Please try again.",
          severity: "error",
        });
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-100 max-h-167 bg-background max-w-2xl mx-auto py-6 px-8 shadow-2xl shadow-text/10 rounded-3xl ">
      <FormStepper steps={steps} activeStep={activeStep} />
      <form
        className="flex flex-col gap-4 w-full flex-1 min-h-0"
        onSubmit={handleSubmit}
      >
        {/* Steps */}

        <div className="w-full flex-1">
          {activeStep === 0 && (
            <PersonalInfo formData={formData} setFormData={setFormData} />
          )}
          {activeStep === 1 && (
            <ProofOfResidency formData={formData} setFormData={setFormData} />
          )}
          {activeStep === 2 && (
            <IncidentDetails formData={formData} setFormData={setFormData} />
          )}
          {activeStep === 3 && (
            <IncidentProof formData={formData} setFormData={setFormData} />
          )}
          {activeStep === 4 && <Review formData={formData} />}
        </div>

        {/* Navigation */}
        <FormNavigation
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          isSubmit
        />
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        style={{ position: "fixed", bottom: 16 }}
        sx={{ width: "100%", paddingInline: 2 }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ComplaintForm;

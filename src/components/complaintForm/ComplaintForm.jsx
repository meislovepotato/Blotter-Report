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
import { INITIAL_FORM_DATA } from "@/constants";
import { fileToBase64, stepSchemas } from "@/lib";
import { useSocket } from "@/context";
import { FeedbackSnackbar } from "../userInterface";
import { useFakeSMS } from "@/context/FakeSMSContext";

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

  const { sendFakeSMS } = useFakeSMS();
  const socket = useSocket();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const schema = stepSchemas[activeStep];
    const parsed = schema.safeParse(formData);

    if (!parsed.success) {
      return setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "error",
      });
    }

    const transformData = { ...formData };

    try {
      // Convert file attachments to base64
      if (transformData.complaintAttachment?.length) {
        transformData.complaintAttachment = await Promise.all(
          transformData.complaintAttachment.map((f) => fileToBase64(f.file))
        );
      }

      const fileFields = [
        "attachmentIDFront",
        "attachmentIDBack",
        "attachmentUtility",
      ];

      for (const field of fileFields) {
        if (transformData[field]) {
          transformData[field] = await fileToBase64(transformData[field]);
        }
      }

      // Final step: submit to backend
      if (activeStep === steps.length - 1) {
        const res = await fetch("/api/complaint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transformData),
        });

        if (!res.ok) throw new Error("Submission failed");

        const result = await res.json();

        // FAKE SMS: notify complainant
        sendFakeSMS({
          type: "complainant",
          recipient: formData.phoneNumber || "Complainant",
          content: `Your complaint has been received. Your tracking ID is: ${result.trackingId}`,
          meta: { trackingId: result.trackingId },
        });

        console.log("📱 sending fake SMS to complainant", formData.phoneNumber);

        // FAKE SMS: notify admin for urgent/emergency
        const severity =
          typeof formData.severity === "string"
            ? formData.severity.toUpperCase()
            : "";

        if (["EMERGENCY", "URGENT"].includes(severity)) {
          sendFakeSMS({
            type: "admin",
            recipient: "admin",
            content: `New ${severity} complaint received. Tracking ID: ${result.trackingId}. Immediate response needed!`,
            meta: { trackingId: result.trackingId },
          });
        }

        // Real-time emit
        if (socket) {
          socket.emit("complaint-created", {
            timestamp: Date.now(),
            message: "New complaint submitted!",
          });
          console.log("✅ complaint-created event emitted");
        }

        setSnackbar({
          open: true,
          message: "Complaint submitted successfully!",
          severity: "success",
        });

        // Reset form
        setFormData(INITIAL_FORM_DATA);
        setActiveStep(0);
      } else {
        // Move to next step
        setActiveStep((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Submission Error:", err);
      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-100 max-h-167 bg-background max-w-2xl mx-auto py-6 px-8 shadow-2xl shadow-text/10 rounded-3xl">
      <FormStepper steps={steps} activeStep={activeStep} />
      <form
        className="flex flex-col gap-4 w-full flex-1 min-h-0"
        onSubmit={handleSubmit}
      >
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

        <FormNavigation
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          isSubmit
        />
      </form>

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
};

export default ComplaintForm;

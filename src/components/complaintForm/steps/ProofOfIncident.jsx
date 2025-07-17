"use client";

import { useState } from "react";
import { AttachmentPreviewModal, IncidentAttachmentGrid } from "..";
import { MAX_FILE_SIZE } from "@/constants";

const ProofOfIncident = ({ formData, setFormData }) => {
  const [previewOverlay, setPreviewOverlay] = useState(null);

  const handleIncidentAttachmentAdd = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File exceeds 20MB limit!");
      return;
    }

    const isVideo = file.type.startsWith("video");
    const reader = new FileReader();
    reader.onload = () => {
      const newAttachment = {
        file,
        data: reader.result,
        isVideo,
      };
      setFormData((prev) => ({
        ...prev,
        complaintAttachment: [...prev.complaintAttachment, newAttachment],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleIncidentAttachmentRemove = (index) => {
    setFormData((prev) => {
      const updated = [...prev.complaintAttachment];
      updated.splice(index, 1);
      return { ...prev, complaintAttachment: updated };
    });
  };

  const handleOverlayClose = () => setPreviewOverlay(null);

  return (
    <div className="flex flex-col gap-2 w-full flex-1 overflow-hidden">
      <p className="text-[10px] text-text">
        Proof of Incident (optional, but recommended)
      </p>
      <IncidentAttachmentGrid
        attachments={formData.complaintAttachment}
        onPreview={setPreviewOverlay}
        onRemove={handleIncidentAttachmentRemove}
        onAdd={handleIncidentAttachmentAdd}
      />

      <AttachmentPreviewModal
        open={!!previewOverlay}
        onClose={handleOverlayClose}
        src={previewOverlay}
      />
    </div>
  );
};

export default ProofOfIncident;

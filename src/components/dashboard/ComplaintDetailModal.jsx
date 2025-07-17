"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { CloseRounded } from "@mui/icons-material";
import {
  AVATAR_COLORS,
  BLOTTER_CATEGORIES,
  CATEGORY_COLORS,
} from "@/constants";
import { PrimaryButton, SecondaryButton } from "../userInterface";
import { Dialog, DialogContent, IconButton } from "@mui/material";

const ComplaintDetailModal = ({ complaint, adminRole, onClose, onAction }) => {
  const modalRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    trackingId,
    complainant,
    category,
    description,
    subjectName,
    subjectContext,
    location,
    incidentDateTime,
    attachments = [],
    status,
  } = complaint;

  const {
    residencyProof,
    attachmentIDFront,
    attachmentIDBack,
    attachmentUtility,
  } = complainant || {};

  const effectiveLocation = location || complainant?.fullAddress;

  const [imageUrls, setImageUrls] = useState({
    idFront: null,
    idBack: null,
    utility: null,
    evidence: [],
  });

  useEffect(() => {
    setImageUrls({
      idFront: attachmentIDFront,
      idBack: attachmentIDBack,
      utility: attachmentUtility,
      evidence: attachments.map((a) => a?.file).filter(Boolean),
    });
  }, [attachmentIDFront, attachmentIDBack, attachmentUtility, attachments]);

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const getDeterministicAvatarColor = (id, colorsArray) => {
    if (!id || (typeof id !== "string" && typeof id !== "number")) {
      return "bg-gray-400";
    }

    let hash = 0;
    if (typeof id === "string") {
      for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
      }
    } else if (typeof id === "number") {
      hash = id;
    }

    const index = Math.abs(hash) % colorsArray.length;
    return colorsArray[index];
  };

  const initials = `${complainant.firstName?.[0] || ""}${
    complainant.lastName?.[0] || ""
  }`.toUpperCase();
  const avatarColorClass = getDeterministicAvatarColor(
    complainant.id,
    AVATAR_COLORS
  );

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent className="overflow-y-auto flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Complaint Details</h2>
          <IconButton
            onClick={onClose}
            size="small"
            className="!text-text/50 hover:!text-red-500"
          >
            <CloseRounded />
          </IconButton>
        </div>

        {/* Complainant Info */}
        <section className="px-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${avatarColorClass}`}
              >
                {initials}
              </div>
              <div>
                <div className="text-sm font-medium text-text">
                  {`${complainant.lastName}, ${complainant.firstName} ${complainant.middleName}`.trim()}
                </div>
                {complainant.phoneNumber && (
                  <div className="text-xs text-text opacity-50">
                    {complainant.phoneNumber}
                  </div>
                )}
              </div>
            </div>
            <p className="text-right">
              <strong>Tracking ID:</strong> {trackingId || "N/A"}
            </p>
            <div className="flex flex-col gap-2 ">
              <p>
                <strong>Proof Type:</strong> {residencyProof || "N/A"}
              </p>
              <div className="flex flex-wrap gap-4">
                {["idFront", "idBack", "utility"].map(
                  (key) =>
                    imageUrls[key] && (
                      <div key={key} className="flex flex-col items-center">
                        <img
                          src={imageUrls[key]}
                          alt={key}
                          className="w-36 h-24 object-cover border rounded cursor-pointer"
                          onClick={() => setPreviewImage(imageUrls[key])}
                        />
                        <span className="text-xs mt-1 capitalize">
                          {key
                            .replace("id", "ID ")
                            .replace("utility", "Utility Bill")}
                        </span>
                      </div>
                    )
                )}
              </div>
            </div>
            <p className="text-right">
              <strong>Address:</strong> {complainant?.fullAddress || "N/A"}
            </p>
          </div>
        </section>

        {/* Complaint Info */}
        <section className="bg-white p-4 rounded-2xl shadow-xl shadow-primary/10 gap-2">
          <h3 className="text-xl font-semibold mb-2 flex justify-between items-center">
            Complaint Info
            <span
              className={`inline-block px-2 py-1 text-sm rounded font-medium ${
                CATEGORY_COLORS[category] || "bg-gray-100 text-gray-700"
              }`}
            >
              {BLOTTER_CATEGORIES[category] || category || "N/A"}
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {description && (
              <div className="mt-2">
                <strong>Description:</strong>
                <p className="text-gray-700">{description}</p>
              </div>
            )}
            <p className="text-right">
              <strong>Location:</strong> {effectiveLocation || "N/A"}
            </p>
            {subjectName && (
              <p>
                <strong>Subject Name:</strong> {subjectName}
              </p>
            )}
            {subjectContext && (
              <div className="mt-2">
                <strong>Subject Context:</strong>
                <p className="text-gray-700">{subjectContext}</p>
              </div>
            )}

            <p className="col-span-2">
              <strong>Incident Date:</strong>
              {incidentDateTime
                ? format(new Date(incidentDateTime), "PPP p")
                : "N/A"}
            </p>
          </div>

          {/* Incident Evidence */}
          {imageUrls.evidence.length > 0 && (
            <>
              <h3 className="text-md font-semibold mb-2 border-t py-2 mt-2">
                Incident Evidence
              </h3>
              <div className="flex flex-wrap gap-4">
                {imageUrls.evidence.map((src, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <img
                      src={src}
                      alt={`Attachment ${idx + 1}`}
                      className="w-36 h-24 object-cover border rounded cursor-pointer"
                      onClick={() => setPreviewImage(src)}
                    />
                    <span className="text-xs mt-1">Attachment {idx + 1}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Actions */}
        <div className="flex justify-between gap-2 ">
          <SecondaryButton onClick={onClose}>Close</SecondaryButton>

          {status === "PENDING" && (
            <div className="flex gap-2">
              <PrimaryButton
                onClick={() => onAction("REJECT")}
                className="!bg-red-400"
              >
                Reject
              </PrimaryButton>
              <PrimaryButton
                onClick={() => onAction("IN_PROGRESS", complaint.id)}
              >
                Mark as In Progress
              </PrimaryButton>
            </div>
          )}

          {status === "IN_PROGRESS" && (
            <div className="flex gap-2">
              <PrimaryButton
                onClick={() => onAction("REJECTED")}
                className="!bg-red-400"
              >
                Reject
              </PrimaryButton>
              <PrimaryButton onClick={() => onAction("RESOLVED")}>
                Mark as Resolved
              </PrimaryButton>

              {adminRole === "STAFF" && (
                <PrimaryButton onClick={() => onAction("ESCALATION_REQUESTED")}>
                  Request Escalation
                </PrimaryButton>
              )}

              {adminRole === "ADMIN" && (
                <PrimaryButton
                  className="!bg-indigo-400"
                  onClick={() => onAction("ESCALATED", complaint.id)}
                >
                  Escalate to Blotter
                </PrimaryButton>
              )}
            </div>
          )}
        </div>

        {/* Fullscreen Image Preview */}
        {previewImage && (
          <div
            className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center"
            onClick={() => setPreviewImage(null)}
          >
            <div
              className="relative"
              onClick={(e) => {
                e.stopPropagation(); // Prevent closing modal
              }}
            >
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl"
              />
              {/* Optional close button */}
              <button
                className="absolute top-2 right-2 text-white bg-black/60 hover:bg-black/80 rounded-full p-1"
                onClick={() => setPreviewImage(null)}
              >
                <CloseRounded fontSize="small" />
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintDetailModal;

"use client";

import { SearchRounded } from "@mui/icons-material";
import { CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import { PrimaryButton } from "../userInterface";
import {
  AVATAR_COLORS,
  BLOTTER_CATEGORIES,
  CATEGORY_COLORS,
  STATUS_STYLES,
} from "@/constants";
import { format } from "date-fns";

const TrackModal = () => {
  const [trackingId, setTrackingId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setComplaint(null);
    setLoading(true);

    try {
      const res = await fetch("/api/complaint/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingId }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Not found");
      } else {
        setComplaint(data.complaint);
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong.");
    }
  };

  const getDeterministicAvatarColor = (id, colorsArray) => {
    if (!id || (typeof id !== "string" && typeof id !== "number")) {
      return "bg-gray-400";
    }

    let hash = 0;
    const str = id.toString();
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colorsArray.length;
    return colorsArray[index];
  };

  const complainant = complaint?.complainant || {};
  const {
    firstName = "",
    lastName = "",
    middleName = "",
    phoneNumber,
    fullAddress,
    remarks,
    attachmentIDFront,
    attachmentIDBack,
    attachmentUtility,
  } = complainant;

  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  const avatarColorClass = getDeterministicAvatarColor(
    complainant.id,
    AVATAR_COLORS
  );

  const imageUrls = {
    idFront: attachmentIDFront || null,
    idBack: attachmentIDBack || null,
    utility: attachmentUtility || null,
    evidence: complaint?.attachments?.map((a) => a.file).filter(Boolean) || [],
  };

  const { status, category, description, location, createdAt, updatedAt } =
    complaint || {};

  const effectiveLocation = location || fullAddress;

  return (
    <div className="flex flex-col gap-4 bg-secondary/20 backdrop-blur-lg rounded-2xl p-6 w-full h-132 md:h-96">
      <h2 className="text-xl font-bold">
        <span className="text-primary">Track</span> Your Report
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <TextField
            label="Tracking ID"
            name="trackingId"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            required
            fullWidth
            className="bg-background/90 rounded-xl"
          />
          <PrimaryButton
            isForm
            disabled={loading}
            className="!px-0 aspect-square"
          >
            {loading ? (
              <CircularProgress size={24} className="!text-background" />
            ) : (
              <SearchRounded />
            )}
          </PrimaryButton>
        </div>
      </form>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {complaint && (
        <>
          <section className="px-2">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${avatarColorClass}`}
                >
                  {initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-text">
                    {`${lastName}, ${firstName} ${middleName}`.trim()}
                  </div>
                  {phoneNumber && (
                    <div className="text-xs text-text opacity-50">
                      {phoneNumber}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm md:text-right">
                <strong>Tracking ID:</strong> {trackingId || "N/A"}
              </p>
            </div>
          </section>

          <section className="bg-white p-4 rounded-2xl shadow-xl shadow-primary/10 flex flex-col gap-6 flex-1 overflow-y-auto">
            <h3 className="text-lg font-bold mb-2 flex gap-4 items-center">
              Complaint Info
              <span className="font-thin flex flex-1 flex-row justify-between">
                <span
                  className={`inline-block px-2 py-1 text-sm rounded font-medium ${
                    CATEGORY_COLORS[category] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {BLOTTER_CATEGORIES[category] || category || "N/A"}
                </span>
                <span
                  className={`inline-block px-2 py-1 text-sm rounded font-medium ${
                    STATUS_STYLES[status] || STATUS_STYLES.DEFAULT
                  }`}
                >
                  {status}
                </span>
              </span>
            </h3>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
              <div className="col-span-1 flex flex-row gap-2">
                <span className="font-semibold">Description:</span>
                <p className="text-gray-700 flex-1 line-clamp-2">
                  {description || "N/A"}
                </p>
              </div>

              <p className="md:text-right">
                <span className="font-semibold">Location:</span>{" "}
                {effectiveLocation || "N/A"}
              </p>
              <span className="col-span-2 flex flex-col md:grid md:grid-cols-2 gap-4 justify-between">
                <p className="col-span-1">
                  <span className="font-semibold">Date Filed: </span>
                  {createdAt ? format(new Date(createdAt), "PPP p") : "N/A"}
                </p>
                {updatedAt && (
                  <p className="col-span-1">
                    <span className="font-semibold">Date Updated: </span>
                    {updatedAt ? format(new Date(updatedAt), "PPP p") : "N/A"}
                  </p>
                )}
              </span>
              {remarks && (
                <p className="grid-cols-2">
                  <strong>Remarks: </strong>
                  {remarks}
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default TrackModal;

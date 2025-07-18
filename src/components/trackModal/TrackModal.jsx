"use client";

import { useState } from "react";
import { CircularProgress, TextField } from "@mui/material";
import { SearchRounded } from "@mui/icons-material";
import { PrimaryButton } from "../userInterface";
import {
  AVATAR_COLORS,
  BLOTTER_CATEGORIES,
  CATEGORY_COLORS,
  STATUS_STYLES,
} from "@/constants";
import { format } from "date-fns";

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

const TrackModal = ({ className }) => {
  const [trackingId, setTrackingId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      if (!res.ok || !data.complaint) {
        throw new Error(data.error || "Complaint not found");
      }

      setComplaint(data.complaint);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const complainant = complaint?.complainant || {};
  const {
    firstName = "",
    lastName = "",
    middleName = "",
    phoneNumber,
    fullAddress,
    remarks,
  } = complainant;

  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  const avatarColor = getDeterministicAvatarColor(
    complainant.id,
    AVATAR_COLORS
  );
  const effectiveLocation = complaint?.location || fullAddress || "N/A";
  const complaintCategory =
    BLOTTER_CATEGORIES[complaint?.category] || complaint?.category || "N/A";
  const complaintStatus =
    complaint?.status?.toLowerCase().replace(/_/g, " ") || "N/A";

  return (
    <div
      className={`flex-col gap-4 bg-secondary/20 backdrop-blur-lg rounded-2xl p-6 w-full sm:flex-1 sm:h-full h-132 lg:flex-none lg:h-90 2xl:h-96 ${className}`}
    >
      <h2 className="text-xl font-bold">
        <span className="text-primary">Track</span> Your Report
      </h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="flex flex-row gap-2">
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
      </form>

      {/* ERROR MESSAGE */}
      {error && <div className="text-red-500">{error}</div>}

      {/* COMPLAINT DETAILS */}
      {complaint && (
        <>
          <section className="px-2">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 lg:w-10 aspect-square rounded-full flex items-center justify-center text-sm font-semibold text-white ${avatarColor}`}
                  title={`${firstName} ${lastName}`}
                >
                  {initials}
                </div>
                <div>
                  <div className="text-xs font-medium lg:text-base text-text">
                    {`${lastName}, ${firstName} ${middleName || ""}`.trim()}
                  </div>
                  {phoneNumber && (
                    <div className="text-[0.625rem] lg:text-xs text-text opacity-50">
                      {phoneNumber}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm md:text-xs sm:text-right">
                <strong>Tracking ID:</strong> {trackingId}
              </p>
            </div>
          </section>

          <section className="bg-white p-4 rounded-2xl shadow-xl shadow-primary/10 flex flex-col flex-1 gap-4 lg:gap-6 overflow-y-auto">
            <h3 className="text-base lg:text-lg font-bold mb-2 flex gap-4 items-center">
              Complaint Info
              <span className="font-thin flex flex-1 justify-between">
                <span
                  className={`inline-block px-2 py-1 text-sm rounded font-medium ${
                    CATEGORY_COLORS[complaint?.category] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {complaintCategory}
                </span>
                <span
                  className={`inline-block px-2 py-1 text-sm rounded font-medium ${
                    STATUS_STYLES[complaint?.status] || STATUS_STYLES.DEFAULT
                  }`}
                >
                  {complaintStatus
                    .split(" ")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </span>
              </span>
            </h3>

            <div className="flex flex-col md:grid md:grid-cols-2 gap-4 *:text-sm">
              <div className="flex gap-2">
                <span className="font-semibold">Description:</span>
                <p className="text-gray-700 line-clamp-2">
                  {complaint?.description || "N/A"}
                </p>
              </div>

              <p className="md:text-right">
                <span className="font-semibold">Location:</span>{" "}
                {effectiveLocation}
              </p>

              <p>
                <span className="font-semibold">Date Filed:</span>{" "}
                {complaint?.createdAt
                  ? format(new Date(complaint.createdAt), "PPP")
                  : "N/A"}
              </p>

              <p>
                <span className="font-semibold">Date Updated:</span>{" "}
                {complaint?.updatedAt
                  ? format(new Date(complaint.updatedAt), "PPP")
                  : "N/A"}
              </p>

              {remarks && (
                <p className="col-span-2">
                  <strong>Remarks:</strong> {remarks}
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

"use client";
import { useState } from "react";

export default function FloatingTrackModal() {
  const [open, setOpen] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setComplaint(null);
    setLoading(true);

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
  };

  return (
    <>
      {/* Floating Circle Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center text-3xl z-50 hover:bg-blue-700 transition"
        aria-label="Track Complaint"
      >
        🔍
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => {
                setOpen(false);
                setComplaint(null);
                setTrackingId("");
                setError("");
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">Track Your Complaint</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter Tracking ID"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Searching..." : "Track"}
              </button>
            </form>
            {error && <div className="text-red-500 mt-4">{error}</div>}
            {complaint && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-2">Complaint Details</h3>
                <div>
                  <strong>Status:</strong> {complaint.status}
                </div>
                <div>
                  <strong>Description:</strong> {complaint.description}
                </div>
                <div>
                  <strong>Category:</strong> {complaint.category}
                </div>
                <div>
                  <strong>Date Filed:</strong>{" "}
                  {new Date(complaint.createdAt).toLocaleString()}
                </div>
                <div>
                  <strong>Complainant:</strong>{" "}
                  {`${complaint.complainant.lastName}, ${complaint.complainant.firstName} ${complaint.complainant.middleName || ""}`}
                </div>
                <div>
                  <strong>Address:</strong> {complaint.complainant.fullAddress}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
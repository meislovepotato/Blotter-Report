"use client";
import { useEffect, useState } from "react";
import { ComplaintDetailModal, DataTable } from "@/components";
import {
  AVATAR_COLORS,
  BLOTTER_CATEGORIES,
  DEFAULT_FALLBACK_COLOR,
} from "@/constants";
import { useRouter } from "next/navigation";
import { VisibilityRounded } from "@mui/icons-material";
import { Alert, Snackbar } from "@mui/material";

// === deterministic avatar color helper ===
const getDeterministicAvatarColor = (id, colorsArray) => {
  if (!id || (typeof id !== "string" && typeof id !== "number")) {
    return DEFAULT_FALLBACK_COLOR;
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

const classifySeverity = (complaint) => complaint.severity || null;

const ComplaintsOverview = ({
  isCompact = false,
  isViewable,
  dashboardRole,
}) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const router = useRouter();

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAction = async (actionType, complaintId) => {
    try {
      const endpoint =
        actionType === "ESCALATED"
          ? "/api/complaint/escalate"
          : "/api/complaint/status";

      const payload =
        actionType === "ESCALATED"
          ? { complaintId }
          : { complaintId, status: actionType };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Unknown error");

      showSnackbar("Update successful.");
      setSelectedComplaint(null);
    } catch (err) {
      console.error("Update failed:", err);
      showSnackbar(`Update failed: ${err.message}`, "error");
    }
  };

  const fetchComplaints = async (showLoading = false) => {
    if (showLoading) setLoading(true);

    try {
      const response = await fetch("/api/complaint?include=complainant");
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Unknown error");

      // Inject severity field per complaint
      const withSeverity = (result.data || []).map((item) => ({
        ...item,
        severity: classifySeverity(item),
      }));

      setComplaints(withSeverity);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      if (showLoading) setLoading(false);
      if (isInitialLoad) {
        setIsInitialLoad(false);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchComplaints(true); // Initial load

    const interval = setInterval(() => fetchComplaints(false), 5000);

    const channel = new BroadcastChannel("complaint-updates");
    let debounceTimer = null;
    channel.onmessage = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fetchComplaints(false), 300);
    };

    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, []);

  const columns = [
    {
      key: "trackingId",
      header: "Tracking ID",
      render: (value) => `#${value}`,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : value === "IN_PROGRESS"
                ? "bg-blue-100 text-blue-800"
                : value === "ESCALATION_REQUESTED"
                  ? "bg-orange-100 text-orange-800"
                  : value === "ESCALATED"
                    ? "bg-purple-100 text-purple-800"
                    : value === "RESOLVED"
                      ? "bg-green-100 text-green-800"
                      : value === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
          }`}
        >
          {value
            .toLowerCase()
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (value) => BLOTTER_CATEGORIES[value],
    },
    {
      key: "complainant",
      header: "Complainant",
      render: (_, row) => {
        const firstName = row.complainant?.firstName || "";
        const lastName = row.complainant?.lastName || "";
        const middleName = row.complainant?.middleName || "";
        const phoneNumber = row.complainant?.phoneNumber;
        const initials =
          `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
        const avatarColorClass = getDeterministicAvatarColor(
          row.complainant?.id,
          AVATAR_COLORS
        );

        return (
          <div className="flex items-center space-x-2">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold ${avatarColorClass}`}
            >
              {initials}
            </div>
            <div>
              <div className="text-xs font-medium text-text">
                {`${lastName}, ${firstName} ${middleName}`.trim()}
              </div>
              {phoneNumber && (
                <div className="text-[0.625rem] text-text opacity-50">
                  {phoneNumber}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "location",
      header: "Location",
      render: (value, row) => value || row.complainant?.fullAddress,
    },
    {
      key: "createdAt",
      header: "Date Filed",
      render: (value) => {
        const date = new Date(value);
        return `${date.toLocaleDateString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        })} ${date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}`;
      },
    },
    ...(isCompact
      ? []
      : [
          {
            key: "actions",
            header: "Actions",
            render: (_, row) =>
              row.status === "ESCALATED" ? (
                <span className="text-xs italic text-gray-400 select-none">
                  Escalated
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedComplaint(row);
                  }}
                  className="text-primary px-2 items-center hover:text-accent cursor-pointer"
                >
                  <VisibilityRounded />
                </button>
              ),
          },
        ]),
  ];

  return (
    <>
      <DataTable
        data={complaints}
        columns={columns}
        isCompact={isCompact}
        isViewable={isViewable}
        viewMore={() => router.push("/admin/complaints")}
        title="Complaints Overview"
        loading={loading}
      />
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          adminRole={dashboardRole}
          onClose={() => setSelectedComplaint(null)}
          onAction={handleAction}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ComplaintsOverview;

"use client";
import { useEffect, useState } from "react";
import {
  ComplaintDetailModal,
  DataTable,
  FilterBar,
  ReportDetailModal,
} from "@/components";
import {
  AVATAR_COLORS,
  BLOTTER_CATEGORIES,
  CATEGORY_COLORS,
  DEFAULT_FALLBACK_COLOR,
  STATUS_STYLES,
} from "@/constants";
import { useRouter } from "next/navigation";
import { VisibilityRounded } from "@mui/icons-material";
import { Alert, Snackbar } from "@mui/material";

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

const classifySeverity = (complaint) => {
  if (complaint.status === "ESCALATED") return null;
  return complaint.severity || null;
};

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
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    dateFrom: "",
    dateTo: "",
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
          : `/api/complaint/update-status/${complaintId}`;

      const payload = { status: actionType };

      const res = await fetch(endpoint, {
        method: "PATCH", // PATCH is more semantically correct for partial updates
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

    const channel = new BroadcastChannel("complaint-updates");
    let debounceTimer = null;
    channel.onmessage = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fetchComplaints(false), 300);
    };

    return () => {
      channel.close();
    };
  }, []);

  const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
  const to = filters.dateTo ? new Date(filters.dateTo) : null;

  const filtered = complaints.filter((c) => {
    const q = filters.q.toLowerCase();
    const date = new Date(c.createdAt);

    const matchesSearch =
      !filters.q ||
      c.complainant?.lastName.toLowerCase().includes(q) ||
      c.complainant?.firstName.toLowerCase().includes(q) ||
      c.trackingId.toLowerCase().includes(q);

    const matchesCat = !filters.category || c.category === filters.category;
    const matchesFrom = !from || date >= from;
    const matchesTo = !to || date <= to;

    return matchesSearch && matchesCat && matchesFrom && matchesTo;
  });

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
          className={`px-2 py-1 rounded-full text-xs ${STATUS_STYLES[value] || STATUS_STYLES.DEFAULT}`}
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
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded-full font-medium ${
            CATEGORY_COLORS[value] || "bg-gray-100 text-gray-700"
          } bg-gray-100`}
        >
          {BLOTTER_CATEGORIES[value] || value || "N/A"}
        </span>
      ),
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
      {!isCompact && (
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onApply={() => {}}
          onClear={() => setFilters({ q: "", category: "", severity: "" })}
        />
      )}
      <DataTable
        data={filtered}
        columns={columns}
        isCompact={isCompact}
        isViewable={isViewable}
        viewMore={() => router.push("/admin/complaints")}
        title="Complaints Overview"
        loading={loading}
      />
      {selectedComplaint && (
        <ReportDetailModal
          type="complaint"
          data={selectedComplaint}
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

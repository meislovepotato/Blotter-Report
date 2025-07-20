"use client";
import { useEffect, useRef, useState } from "react";
import { DataTable, FilterBar, ReportDetailModal } from "@/components";
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
import { useSocket } from "@/context";

const getDeterministicAvatarColor = (id, colorsArray) => {
  if (!id || (typeof id !== "string" && typeof id !== "number")) {
    return DEFAULT_FALLBACK_COLOR;
  }
  let hash = 0;
  if (typeof id === "string") {
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
  } else {
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
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [limit, setLimit] = useState(10);
  const containerRef = useRef(null);
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
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Update failed");
      }

      const statusMessages = {
        REJECT: "Complaint rejected successfully",
        REJECTED: "Complaint rejected successfully",
        IN_PROGRESS: "Complaint marked as in progress",
        RESOLVED: "Complaint marked as resolved",
        ESCALATION_REQUESTED: "Escalation requested successfully",
        ESCALATED: "Complaint escalated to blotter successfully",
      };

      const message =
        statusMessages[actionType] || "Status updated successfully";
      showSnackbar(message);
      setSelectedComplaint(null);
      fetchComplaints(false, pagination.page, limit);
    } catch (err) {
      console.error("Update failed:", err);
      showSnackbar(`Update failed: ${err.message}`, "error");
    }
  };

  const fetchComplaints = async (
    showLoading = false,
    page = 1,
    limitVal = 10
  ) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch(
        `/api/complaint?page=${page}&limit=${limitVal}`,
        { credentials: "include" }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch complaints");
      }

      const withSeverity = (result.data || []).map((item) => ({
        ...item,
        severity: classifySeverity(item),
      }));

      setComplaints(withSeverity);
      setPagination({
        page: result.pagination.page,
        totalPages: result.pagination.totalPages,
      });
    } catch (error) {
      console.error("Fetch failed:", error);
      showSnackbar("Failed to fetch complaints", "error");
    } finally {
      if (showLoading) setLoading(false);
      if (isInitialLoad) {
        setIsInitialLoad(false);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isCompact) {
      const observer = new ResizeObserver(() => {
        if (containerRef.current) {
          const height = containerRef.current.offsetHeight;
          const rowHeight = 60;
          const visibleRows = Math.floor(height / rowHeight);
          setLimit(visibleRows);
        }
      });
      if (containerRef.current) observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [isCompact]);

  useEffect(() => {
    if (!isCompact && limit > 0) {
      fetchComplaints(true, 1, limit);
    } else if (isCompact) {
      fetchComplaints(true);
    }
  }, [limit, isCompact]);

  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    const handleNewComplaint = () => {
      console.log("Complaint created - refetching...");
      fetchComplaints(false, pagination.page, limit);
    };

    const handleStatusUpdate = () => {
      console.log("🔄 Complaint status updated - refetching...");
      fetchComplaints(false, pagination.page, limit);
    };

    socket.on("complaint-created", handleNewComplaint);
    socket.on("complaint-updated", handleStatusUpdate);
    return () => {
      socket.off("complaint-created", handleNewComplaint);
      socket.off("complaint-updated", handleStatusUpdate);
    };
  }, [socket, pagination.page, limit]);

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
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[value] || "bg-gray-100 text-gray-700"}`}
        >
          {BLOTTER_CATEGORIES[value] || value || "N/A"}
        </span>
      ),
    },
    {
      key: "complainant",
      header: "Complainant",
      render: (_, row) => {
        const {
          firstName = "",
          lastName = "",
          middleName = "",
          phoneNumber,
        } = row.complainant || {};
        const initials =
          `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
        const avatarColorClass = getDeterministicAvatarColor(
          row.complainant?.id,
          AVATAR_COLORS
        );
        return (
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold ${avatarColorClass}`}
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
                  title="View details"
                >
                  <VisibilityRounded />
                </button>
              ),
          },
        ]),
  ];

  return (
    <div className="flex flex-col flex-1 h-full gap-4">
      {!isCompact && (
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onApply={() => {}}
          onClear={() => setFilters({ q: "", category: "", severity: "" })}
        />
      )}
      <div
        ref={containerRef}
        className="flex flex-col flex-1 h-full justify-between"
      >
        <DataTable
          data={filtered}
          columns={columns}
          isCompact={isCompact}
          isViewable={isViewable}
          viewMore={() => router.push("/admin/complaints")}
          title="Complaints Overview"
          loading={loading}
        />
        {!isCompact && (
          <div className="flex justify-end gap-2 mt-4">
            <button
              disabled={pagination.page === 1}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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

export default ComplaintsOverview;

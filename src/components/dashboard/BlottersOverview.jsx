"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { VisibilityRounded } from "@mui/icons-material";
import { DataTable, FilterBar, ReportDetailModal } from "@/components";
import {
  AVATAR_COLORS,
  BLOTTER_CATEGORIES,
  CATEGORY_COLORS,
  DEFAULT_FALLBACK_COLOR,
  STATUS_STYLES,
} from "@/constants";
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

const BlotterOverview = ({
  isCompact = false,
  dashboardRole = "clerk",
  isViewable,
}) => {
  const [blotters, setBlotters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlotter, setSelectedBlotter] = useState(null);
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    dateFrom: "",
    dateTo: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [limit, setLimit] = useState(10);

  const containerRef = useRef(null);
  const router = useRouter();

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchBlotters = async (
    showLoading = false,
    page = 1,
    limitVal = 10
  ) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch(
        `/api/blotter?include=complainant&page=${page}&limit=${limitVal}`
      );
      const data = await res.json();
      if (!data.success || !Array.isArray(data.data)) {
        throw new Error(data.error || "Invalid response format");
      }

      setBlotters(data.data);
      setPagination({
        page: data.pagination?.page || 1,
        totalPages: data.pagination?.totalPages || 1,
      });
    } catch (err) {
      console.error("Blotter fetch failed:", err);
      showSnackbar("Failed to load blotters", "error");
    } finally {
      setLoading(false);
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
      fetchBlotters(true, 1, limit); // load page 1
    } else if (isCompact) {
      fetchBlotters(true);
    }
  }, [limit, isCompact]);

  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    const handleNewBlotter = () => {
      console.log("Complaint created - refetching...");
      fetchBlotters(true, pagination.page, limit);
    };

    socket.on("blotter-created", handleNewBlotter);
    return () => {
      socket.off("blotter-created", handleNewBlotter);
    };
  }, [socket, pagination.page, limit]);

  const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
  const to = filters.dateTo ? new Date(filters.dateTo) : null;

  const filtered = blotters.filter((c) => {
    const q = filters.q.toLowerCase();
    const date = new Date(c.createdAt);

    const matchesSearch =
      !filters.q ||
      c.complainant?.lastName?.toLowerCase().includes(q) ||
      c.complainant?.firstName?.toLowerCase().includes(q) ||
      c.trackingId?.toLowerCase().includes(q);

    const matchesCat = !filters.category || c.category === filters.category;
    const matchesFrom = !from || date >= from;
    const matchesTo = !to || date <= to;

    return matchesSearch && matchesCat && matchesFrom && matchesTo;
  });

  const columns = [
    {
      key: "trackingId",
      header: "Tracking ID",
      render: (val) => `#${val}`,
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
          className={`inline-block px-2 py-1 rounded-full font-medium ${
            CATEGORY_COLORS[value] || "bg-gray-100 text-gray-700"
          }`}
        >
          {BLOTTER_CATEGORIES[value] || value || "N/A"}
        </span>
      ),
    },
    {
      key: "complainant",
      header: "Complainant",
      render: (_, row) => {
        const c = row.complainant || {};
        const initials =
          `${c.firstName?.[0] || ""}${c.lastName?.[0] || ""}`.toUpperCase();
        const avatarColor = getDeterministicAvatarColor(c.id, AVATAR_COLORS);
        return (
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${avatarColor}`}
            >
              {initials}
            </div>
            <div>
              <div className="text-xs font-medium text-text">
                {`${c.lastName || ""}, ${c.firstName || ""} ${c.middleName || ""}`.trim()}
              </div>
              {c.phoneNumber && (
                <div className="text-[0.625rem] text-text opacity-50">
                  {c.phoneNumber}
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
      render: (val, row) => val || row.complainant?.fullAddress || "—",
    },
    {
      key: "incidentDateTime",
      header: "Incident Date",
      render: (val) => {
        const date = new Date(val || new Date());
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
            render: (_, row) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBlotter(row);
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
    <div className="flex flex-col flex-1 h-full gap-4">
      {!isCompact && (
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onApply={() => fetchBlotters(true, pagination.page, limit)}
          onClear={() => {
            setFilters({ q: "", category: "", dateFrom: "", dateTo: "" });
            fetchBlotters(true, pagination.page, limit);
          }}
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
          viewMore={() => router.push("/admin/blotter")}
          title="Blotter Overview"
          loading={loading}
        />
        {!isCompact && (
          <div className="flex justify-end gap-2 mt-4">
            <button
              disabled={pagination.page === 1}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
      {selectedBlotter && (
        <ReportDetailModal
          type="blotter"
          data={selectedBlotter}
          adminRole={dashboardRole}
          onClose={() => setSelectedBlotter(null)}
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
    </div>
  );
};

export default BlotterOverview;

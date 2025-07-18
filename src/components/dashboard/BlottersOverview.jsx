"use client";

import { useEffect, useState } from "react";
import { DataTable, FilterBar } from "@/components";
import {
  AVATAR_COLORS,
  BLOTTER_CATEGORIES,
  DEFAULT_FALLBACK_COLOR,
  STATUS_STYLES,
} from "@/constants";
import { useRouter } from "next/navigation";
import { VisibilityRounded } from "@mui/icons-material";

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

const BlotterOverview = ({ isCompact = false }) => {
  const [blotters, setBlotters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    dateFrom: "",
    dateTo: "",
  });
  const router = useRouter();

  const fetchBlotters = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/blotter?include=complainant");
      const data = await res.json();
      if (!data.success || !Array.isArray(data.data)) {
        throw new Error(data.error || "Invalid response format");
      }
      setBlotters(data.data);
    } catch (err) {
      console.error("Blotter fetch failed:", err);
    } finally {
      if (showLoading) setLoading(false);
      if (isInitialLoad) {
        setIsInitialLoad(false);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let active = true;

    const loopFetch = async () => {
      if (!active) return;
      await fetchBlotters(false);
      if (active) setTimeout(loopFetch, 5000);
    };

    fetchBlotters(true);
    loopFetch();

    return () => {
      active = false;
    };
  }, []);

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
      render: (value) => BLOTTER_CATEGORIES[value] || value,
    },
    {
      key: "complainant",
      header: "Complainant",
      render: (_, row) => {
        const c = row.complainant || {};
        const initials =
          `${c?.firstName?.[0] || ""}${c?.lastName?.[0] || ""}`.toUpperCase();
        const avatarColor = getDeterministicAvatarColor(c?.id, AVATAR_COLORS);

        return (
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${avatarColor}`}
              title={`${c?.firstName || ""} ${c?.lastName || ""}`.trim()}
            >
              {initials}
            </div>
            <div>
              <div className="text-xs font-medium text-text">
                {`${c?.lastName || ""}, ${c?.firstName || ""} ${c?.middleName || ""}`.trim()}
              </div>
              {c?.phoneNumber && (
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
                onClick={() => router.push(`/admin/blotter/${row.id}`)}
                className="text-primary hover:text-accent cursor-pointer"
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
          onClear={() =>
            setFilters({ q: "", category: "", dateFrom: "", dateTo: "" })
          }
        />
      )}
      <DataTable
        data={filtered}
        columns={columns}
        isCompact={isCompact}
        isViewable={true}
        viewMore={() => router.push("/admin/blotter")}
        title="Blotter Overview"
        loading={loading}
      />
    </>
  );
};

export default BlotterOverview;

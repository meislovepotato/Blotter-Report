"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components";
import {
  AVATAR_COLORS,
  BLOTTER_CATEGORIES,
  DEFAULT_FALLBACK_COLOR,
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
  const router = useRouter();

  const fetchBlotters = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/blotter?include=complainant");
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Unknown error");
      setBlotters(Array.isArray(data.data) ? data.data : []);
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
    fetchBlotters(true);
    const interval = setInterval(() => fetchBlotters(false), 5000);
    return () => clearInterval(interval);
  }, []);

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
          className={`px-2 py-1 rounded-full text-xs ${
            value === "FILED"
              ? "bg-yellow-100 text-yellow-800"
              : value === "UNDER_MEDIATION"
                ? "bg-blue-100 text-blue-800"
                : value === "RESOLVED"
                  ? "bg-green-100 text-green-800"
                  : value === "REFERRED"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
          }`}
        >
          {value.replace(/_/g, " ")}
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
        const c = row.complainant;
        const initials =
          `${c?.firstName?.[0] || ""}${c?.lastName?.[0] || ""}`.toUpperCase();
        const avatarColor = getDeterministicAvatarColor(c?.id, AVATAR_COLORS);

        return (
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${avatarColor}`}
            >
              {initials}
            </div>
            <div>
              <div className="text-xs font-medium text-text">
                {`${c?.lastName}, ${c?.firstName} ${c?.middleName || ""}`.trim()}
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
      render: (val, row) => val || row.complainant?.fullAddress,
    },
    {
      key: "incidentDateTime",
      header: "Incident Date",
      render: (val) => {
        const date = new Date(val);
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
    <DataTable
      data={blotters}
      columns={columns}
      isCompact={isCompact}
      isViewable={true}
      viewMore={() => router.push("/admin/blotter")}
      title="Blotter Overview"
      loading={loading}
    />
  );
};

export default BlotterOverview;

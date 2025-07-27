"use client";

import {
  AssignmentTurnedInRounded,
  FlagRounded,
  SummarizeRounded,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { useSocket } from "@/context";

const DashboardStats = () => {
  const [stats, setStats] = useState(null);

  const fetchStats = () => {
    fetch("/api/stats/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then(setStats)
      .catch((err) => {
        console.error("Failed to load stats", err);
        setStats({ pendingComplaints: 0, resolvedCases: 0, flaggedReports: 0 }); // fallback
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    const handleNewComplaint = () => {
      console.log("📥 Complaint created - refetching dashboard stats...");
      fetchStats();
    };

    const handleStatusUpdate = () => {
      console.log(
        "🔄 Complaint status updated - refetching dashboard stats..."
      );
      fetchStats();
    };

    socket.on("complaint-created", handleNewComplaint);
    socket.on("blotter-created", handleNewComplaint);
    socket.on("complaint-updated", handleStatusUpdate);
    socket.on("blotter-updated", handleStatusUpdate);

    return () => {
      socket.off("complaint-created", handleNewComplaint);
      socket.off("blotter-created", handleNewComplaint);
      socket.off("complaint-updated", handleStatusUpdate);
      socket.off("blotter-updated", handleStatusUpdate);
    };
  }, [socket]);

  if (!stats)
    return (
      <>
        <div className="row-span-3 col-span-2 p-4 rounded-2xl bg-background"></div>
        <div className="row-span-3 col-span-2 p-4 rounded-2xl bg-background"></div>
        <div className="row-span-3 col-span-2 p-4 rounded-2xl bg-background"></div>
      </>
    );

  const STAT_CARD_CONFIG = [
    {
      key: "pending",
      label: "Pending Complaints",
      value: stats.pendingComplaints,
      icon: <SummarizeRounded />,
    },
    {
      key: "resolved",
      label: "Resolved Cases",
      value: stats.resolvedCases,
      icon: <AssignmentTurnedInRounded />,
    },
    {
      key: "flagged",
      label: "Flagged Reports",
      value: stats.flaggedReports,
      icon: <FlagRounded />,
    },
  ];

  return (
    <>
      {STAT_CARD_CONFIG.map(({ key, label, value, icon }) => (
        <div
          key={key}
          className="row-span-2 col-span-2 p-4 rounded-2xl bg-background"
        >
          <StatCard label={label} value={value} icon={icon} />
        </div>
      ))}
    </>
  );
};

export default DashboardStats;

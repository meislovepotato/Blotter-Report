"use client";

import { useSocket } from "@/context";
import { CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const LiveActivityFeed = () => {
  const containerRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [limit, setLimit] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setHasMounted(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const calculateLimit = () => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const headerHeight = 40;
      const availableHeight = containerHeight - headerHeight;
      const itemHeight = 70;
      const newLimit = Math.max(1, Math.floor(availableHeight / itemHeight));

      if (newLimit !== limit) {
        setLimit(newLimit);
      }
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver(calculateLimit);
    if (containerRef.current) {
      observer.observe(containerRef.current);
      setTimeout(calculateLimit, 100);
    }
    return () => observer.disconnect();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const [complaintRes, blotterRes] = await Promise.all([
        fetch(`/api/events/complaints`),
        fetch(`/api/events/blotters`),
      ]);

      if (!complaintRes.ok) throw new Error("Failed to fetch complaint events");
      if (!blotterRes.ok) throw new Error("Failed to fetch blotter events");

      const complaintJson = await complaintRes.json();
      const blotterJson = await blotterRes.json();

      const complaintEvents = (complaintJson?.data ?? []).map((e) => ({
        id: e.id,
        trackingId: e.complaint?.trackingId ?? "N/A",
        action: e.action,
        adminName:
          e.admin?.name ??
          `${e.complaint?.complainant?.firstName ?? "Unknown"} ${e.complaint?.complainant?.lastName ?? ""}`.trim(),
        timestamp: new Date(e.createdAt),
      }));

      const blotterEvents = (blotterJson?.data ?? []).map((e) => ({
        id: e.id,
        trackingId: e.blotter?.trackingId ?? "N/A",
        action: e.action,
        adminName: e.admin?.name ?? "Unknown Admin",
        timestamp: new Date(e.createdAt),
      }));

      const normalized = [...complaintEvents, ...blotterEvents];

      const sorted = normalized
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);

      setEvents(sorted);
    } catch (err) {
      console.error("Failed to load activity feed:", err);
      setError("Couldn't load activity feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [limit]);

  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    const handleNewComplaint = () => {
      console.log("Complaint created - live activity refresh...");
      fetchEvents();
    };

    const handleStatusUpdate = () => {
      console.log("🔄 Complaint status updated - live activity refresh...");
      fetchEvents();
    };

    const handleNewBlotter = () => {
      console.log("📄 Blotter created - live activity refresh...");
      fetchEvents();
    };

    socket.on("complaint-created", handleNewComplaint);
    socket.on("complaint-updated", handleStatusUpdate);
    socket.on("blotter-created", handleNewBlotter);
    return () => {
      socket.on("complaint-created", handleNewComplaint);
      socket.off("complaint-updated", handleStatusUpdate);
      socket.off("blotter-created", handleNewBlotter);
    };
  }, [socket, limit]);

  const formatTimestamp = (val) => {
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
  };

  if (!hasMounted) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm text-center py-4">{error}</div>;
  }

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      <h3 className="text-sm text-text font-semibold mb-4 flex-shrink-0">
        Live Activity Feed
      </h3>
      <div className="flex flex-col gap-2 flex-1 min-h-0">
        {events.map((event) => (
          <div
            key={event.id}
            className="text-sm bg-gray-100 px-4 py-2 rounded-md border border-gray-200 flex flex-col"
          >
            <div className="flex flex-row items-center gap-2 flex-1">
              <span
                className="font-medium min-w-0 flex-1 truncate text-right"
                title={event.adminName}
              >
                {event.adminName}
              </span>
              <span>{event.action.toLowerCase()}</span>
              <span
                className="italic text-gray-600"
                title={`#${event.trackingId}`}
              >
                #{event.trackingId}
              </span>
            </div>
            <div className="text-xs text-gray-500 w-full text-right">
              {formatTimestamp(event.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveActivityFeed;

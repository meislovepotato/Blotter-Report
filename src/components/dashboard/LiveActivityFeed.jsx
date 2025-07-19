"use client";

import { emitter } from "@/lib";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

const LiveActivityFeed = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const [complaintRes, blotterRes] = await Promise.all([
        fetch("/api/events/complaints"),
        fetch("/api/events/blotters"),
      ]);

      if (!complaintRes.ok) throw new Error("Failed to fetch complaint events");
      if (!blotterRes.ok) throw new Error("Failed to fetch blotter events");

      const complaintJson = await complaintRes.json();
      const blotterJson = await blotterRes.json();

      console.log("Complaint Res:", complaintJson);
      console.log("Blotter Res:", blotterJson);

      const { data: complaintEvents = [] } = complaintJson;
      const { data: blotterEvents = [] } = blotterJson;

      const normalized = [
        ...complaintEvents.map((e) => ({
          id: e.id,
          trackingId: e.complaint?.trackingId ?? "N/A",
          action: e.action,
          adminName:
            e.admin?.name ??
            `${e.complaint?.complainant?.firstName ?? "Unknown"} ${e.complaint?.complainant?.lastName ?? ""}`.trim(),
          timestamp: new Date(e.createdAt),
        })),
        ...blotterEvents.map((e) => ({
          id: e.id,
          trackingId: e.blotter?.trackingId ?? "N/A",
          action: e.action,
          adminName: e.admin?.name ?? "Unknown Admin",
          timestamp: new Date(e.createdAt),
        })),
      ];

      const sorted = normalized.sort((a, b) => b.timestamp - a.timestamp);

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

    const handler = () => fetchEvents();
    emitter.addEventListener("activityFeedUpdated", handler);

    return () => {
      emitter.removeEventListener("activityFeedUpdated", handler);
    };
  }, []);

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

  return (
    <>
      <h3 className="flex flex-col text-sm text-text font-semibold">
        Live Activity Feed
      </h3>
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="text-sm bg-gray-100 px-4 py-2 rounded-md border border-gray-200"
          >
            <span className="flex flex-row gap-1">
              <span className="font-medium">{event.adminName}</span>
              {event.action.toLowerCase()}
              <span className="italic text-gray-600">
                {event.type} #{event.trackingId}
              </span>
            </span>
            <div className="text-xs text-gray-500 w-full text-right">
              {formatTimestamp(event.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LiveActivityFeed;

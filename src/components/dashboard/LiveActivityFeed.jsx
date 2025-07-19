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

      if (!complaintRes.ok || !blotterRes.ok) {
        throw new Error("Failed to fetch one or both event types");
      }

      const { data: complaintEvents = [] } = await complaintRes.json();
      const { data: blotterEvents = [] } = await blotterRes.json();

      const normalized = [
        ...complaintEvents.map((e) => ({
          id: e.id,
          type: "complaint",
          relatedId: e.complaintId,
          action: e.action,
          adminName: e.admin?.name ?? "Unknown Admin",
          timestamp: new Date(e.createdAt),
        })),
        ...blotterEvents.map((e) => ({
          id: e.id,
          type: "blotter",
          relatedId: e.blotterId,
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

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="text-sm bg-gray-100 px-4 py-2 rounded-md border border-gray-200"
        >
          <span className="font-medium">{event.adminName}</span>{" "}
          {event.action.toLowerCase()}{" "}
          <span className="italic text-gray-600">
            [{event.type} #{event.relatedId}]
          </span>
          <div className="text-xs text-gray-500">
            {event.timestamp.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveActivityFeed;

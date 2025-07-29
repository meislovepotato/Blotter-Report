"use client";
import { useFakeSMS } from "@/context/FakeSMSContext";

export default function FakeSMSPage() {
  const { messages } = useFakeSMS();
  const complainantMessages = messages.filter((msg) => msg.type === "complainant");
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Fake SMS Inbox (Complainant)</h1>
      {complainantMessages.length === 0 ? (
        <div className="text-gray-500">No fake SMS messages.</div>
      ) : (
        <ul className="space-y-4">
          {complainantMessages.map((msg) => (
            <li key={msg.id} className="border rounded p-4 bg-white shadow">
              <div className="text-xs text-gray-400 mb-1">{new Date(msg.timestamp).toLocaleString()}</div>
              <div><b>Message:</b> {msg.content}</div>
              {msg.meta?.trackingId && (
                <div className="text-xs text-gray-500 mt-1">Tracking ID: {msg.meta.trackingId}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 
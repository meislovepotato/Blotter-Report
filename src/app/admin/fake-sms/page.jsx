"use client";
import { useFakeSMS } from "@/context/FakeSMSContext";

export default function AdminFakeSMSPage() {
  const { messages, clearFakeSMS } = useFakeSMS();
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Fake SMS Inbox (Admin)</h1>
      <button
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={clearFakeSMS}
      >
        Clear All
      </button>
      {messages.length === 0 ? (
        <div className="text-gray-500">No fake SMS messages.</div>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="border rounded p-4 bg-white shadow">
              <div className="text-xs text-gray-400 mb-1">
                {new Date(msg.timestamp).toLocaleString()}
              </div>
              <div>
                <b>Type:</b> {msg.type}
              </div>
              <div>
                <b>Recipient:</b> {msg.recipient}
              </div>
              <div>
                <b>Message:</b> {msg.content}
              </div>
              {msg.meta?.trackingId && (
                <div className="text-xs text-gray-500 mt-1">
                  Tracking ID: {msg.meta.trackingId}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

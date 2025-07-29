"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components";
import { useRouter } from "next/navigation";
import { useSocket } from "@/context";

const PendingAdminsTable = ({ isCompact = false, isViewable = true }) => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchPendingAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/pending");
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setPendingAdmins(result.data || []);
    } catch (err) {
      console.error("Failed to fetch pending admins:", err);
    } finally {
      setLoading(false);
    }
  };

  const approveAdmin = async (id) => {
    try {
      const res = await fetch(`/api/auth/approve/${id}`, { method: "POST" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      fetchPendingAdmins();
    } catch (err) {
      console.error("Failed to approve admin:", err);
    }
  };

  const rejectAdmin = async (id) => {
    try {
      const res = await fetch(`/api/auth/reject/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      fetchPendingAdmins();
    } catch (err) {
      console.error("Failed to reject admin:", err);
    }
  };

  const socket = useSocket();
  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleAdminUpdate = () => {
      console.log("✅ Admin updated - refetching...");
      fetchPendingAdmins();
    };

    socket.on("admin-updated", handleAdminUpdate);

    return () => {
      socket.off("admin-updated", handleAdminUpdate);
    };
  }, [socket]);

  const columns = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "phoneNumber",
      header: "Phone",
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              approveAdmin(row.id);
              if (socket) {
                socket.emit("admin-updated", {
                  timestamp: Date.now(),
                  message: "New complaint submitted!",
                });
                console.log("✅ admin-updated event emitted");
              }
            }}
            className="text-xs px-2 py-1 bg-green-600 text-white rounded  cursor-pointer hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              rejectAdmin(row.id);
              if (socket) {
                socket.emit("admin-updated", {
                  timestamp: Date.now(),
                  message: "New complaint submitted!",
                });
                console.log("✅ admin-updated event emitted");
              }
            }}
            className="text-xs px-2 py-1 bg-red-500 text-white rounded cursor-pointer  hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={pendingAdmins}
      columns={columns}
      title="Pending Admins"
      isCompact={isCompact}
      isViewable={isViewable}
      viewMore={() => router.push("/admin/users")}
      loading={loading}
    />
  );
};

export default PendingAdminsTable;

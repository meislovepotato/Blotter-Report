import { useState, useEffect } from "react";
import { Typography, Box, Button } from "@mui/material";

const PendingAdmins = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingAdmins = async () => {
      const res = await fetch("/api/admin/pending");
      const data = await res.json();
      setPendingAdmins(data);
      setLoading(false);
    };
    fetchPendingAdmins();
  }, []);

  const handleApprove = async (id) => {
    const res = await fetch("/api/admin/pending", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    alert(`Approved! Admin ID: ${data.adminId}`);
    setPendingAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  const handleReject = async (id) => {
    await fetch("/api/admin/pending", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPendingAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (pendingAdmins.length === 0) return <Typography>No pending signups.</Typography>;

  return (
    <Box>
      {pendingAdmins.map((admin) => (
        <Box key={admin.id} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
          <Typography>{admin.name} ({admin.email})</Typography>
          <Button onClick={() => handleApprove(admin.id)} color="success" variant="contained">Approve</Button>
          <Button onClick={() => handleReject(admin.id)} color="error" variant="outlined">Reject</Button>
        </Box>
      ))}
    </Box>
  );
};

export default PendingAdmins;
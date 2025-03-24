"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const StaffDashboard = () => {
  const [blotters, setBlotters] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBlotter, setSelectedBlotter] = useState(null);

  useEffect(() => {
    const fetchBlotters = async () => {
      try {
        const response = await fetch("/api/dashboard"); // Adjust the API path as needed
        const data = await response.json();
        setBlotters(data);
      } catch (error) {
        console.error("Error fetching blotters:", error);
      }
    };
    fetchBlotters();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setBlotters((prevBlotters) =>
      prevBlotters.map((blotter) =>
        blotter.id === id ? { ...blotter, status: newStatus } : blotter
      )
    );
  };

  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleViewDetails = (blotter) => {
    setSelectedBlotter(blotter);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBlotter(null);
  };

  const filteredBlotters = blotters.filter(
    (blotter) => statusFilter === "All" || blotter.status === statusFilter
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Blotter Reports
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select value={statusFilter} onChange={handleFilterChange}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Resolved">Resolved</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Complainant</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBlotters.map((blotter) => (
              <TableRow key={blotter.id}>
                <TableCell>{blotter.complainant}</TableCell>
                <TableCell>{blotter.category}</TableCell>
                <TableCell>{blotter.description}</TableCell>
                <TableCell>{blotter.address}</TableCell>
                <TableCell>{blotter.status}</TableCell>
                <TableCell>
                  <Select
                    value={blotter.status}
                    onChange={(event) =>
                      handleStatusChange(blotter.id, event.target.value)
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        border: "none", // Removes the border line of the select box
                      },
                    }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewDetails(blotter)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Blotter Details Dialog */}
      {selectedBlotter && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Blotter Details</DialogTitle>
          <DialogContent>
            <Typography variant="h6">
              Complainant: {selectedBlotter.complainant}
            </Typography>
            <Typography variant="body1">
              Category: {selectedBlotter.category}
            </Typography>
            <Typography variant="body1">
              Description: {selectedBlotter.description}
            </Typography>
            <Typography variant="body1">
              Address: {selectedBlotter.address}
            </Typography>
            <Typography variant="body1">
              Status: {selectedBlotter.status}
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Attachments:
            </Typography>
            {selectedBlotter.attachmentFront && (
              <img
                src={`data:image/png;base64,${selectedBlotter.attachmentFront}`}
                alt="Attachment Front"
                style={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
              />
            )}
            {selectedBlotter.attachmentBack && (
              <img
                src={`data:image/png;base64,${selectedBlotter.attachmentBack}`}
                alt="Attachment Back"
                style={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default StaffDashboard;

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
    // Fetch blotter reports from API
    const fetchBlotters = async () => {
      // Replace with actual API call
      const data = [
        {
          id: 1,
          complainant: "MJ Fernandez",
          description: "Drunk guy on rampage causing chaos in the street.",
          status: "Pending",
          address:
            "B1 Lot 13 Baltao Subd. Brgy. Sta Cruz Purok Sampaguita, Antipolo City",
          phoneNumber: "09171234567",
          otherContacts: "MJ Fernandez (FB)",
        },
        {
          id: 2,
          complainant: "Alice Johnson",
          description: "Graffiti on wall",
          status: "Resolved",
          address: "B3 Lot 5, Barangay San Isidro, Antipolo City",
          phoneNumber: "09159876543",
          otherContacts: "Alice Johnson (Email)",
        },
        {
          id: 3,
          complainant: "Charlie Davis",
          description: "Stolen bicycle",
          status: "Pending",
          address: "Blk 4 Lot 2, Barangay San Juan, Antipolo City",
          phoneNumber: "09172345678",
          otherContacts: "Charlie Davis (Phone)",
        },
      ];
      setBlotters(data);
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
                <TableCell>{blotter.description}</TableCell>
                <TableCell>{blotter.address}</TableCell>
                <TableCell>{blotter.status}</TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
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
                  </FormControl>
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

      {/* Dialog to show blotter details */}
      {selectedBlotter && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Blotter Details</DialogTitle>
          <DialogContent>
            <Typography variant="h6">
              Complainant: {selectedBlotter.complainant}
            </Typography>
            <Typography variant="body1">
              Description: {selectedBlotter.description}
            </Typography>
            <Typography variant="body1">
              Address: {selectedBlotter.address}
            </Typography>
            <Typography variant="body1">
              Phone: {selectedBlotter.phoneNumber}
            </Typography>
            <Typography variant="body1">
              Other Contacts: {selectedBlotter.otherContacts}
            </Typography>
            <Typography variant="body1">
              Status: {selectedBlotter.status}
            </Typography>
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

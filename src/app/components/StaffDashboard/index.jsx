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
} from "@mui/material";

const StaffDashboard = () => {
  const [blotters, setBlotters] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    // Fetch blotter reports from API
    const fetchBlotters = async () => {
      // Replace with actual API call
      //   const response = await fetch("/api/blotters");
      //   const data = await response.json();
      const data = [
        {
          id: 1,
          complainant: "John Doe",
          description: "Loud music at night",
          status: "Pending",
        },
        {
          id: 2,
          complainant: "Alice Johnson",
          description: "Graffiti on wall",
          status: "Resolved",
        },
        {
          id: 3,
          complainant: "Charlie Davis",
          description: "Stolen bicycle",
          status: "Pending",
        },
      ];
      setBlotters(data);
    };
    fetchBlotters();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    console.log(`Blotter ID: ${id}, New Status: ${newStatus}`);
    setBlotters((prevBlotters) =>
      prevBlotters.map((blotter) =>
        blotter.id === id ? { ...blotter, status: newStatus } : blotter
      )
    );
  };

  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value);
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
                <TableCell>{blotter.status}</TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={blotter.status}
                      onChange={(event) =>
                        handleStatusChange(blotter.id, event.target.value)
                      }
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Resolved">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default StaffDashboard;

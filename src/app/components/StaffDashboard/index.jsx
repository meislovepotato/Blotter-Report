"use client";

import { useState, useEffect } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

const StaffDashboard = () => {
  const [blotters, setBlotters] = useState([]);

  useEffect(() => {
    // Fetch blotter reports from API
    const fetchBlotters = async () => {
      // Replace with actual API call
      const response = await fetch("/api/blotters");
      const data = await response.json();
      setBlotters(data);
    };
    fetchBlotters();
  }, []);

  const handleResolve = (id) => {
    console.log("Resolved blotter ID:", id);
    // Perform API update here
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Blotter Reports
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Complainant</TableCell>
              <TableCell>Respondent</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blotters.map((blotter) => (
              <TableRow key={blotter.id}>
                <TableCell>{blotter.complainant}</TableCell>
                <TableCell>{blotter.respondent}</TableCell>
                <TableCell>{blotter.category}</TableCell>
                <TableCell>{blotter.description}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleResolve(blotter.id)}
                  >
                    Resolve
                  </Button>
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

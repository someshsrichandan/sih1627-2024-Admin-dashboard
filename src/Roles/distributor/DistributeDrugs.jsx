// components/DistributeDrugs.jsx
import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const DistributeDrugs = () => {
  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Distribute Drugs
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }}>
        Add New Distribution
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Drug Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Destination</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map through distribution data */}
            <TableRow>
              <TableCell>Paracetamol</TableCell>
              <TableCell align="right">1000</TableCell>
              <TableCell align="right">Pharmacy A</TableCell>
              <TableCell align="right">Pending</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DistributeDrugs;

// components/Dashboard/EnhancedOrdersTable.jsx
import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  { id: 1, drug: 'Paracetamol', quantity: 1000, status: 'Pending', destination: 'Pharmacy A' },
  { id: 2, drug: 'Ibuprofen', quantity: 500, status: 'Shipped', destination: 'Pharmacy B' },
];

const columns = [
  { field: 'drug', headerName: 'Drug Name', width: 150 },
  { field: 'quantity', headerName: 'Quantity', width: 130 },
  { field: 'status', headerName: 'Status', width: 130 },
  { field: 'destination', headerName: 'Destination', width: 150 },
];

const EnhancedOrdersTable = () => {
  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Manage Orders
      </Typography>
      <TextField label="Search Orders" variant="outlined" fullWidth sx={{ mb: 2 }} />
      <Paper elevation={3}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection disableSelectionOnClick />
        </div>
      </Paper>
    </Box>
  );
};

export default EnhancedOrdersTable;

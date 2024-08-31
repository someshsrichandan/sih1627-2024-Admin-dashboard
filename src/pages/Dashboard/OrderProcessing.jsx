// src/components/Dashboard/OrderProcessing.jsx
import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

const OrderProcessing = () => {
  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Typography variant="h6">Order Processing</Typography>
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="body1">You have 5 pending orders.</Typography>
        <Button variant="contained" color="primary" sx={{ marginTop: 1 }}>
          View Orders
        </Button>
      </Box>
    </Paper>
  );
};

export default OrderProcessing;

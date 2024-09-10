// src/components/Dashboard/InventoryManagement.jsx
import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const InventoryManagement = () => {
  // Mock data for demonstration
  const inventory = [
    { name: 'Paracetamol', quantity: 1000 },
    { name: 'Aspirin', quantity: 500 },
    { name: 'Ibuprofen', quantity: 200 },
  ];

  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Typography variant="h6">Inventory Management</Typography>
      <Box sx={{ marginTop: 2 }}>
        <List>
          {inventory.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${item.name}: ${item.quantity} units`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default InventoryManagement;

// components/WarehouseManagement.jsx
import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';

const WarehouseManagement = () => {
  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Warehouse Management
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Warehouse 1</Typography>
              <Typography variant="body2">Stock: 2000 units</Typography>
              <Button variant="outlined" color="primary" sx={{ mt: 2 }}>View Details</Button>
            </CardContent>
          </Card>
        </Grid>
        {/* Add more warehouse cards as needed */}
      </Grid>
    </Box>
  );
};

export default WarehouseManagement;

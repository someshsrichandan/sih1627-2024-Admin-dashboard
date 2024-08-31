// components/Dashboard.jsx
import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const Dashboard = () => {
  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Current Stock Levels</Typography>
              <Typography variant="body2">Manage and track stock levels in real-time.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Recent Orders</Typography>
              <Typography variant="body2">Overview of recent orders and status updates.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

// src/components/Dashboard.jsx
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import Statistics from './Dashboard/Statistics';
import InventoryManagement from './Dashboard/InventoryManagement'; // New component for managing inventory
import OrderProcessing from './Dashboard/OrderProcessing'; // Component for handling orders
import DistributionTracking from './Dashboard/DistributionTracking'; // Component to track distribution
import ComplianceChecks from './Dashboard/ComplianceChecks'; // For government users
import TaskManagement from './Dashboard/TaskManagement'; // For task-related actions
import PerformanceMetrics from './Dashboard/PerformanceMetrics'; // For distributor performance
import Notifications from './Dashboard/Notifications';
import QuickActions from './Dashboard/QuickActions';

const Dashboard = () => {
  // Function to render dashboard content
  const renderContent = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InventoryManagement /> {/* Inventory Management Section */}
        </Grid>
        <Grid item xs={12} md={6}>
          <OrderProcessing /> {/* Order Processing Section */}
        </Grid>
        <Grid item xs={12} md={6}>
          <DistributionTracking /> {/* Tracking distribution progress */}
        </Grid>
        <Grid item xs={12} md={6}>
          <ComplianceChecks /> {/* Compliance checks */}
        </Grid>
        <Grid item xs={12} md={6}>
          <Statistics /> {/* Basic Statistics */}
        </Grid>
        <Grid item xs={12} md={6}>
          <PerformanceMetrics /> {/* Performance metrics */}
        </Grid>
        <Grid item xs={12} md={6}>
          <Notifications /> {/* Notifications */}
        </Grid>
        <Grid item xs={12} md={6}>
          <TaskManagement /> {/* Task management */}
        </Grid>
        <Grid item xs={12}>
          <QuickActions /> {/* Quick actions */}
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        {renderContent()}
      </Paper>
    </Box>
  );
};

export default Dashboard;

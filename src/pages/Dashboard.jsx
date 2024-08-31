// src/components/Dashboard.jsx
import React, { useContext } from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { AuthContext } from '../context/AuthContext'; // Correctly import AuthContext
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
  const { user } = useContext(AuthContext); // Get the user from context

  // Function to render different sections based on user role
  const renderContent = () => {
    switch (user?.role) {
      case 'drugSupplier':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InventoryManagement /> {/* Inventory Management Section */}
            </Grid>
            <Grid item xs={12} md={6}>
              <OrderProcessing /> {/* Order Processing Section */}
            </Grid>
            <Grid item xs={12} md={6}>
              <Statistics /> {/* Basic Statistics */}
            </Grid>
            <Grid item xs={12} md={6}>
              <Notifications />
            </Grid>
            <Grid item xs={12}>
              <QuickActions />
            </Grid>
          </Grid>
        );
      case 'government':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ComplianceChecks /> {/* Government compliance and monitoring */}
            </Grid>
            <Grid item xs={12} md={6}>
              <Statistics /> {/* Overview Statistics */}
            </Grid>
            <Grid item xs={12} md={6}>
              <Notifications />
            </Grid>
            <Grid item xs={12} md={6}>
              <QuickActions />
            </Grid>
            <Grid item xs={12}>
              <PerformanceMetrics /> {/* Metrics on distribution and supply */}
            </Grid>
          </Grid>
        );
      case 'distributor':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DistributionTracking /> {/* Tracking distribution progress */}
            </Grid>
            <Grid item xs={12} md={6}>
              <OrderProcessing /> {/* Handling Orders */}
            </Grid>
            <Grid item xs={12} md={6}>
              <Statistics />
            </Grid>
            <Grid item xs={12} md={6}>
              <Notifications />
            </Grid>
            <Grid item xs={12}>
              <QuickActions />
            </Grid>
          </Grid>
        );
      case 'distributorLowLevel':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TaskManagement /> {/* Basic task management */}
            </Grid>
            <Grid item xs={12} md={6}>
              <Statistics />
            </Grid>
            <Grid item xs={12} md={6}>
              <Notifications />
            </Grid>
          </Grid>
        );
      case 'medicalAdministrator':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InventoryManagement /> {/* Manage received drugs */}
            </Grid>
            <Grid item xs={12} md={6}>
              <OrderProcessing /> {/* View and manage orders */}
            </Grid>
            <Grid item xs={12} md={6}>
              <Statistics />
            </Grid>
            <Grid item xs={12} md={6}>
              <TaskManagement />
            </Grid>
            <Grid item xs={12}>
              <Notifications />
            </Grid>
          </Grid>
        );
      default:
        return (
          <Typography variant="h6" color="error">
            No access to this dashboard
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {user ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard` : 'Dashboard'}
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        {renderContent()}
      </Paper>
    </Box>
  );
};

export default Dashboard;

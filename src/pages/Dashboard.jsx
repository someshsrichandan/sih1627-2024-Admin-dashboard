// components/Dashboard.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Statistics from './Dashboard/Statistics';
import EnhancedOrdersTable from './Dashboard/EnhancedOrdersTable';
import Charts from './Dashboard/Charts';
import Notifications from './Dashboard/Notifications';
import TasksManagement from './Dashboard/TasksManagement';
import QuickActions from './Dashboard/QuickActions';
import UserAnalytics from './Dashboard/UserAnalytics';
import DistributionMap from './Dashboard/DistributionMap';
import TaskBoard from './Dashboard/TaskBoard';

const Dashboard = () => {
  const { user } = useAuth();

  const renderContent = () => {
    switch (user.role) {
      case 'distributor':
        return (
          <>
            <Statistics />
            <EnhancedOrdersTable />
            <Charts />
            <Notifications />
            <TasksManagement />
            <QuickActions />
            <UserAnalytics />
            <DistributionMap />
            <TaskBoard />
          </>
        );
      case 'drugSupplier':
        return (
          <>
            <Statistics />
            <EnhancedOrdersTable />
            <Notifications />
            <TasksManagement />
            <QuickActions />
          </>
        );
      case 'government':
        return (
          <>
            <Statistics />
            <Charts />
            <UserAnalytics />
            <Notifications />
            <QuickActions />
            <DistributionMap />
          </>
        );
      default:
        return <Typography>No access to this dashboard</Typography>;
    }
  };

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
      </Typography>
      {renderContent()}
    </Box>
  );
};

export default Dashboard;

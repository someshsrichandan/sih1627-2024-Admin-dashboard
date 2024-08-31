// src/components/Dashboard/Statistics.jsx
import React from 'react';
import { Box, Typography, Paper, Grid, Avatar } from '@mui/material';
import { AssignmentTurnedIn, PendingActions, Inventory2 } from '@mui/icons-material';

const Statistics = () => {
  // Mock data for statistics
  const stats = [
    { label: 'Total Orders', value: 120, icon: <AssignmentTurnedIn />, color: 'primary' },
    { label: 'Pending Deliveries', value: 45, icon: <PendingActions />, color: 'secondary' },
    { label: 'Completed Deliveries', value: 75, icon: <Inventory2 />, color: 'success' },
  ];

  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Typography variant="h6">Statistics</Typography>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
              }}
            >
              <Avatar sx={{ backgroundColor: `${stat.color}.main`, marginRight: 2 }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant="body1">{stat.label}</Typography>
                <Typography variant="h6" color={stat.color}>{stat.value}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default Statistics;

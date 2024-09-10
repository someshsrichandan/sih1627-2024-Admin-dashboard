// src/components/Dashboard/PerformanceMetrics.jsx
import React from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';

const PerformanceMetrics = () => {
  // Mock data for performance metrics
  const metrics = [
    { label: 'Delivery Efficiency', value: 85, color: 'success' },
    { label: 'Average Delivery Time', value: '2.5 days', color: 'info' },
    { label: 'Order Fulfillment', value: 92, color: 'success' },
  ];

  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Typography variant="h6">Performance Metrics</Typography>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress
                variant="determinate"
                value={typeof metric.value === 'number' ? metric.value : 100}
                color={metric.color}
                size={80}
                thickness={4}
              />
              <Typography variant="body1" sx={{ marginTop: 1 }}>
                {metric.label}
              </Typography>
              <Typography variant="h6" color={metric.color}>
                {metric.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default PerformanceMetrics;

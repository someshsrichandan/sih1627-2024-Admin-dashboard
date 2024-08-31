// src/components/Dashboard/QuickActions.jsx
import React from 'react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { Add, Report, Settings } from '@mui/icons-material';

const QuickActions = () => {
  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Typography variant="h6">Quick Actions</Typography>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<Add />}
          >
            Add New Order
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            startIcon={<Report />}
          >
            Generate Report
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            color="default"
            fullWidth
            startIcon={<Settings />}
          >
            Access Tools
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default QuickActions;

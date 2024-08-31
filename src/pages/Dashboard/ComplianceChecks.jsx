// src/components/Dashboard/ComplianceChecks.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ComplianceChecks = () => {
  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Typography variant="h6">Compliance Checks</Typography>
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="body1">All suppliers are currently compliant.</Typography>
        <Typography variant="body2" color="textSecondary">Last check: 2 hours ago</Typography>
      </Box>
    </Paper>
  );
};

export default ComplianceChecks;

// components/LiveDistributionReports.jsx
import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

const LiveDistributionReports = () => {
  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Live Distribution Reports
      </Typography>
      <Paper>
        <List>
          <ListItem>
            <ListItemText primary="Report 1" secondary="Summary of last week's distribution." />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Report 2" secondary="Details on emergency distributions." />
          </ListItem>
          {/* Add more reports as needed */}
        </List>
      </Paper>
    </Box>
  );
};

export default LiveDistributionReports;

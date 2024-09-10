// components/TaskManagement.jsx
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Checkbox, Divider } from '@mui/material';

const TaskManagement = () => {
  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Task Management
      </Typography>
      <List>
        <ListItem>
          <Checkbox />
          <ListItemText primary="Review stock levels" />
        </ListItem>
        <Divider />
        <ListItem>
          <Checkbox />
          <ListItemText primary="Schedule a meeting with the logistics team" />
        </ListItem>
        {/* Add more tasks */}
      </List>
    </Box>
  );
};

export default TaskManagement;

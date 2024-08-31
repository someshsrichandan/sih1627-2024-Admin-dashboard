// src/components/Dashboard/Notifications.jsx
import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Badge } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';

const Notifications = () => {
  // Mock data for notifications
  const notifications = [
    { id: 1, message: 'New order received', type: 'order', time: '2 mins ago' },
    { id: 2, message: 'Inventory level low', type: 'alert', time: '1 hour ago' },
    { id: 3, message: 'Distribution delay reported', type: 'warning', time: '3 hours ago' },
  ];

  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Typography variant="h6">Notifications</Typography>
      <Box sx={{ marginTop: 2 }}>
        <List>
          {notifications.map((notification) => (
            <ListItem key={notification.id}>
              <Badge
                badgeContent={<NotificationsIcon color="primary" />}
                color={notification.type === 'alert' ? 'error' : 'primary'}
              >
                <ListItemText
                  primary={notification.message}
                  secondary={notification.time}
                />
              </Badge>
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default Notifications;

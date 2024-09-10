// components/Collaboration.jsx
import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Avatar, ListItemAvatar, TextField, Button } from '@mui/material';

const Collaboration = () => {
  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Collaboration
      </Typography>
      <Paper sx={{ mb: 2 }}>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>A</Avatar>
            </ListItemAvatar>
            <ListItemText primary="John Doe" secondary="Let's ensure all stocks are updated by EOD." />
          </ListItem>
          {/* Add more messages */}
        </List>
      </Paper>
      <Box display="flex" gap={2}>
        <TextField variant="outlined" fullWidth placeholder="Type a message..." />
        <Button variant="contained" color="primary">Send</Button>
      </Box>
    </Box>
  );
};

export default Collaboration;

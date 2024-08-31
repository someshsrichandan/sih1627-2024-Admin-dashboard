// Communication.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Paper,
  Badge,
  Snackbar,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GroupIcon from '@mui/icons-material/Group';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MuiAlert from '@mui/material/Alert';

const Communication = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch initial chat messages from the server
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages'); // Replace with your actual API endpoint
        const data = await response.json();
        setMessages(data);
        setFilteredMessages(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setLoading(false);
      }
    };

    fetchMessages();

    // WebSocket setup for real-time chat updates
    const ws = new WebSocket('ws://your-websocket-url'); // Replace with your actual WebSocket URL
    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setFilteredMessages((prevMessages) => [...prevMessages, newMessage]);
      setNotificationMessage('New message received');
      setOpenSnackbar(true);
      scrollToBottom();
    };

    return () => ws.close(); // Cleanup on component unmount
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    // Simulate sending message to the server
    const sentMessage = {
      id: messages.length + 1,
      sender: 'You',
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, sentMessage]);
    setFilteredMessages([...filteredMessages, sentMessage]);
    setNewMessage('');
    scrollToBottom();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const uploadedMessage = {
        id: messages.length + 1,
        sender: 'You',
        text: `Uploaded file: ${file.name}`,
        timestamp: new Date().toISOString(),
      };

      setMessages([...messages, uploadedMessage]);
      setFilteredMessages([...filteredMessages, uploadedMessage]);
      setNotificationMessage(`File ${file.name} uploaded`);
      setOpenSnackbar(true);
      scrollToBottom();
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredMessages(messages.filter((msg) => msg.text.toLowerCase().includes(term)));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const handleMessageOptionsClick = (event, message) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleOptionsClose = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  const handleEditMessage = () => {
    setNotificationMessage('Edit message feature coming soon!');
    setOpenSnackbar(true);
    handleOptionsClose();
  };

  const handleDeleteMessage = () => {
    setMessages(messages.filter((msg) => msg.id !== selectedMessage.id));
    setFilteredMessages(filteredMessages.filter((msg) => msg.id !== selectedMessage.id));
    setNotificationMessage('Message deleted');
    setOpenSnackbar(true);
    handleOptionsClose();
  };

  const handleVoiceCall = () => {
    setNotificationMessage('Voice call feature coming soon!');
    setOpenSnackbar(true);
  };

  const handleVideoCall = () => {
    setNotificationMessage('Video call feature coming soon!');
    setOpenSnackbar(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          Communication
        </Typography>
        <Box>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={handleDarkModeToggle} />}
            label="Dark Mode"
          />
          <Tooltip title="Voice Call">
            <IconButton color="primary" onClick={handleVoiceCall}>
              <CallIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Video Call">
            <IconButton color="primary" onClick={handleVideoCall}>
              <VideoCallIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <TextField
            variant="outlined"
            placeholder="Search messages"
            value={searchTerm}
            onChange={handleSearch}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={<GroupIcon />}
            onClick={() => setNotificationMessage('Group feature coming soon!')}
            color="primary"
          >
            Group Chats
          </Button>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ mt: 3, mb: 3, height: '60vh', overflowY: 'auto', padding: 2 }}>
        <List>
          {filteredMessages.map((message) => (
            <React.Fragment key={message.id}>
              <ListItem
                alignItems="flex-start"
                onClick={(event) => handleMessageOptionsClick(event, message)}
                sx={{ cursor: 'pointer' }}
              >
                <Avatar>{message.sender.charAt(0)}</Avatar>
                <ListItemText
                  primary={message.sender}
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        {message.text}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="textSecondary">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Box display="flex" alignItems="center">
        <TextField
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          fullWidth
          multiline
          maxRows={4}
        />
        <input
          accept="*"
          style={{ display: 'none' }}
          id="file-upload"
          type="file"
          onChange={handleFileUpload}
        />
        <label htmlFor="file-upload">
          <Tooltip title="Attach File">
            <IconButton color="primary" component="span">
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
        </label>
        <Tooltip title="Send Message">
          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Message Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleOptionsClose}
      >
        <MenuItem onClick={handleEditMessage}>
          <EditIcon fontSize="small" /> Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteMessage}>
          <DeleteIcon fontSize="small" /> Delete
        </MenuItem>
        <MenuItem onClick={handleOptionsClose}>
          <EmojiEmotionsIcon fontSize="small" /> React
        </MenuItem>
      </Menu>

      {/* Notification Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <MuiAlert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {notificationMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Communication;

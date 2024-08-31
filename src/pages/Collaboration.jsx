// Collaboration.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Badge,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
  FormControlLabel,
  Switch,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import MuiAlert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { Virtuoso } from 'react-virtuoso';

const Collaboration = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [documents, setDocuments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [taskFilter, setTaskFilter] = useState('');
  const [messageFilter, setMessageFilter] = useState('');
  const [documentFilter, setDocumentFilter] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch initial data for messages, documents, and tasks
    const fetchInitialData = async () => {
      try {
        // Replace with actual API calls
        const messagesResponse = await fetch('/api/messages');
        const documentsResponse = await fetch('/api/documents');
        const tasksResponse = await fetch('/api/tasks');

        const messagesData = await messagesResponse.json();
        const documentsData = await documentsResponse.json();
        const tasksData = await tasksResponse.json();

        setMessages(messagesData);
        setDocuments(documentsData);
        setTasks(tasksData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setLoading(false);
      }
    };

    fetchInitialData();

    // WebSocket setup for real-time updates
    // Uncomment and adjust WebSocket URL as needed
    // const ws = new WebSocket('ws://your-websocket-url');
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'message') {
    //     setMessages((prevMessages) => [...prevMessages, data.message]);
    //   } else if (data.type === 'document') {
    //     setDocuments((prevDocuments) => [...prevDocuments, data.document]);
    //   } else if (data.type === 'task') {
    //     setTasks((prevTasks) => [...prevTasks, data.task]);
    //   }
    // };

    // return () => ws.close(); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat when a new message is added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add the message to the state (would be replaced with an API call in a real app)
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: newMessage, sender: 'You', timestamp: new Date() },
      ]);
      setNewMessage('');
      setNotificationMessage('Message sent successfully');
      setOpenSnackbar(true);
    }
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
    setUploadDialogOpen(true);
  };

  const handleUploadSubmit = () => {
    if (file) {
      // Simulate file upload (replace with actual API call)
      setDocuments((prevDocuments) => [
        ...prevDocuments,
        { id: documents.length + 1, name: file.name, uploadedBy: 'You', timestamp: new Date() },
      ]);
      setFile(null);
      setUploadDialogOpen(false);
      setNotificationMessage('Document uploaded successfully');
      setOpenSnackbar(true);
    }
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      // Add the task to the state (would be replaced with an API call in a real app)
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: tasks.length + 1, text: newTask, assignedTo: 'Team', status: 'Pending', timestamp: new Date() },
      ]);
      setNewTask('');
      setNotificationMessage('Task added successfully');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const filteredMessages = messages.filter((message) =>
    message.text.toLowerCase().includes(messageFilter.toLowerCase())
  );

  const filteredDocuments = documents.filter((document) =>
    document.name.toLowerCase().includes(documentFilter.toLowerCase())
  );

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(taskFilter.toLowerCase())
  );

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
          Collaboration
        </Typography>
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={handleDarkModeToggle} />}
          label="Dark Mode"
        />
      </Box>
      <Grid container spacing={3}>
        {/* Chat Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Chat</Typography>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Filter messages..."
            value={messageFilter}
            onChange={(e) => setMessageFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              border: '1px solid #ddd',
              borderRadius: 1,
              height: 300,
              overflowY: 'auto',
              padding: 2,
              marginBottom: 2,
              backgroundColor: darkMode ? '#333' : '#fff',
              color: darkMode ? '#fff' : '#000',
            }}
          >
            <Virtuoso
              data={filteredMessages}
              itemContent={(index, message) => (
                <ListItem key={message.id} alignItems="flex-start">
                  <Badge
                    color="secondary"
                    variant="dot"
                    invisible={message.sender !== 'You'}
                  >
                    <Avatar alt={message.sender} sx={{ marginRight: 2 }}>
                      {message.sender.charAt(0)}
                    </Avatar>
                  </Badge>
                  <ListItemText
                    primary={message.sender}
                    secondary={
                      <>
                        {message.text}
                        <br />
                        <small>{new Date(message.timestamp).toLocaleString()}</small>
                      </>
                    }
                  />
                </ListItem>
              )}
            />
            <div ref={messagesEndRef} />
          </Box>
          <Box display="flex" alignItems="center">
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <IconButton color="primary" onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Documents Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Documents</Typography>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Filter documents..."
            value={documentFilter}
            onChange={(e) => setDocumentFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              border: '1px solid #ddd',
              borderRadius: 1,
              height: 300,
              overflowY: 'auto',
              padding: 2,
              marginBottom: 2,
              backgroundColor: darkMode ? '#333' : '#fff',
              color: darkMode ? '#fff' : '#000',
            }}
          >
            <Virtuoso
              data={filteredDocuments}
              itemContent={(index, document) => (
                <ListItem key={document.id} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: '#1976d2', marginRight: 2 }}>
                    <AssignmentIcon />
                  </Avatar>
                  <ListItemText
                    primary={document.name}
                    secondary={
                      <>
                        Uploaded by {document.uploadedBy}
                        <br />
                        <small>{new Date(document.timestamp).toLocaleString()}</small>
                      </>
                    }
                  />
                </ListItem>
              )}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={() => document.getElementById('upload-input').click()}
          >
            Upload Document
          </Button>
          <input
            id="upload-input"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </Grid>

        {/* Tasks Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Tasks</Typography>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Filter tasks..."
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              border: '1px solid #ddd',
              borderRadius: 1,
              height: 300,
              overflowY: 'auto',
              padding: 2,
              marginBottom: 2,
              backgroundColor: darkMode ? '#333' : '#fff',
              color: darkMode ? '#fff' : '#000',
            }}
          >
            <Virtuoso
              data={filteredTasks}
              itemContent={(index, task) => (
                <ListItem key={task.id} alignItems="flex-start">
                  <ListItemText
                    primary={task.text}
                    secondary={
                      <>
                        Assigned to {task.assignedTo}
                        <br />
                        Status: {task.status}
                        <br />
                        <small>{new Date(task.timestamp).toLocaleString()}</small>
                      </>
                    }
                  />
                </ListItem>
              )}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTask}
              startIcon={<AssignmentIcon />}
            >
              Add Task
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Document Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Typography variant="body1">File: {file?.name}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUploadSubmit} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

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
        <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {notificationMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Collaboration;

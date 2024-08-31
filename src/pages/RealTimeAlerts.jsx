// RealTimeAlerts.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Box,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Tooltip,
  Button,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import MuiAlert from '@mui/material/Alert';
import { formatDistanceToNow } from 'date-fns';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const RealTimeAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Fetch initial alert data from the server
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/alerts'); // Replace with your actual API endpoint
        const data = await response.json();
        setAlerts(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
        setLoading(false);
      }
    };

    fetchAlerts();

    // WebSocket setup for real-time alerts
    const ws = new WebSocket('ws://your-websocket-url'); // Replace with your actual WebSocket URL
    ws.onmessage = (event) => {
      const newAlert = JSON.parse(event.data);
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
      setNotificationMessage('New alert received');
      setOpenSnackbar(true);

      // Play sound for high severity alerts
      if (newAlert.severity === 'High') {
        const audio = new Audio('/alert-sound.mp3'); // Replace with your alert sound file path
        audio.play();
      }
    };

    return () => ws.close(); // Cleanup on component unmount
  }, []);

  const handleDismissAlert = (alertId) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
    setNotificationMessage('Alert dismissed');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedAlert(null);
  };

  const handleBatchDismiss = () => {
    setAlerts([]);
    setNotificationMessage('All alerts dismissed');
    setOpenSnackbar(true);
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filterType) {
      return alert.type === filterType;
    }
    return true;
  });

  // Data for alert severity distribution chart
  const alertSeverityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Alert Severity Distribution',
        data: [
          alerts.filter((alert) => alert.severity === 'High').length,
          alerts.filter((alert) => alert.severity === 'Medium').length,
          alerts.filter((alert) => alert.severity === 'Low').length,
        ],
        backgroundColor: ['#f44336', '#ff9800', '#2196f3'],
        borderColor: ['#d32f2f', '#f57c00', '#1976d2'],
        borderWidth: 1,
      },
    ],
  };

  // Data for alerts over time chart
  const alertsOverTime = {
    labels: alerts.map((alert) => formatDistanceToNow(new Date(alert.timestamp))),
    datasets: [
      {
        label: 'Alerts Over Time',
        data: alerts.map((alert) => (alert.severity === 'High' ? 3 : alert.severity === 'Medium' ? 2 : 1)),
        fill: false,
        backgroundColor: '#1976d2',
        borderColor: '#1976d2',
      },
    ],
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
          Real-Time Alerts
        </Typography>
        <Box>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={handleDarkModeToggle} />}
            label="Dark Mode"
          />
          <Tooltip title="Dismiss All Alerts">
            <Button variant="contained" color="secondary" onClick={handleBatchDismiss}>
              Dismiss All
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Filter by Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="Warning">Warning</MenuItem>
              <MenuItem value="Information">Information</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h2">
            Alert Severity Distribution
          </Typography>
          <Pie data={alertSeverityData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h2">
            Alerts Over Time
          </Typography>
          <Line data={alertsOverTime} />
        </Grid>
      </Grid>

      <List>
        {filteredAlerts.map((alert) => (
          <React.Fragment key={alert.id}>
            <ListItem
              sx={{
                backgroundColor:
                  alert.severity === 'High' ? '#f44336' : alert.severity === 'Medium' ? '#ff9800' : '#2196f3',
                color: '#fff',
                mb: 1,
                borderRadius: 1,
                cursor: 'pointer',
              }}
              onClick={() => handleAlertClick(alert)}
            >
              <ListItemIcon>
                {alert.severity === 'High' && <ErrorIcon color="inherit" />}
                {alert.severity === 'Medium' && <WarningIcon color="inherit" />}
                {alert.severity === 'Low' && <InfoIcon color="inherit" />}
              </ListItemIcon>
              <ListItemText
                primary={alert.message}
                secondary={`Received ${formatDistanceToNow(new Date(alert.timestamp))} ago`}
              />
              <Tooltip title="Dismiss Alert">
                <IconButton onClick={(e) => { e.stopPropagation(); handleDismissAlert(alert.id); }} color="inherit">
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      {/* Alert Details Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Alert Details</DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box>
              <Typography variant="h6">{selectedAlert.message}</Typography>
              <Typography>Type: {selectedAlert.type}</Typography>
              <Typography>Severity: {selectedAlert.severity}</Typography>
              <Typography>Received: {formatDistanceToNow(new Date(selectedAlert.timestamp))} ago</Typography>
              <Typography>Details: {selectedAlert.details}</Typography>
              {/* Placeholder for actions like Resolve, Escalate */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
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
        <MuiAlert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {notificationMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default RealTimeAlerts;

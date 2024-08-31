// EmergencyResponse.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Snackbar,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Badge,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HistoryIcon from '@mui/icons-material/History';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import MuiAlert from '@mui/material/Alert';

const EmergencyResponse = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [incidentType, setIncidentType] = useState('');
  const [severity, setSeverity] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentIncident, setCurrentIncident] = useState({
    id: null,
    title: '',
    description: '',
    type: '',
    severity: 'Medium',
    status: 'Open',
    reportedDate: new Date(),
    assignedTo: '',
  });

  useEffect(() => {
    // Fetch initial incidents data from the server
    const fetchIncidents = async () => {
      try {
        const response = await fetch('/api/incidents'); // Replace with your actual API endpoint
        const data = await response.json();
        setIncidents(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch incidents:', error);
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const handleOpenDialog = (incident = { id: null, title: '', description: '', type: '', severity: 'Medium', status: 'Open', reportedDate: new Date(), assignedTo: '' }) => {
    setCurrentIncident(incident);
    setEditMode(Boolean(incident.id));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentIncident({ id: null, title: '', description: '', type: '', severity: 'Medium', status: 'Open', reportedDate: new Date(), assignedTo: '' });
  };

  const handleSaveIncident = () => {
    if (editMode) {
      setIncidents((prevIncidents) =>
        prevIncidents.map((incident) => (incident.id === currentIncident.id ? { ...currentIncident, reportedDate: new Date() } : incident))
      );
      setNotificationMessage('Incident updated successfully');
    } else {
      setIncidents((prevIncidents) => [
        ...prevIncidents,
        { ...currentIncident, id: incidents.length + 1, reportedDate: new Date() }, // Simplified ID assignment for demo purposes
      ]);
      setNotificationMessage('Incident added successfully');
    }
    setOpenSnackbar(true);
    handleCloseDialog();
  };

  const handleDeleteIncident = (id) => {
    setIncidents((prevIncidents) => prevIncidents.filter((incident) => incident.id !== id));
    setNotificationMessage('Incident deleted successfully');
    setOpenSnackbar(true);
  };

  const handleFilterChange = (event) => {
    setIncidentType(event.target.value);
  };

  const handleSeverityChange = (event) => {
    setSeverity(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleAlertNotification = () => {
    setNotificationMessage('Emergency alerts sent successfully');
    setOpenSnackbar(true);
  };

  const handleAssignTask = (incident) => {
    setNotificationMessage(`Task assigned for incident: ${incident.title}`);
    setOpenSnackbar(true);
  };

  const dashboardData = {
    labels: ['Open', 'In Progress', 'Resolved'],
    datasets: [
      {
        data: [
          incidents.filter((incident) => incident.status === 'Open').length,
          incidents.filter((incident) => incident.status === 'In Progress').length,
          incidents.filter((incident) => incident.status === 'Resolved').length,
        ],
        backgroundColor: ['#f44336', '#ff9800', '#4caf50'],
        hoverBackgroundColor: ['#e57373', '#ffb74d', '#81c784'],
      },
    ],
  };

  const severityData = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        label: 'Incident Severity',
        data: [
          incidents.filter((incident) => incident.severity === 'Low').length,
          incidents.filter((incident) => incident.severity === 'Medium').length,
          incidents.filter((incident) => incident.severity === 'High').length,
          incidents.filter((incident) => incident.severity === 'Critical').length,
        ],
        backgroundColor: ['#8bc34a', '#ffeb3b', '#ff9800', '#f44336'],
        borderColor: ['#7cb342', '#fdd835', '#fb8c00', '#e53935'],
        borderWidth: 1,
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
          Emergency Response
        </Typography>
        <Box>
          <Tooltip title="Send Alerts">
            <IconButton onClick={handleAlertNotification}>
              <NotificationsActiveIcon color="error" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add New Incident">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Incident
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={incidentType}
              onChange={handleFilterChange}
              label="Filter by Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Supply Shortage">Supply Shortage</MenuItem>
              <MenuItem value="Compliance Breach">Compliance Breach</MenuItem>
              <MenuItem value="Delivery Failure">Delivery Failure</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Filter by Severity</InputLabel>
            <Select
              value={severity}
              onChange={handleSeverityChange}
              label="Filter by Severity"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              label="Filter by Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Tooltip title="Refresh Data">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              fullWidth
            >
              Refresh
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h2">
            Incident Status Overview
          </Typography>
          <Pie data={dashboardData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h2">
            Severity Breakdown
          </Typography>
          <Bar data={severityData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" component="h2">
          Incident Dashboard
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reported Date</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents
                .filter((incident) => (incidentType ? incident.type === incidentType : true))
                .filter((incident) => (severity ? incident.severity === severity : true))
                .filter((incident) => (statusFilter ? incident.status === statusFilter : true))
                .map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>{incident.description}</TableCell>
                    <TableCell>{incident.type}</TableCell>
                    <TableCell>
                      <Chip
                        label={incident.severity}
                        color={
                          incident.severity === 'Critical'
                            ? 'error'
                            : incident.severity === 'High'
                            ? 'warning'
                            : incident.severity === 'Medium'
                            ? 'primary'
                            : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={incident.status}
                        color={
                          incident.status === 'Open'
                            ? 'error'
                            : incident.status === 'In Progress'
                            ? 'warning'
                            : 'success'
                        }
                      />
                    </TableCell>
                    <TableCell>{new Date(incident.reportedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{incident.assignedTo || 'Unassigned'}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit Incident">
                        <IconButton color="primary" onClick={() => handleOpenDialog(incident)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Assign Task">
                        <IconButton color="info" onClick={() => handleAssignTask(incident)}>
                          <AssignmentTurnedInIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View History">
                        <IconButton color="default" onClick={() => setNotificationMessage('Viewing history...')}>
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Incident">
                        <IconButton color="secondary" onClick={() => handleDeleteIncident(incident.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Incident Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? 'Edit Incident' : 'Add Incident'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={currentIncident.title}
            onChange={(e) => setCurrentIncident({ ...currentIncident, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={currentIncident.description}
            onChange={(e) => setCurrentIncident({ ...currentIncident, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              value={currentIncident.type}
              onChange={(e) => setCurrentIncident({ ...currentIncident, type: e.target.value })}
              label="Type"
            >
              <MenuItem value="Supply Shortage">Supply Shortage</MenuItem>
              <MenuItem value="Compliance Breach">Compliance Breach</MenuItem>
              <MenuItem value="Delivery Failure">Delivery Failure</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Severity</InputLabel>
            <Select
              value={currentIncident.severity}
              onChange={(e) => setCurrentIncident({ ...currentIncident, severity: e.target.value })}
              label="Severity"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={currentIncident.status}
              onChange={(e) => setCurrentIncident({ ...currentIncident, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Assigned To"
            type="text"
            fullWidth
            variant="outlined"
            value={currentIncident.assignedTo}
            onChange={(e) => setCurrentIncident({ ...currentIncident, assignedTo: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveIncident} color="primary" startIcon={<SaveIcon />}>
            Save
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

export default EmergencyResponse;

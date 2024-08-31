// PolicyManagement.js
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Checkbox,
  Toolbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import HistoryIcon from '@mui/icons-material/History';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import MuiAlert from '@mui/material/Alert';
import { DataGrid } from '@mui/x-data-grid';

const PolicyManagement = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [currentPolicy, setCurrentPolicy] = useState({
    id: null,
    title: '',
    description: '',
    category: '',
    status: 'Active',
    version: 1,
    lastModified: new Date(),
  });

  useEffect(() => {
    // Fetch initial policy data from the server
    const fetchPolicies = async () => {
      try {
        const response = await fetch('/api/policies'); // Replace with your actual API endpoint
        const data = await response.json();
        setPolicies(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch policies:', error);
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const handleOpenDialog = (policy = { id: null, title: '', description: '', category: '', status: 'Active', version: 1, lastModified: new Date() }) => {
    setCurrentPolicy(policy);
    setEditMode(Boolean(policy.id));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPolicy({ id: null, title: '', description: '', category: '', status: 'Active', version: 1, lastModified: new Date() });
  };

  const handleSavePolicy = () => {
    if (editMode) {
      setPolicies((prevPolicies) =>
        prevPolicies.map((policy) => (policy.id === currentPolicy.id ? { ...currentPolicy, lastModified: new Date() } : policy))
      );
      setNotificationMessage('Policy updated successfully');
    } else {
      setPolicies((prevPolicies) => [
        ...prevPolicies,
        { ...currentPolicy, id: policies.length + 1, lastModified: new Date() }, // Simplified ID assignment for demo purposes
      ]);
      setNotificationMessage('Policy added successfully');
    }
    setOpenSnackbar(true);
    handleCloseDialog();
  };

  const handleDeletePolicy = (id) => {
    setPolicies((prevPolicies) => prevPolicies.filter((policy) => policy.id !== id));
    setNotificationMessage('Policy deleted successfully');
    setOpenSnackbar(true);
  };

  const handleBulkDelete = () => {
    setPolicies((prevPolicies) => prevPolicies.filter((policy) => !selectedPolicies.includes(policy.id)));
    setNotificationMessage('Selected policies deleted successfully');
    setOpenSnackbar(true);
    setSelectedPolicies([]);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === 'category') setFilterCategory(value);
    if (name === 'status') setFilterStatus(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleExport = () => {
    setNotificationMessage('Exporting data...');
    setOpenSnackbar(true);
    // Simulate export functionality
    setTimeout(() => {
      setNotificationMessage('Data exported successfully');
      setOpenSnackbar(true);
    }, 1000);
  };

  const filteredPolicies = policies
    .filter((policy) => (filterCategory ? policy.category === filterCategory : true))
    .filter((policy) => (filterStatus ? policy.status === filterStatus : true))
    .filter((policy) => policy.title.toLowerCase().includes(searchTerm) || policy.description.toLowerCase().includes(searchTerm));

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'version', headerName: 'Version', flex: 0.5 },
    { field: 'lastModified', headerName: 'Last Modified', flex: 1, valueGetter: (params) => new Date(params.row.lastModified).toLocaleDateString() },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit Policy">
            <IconButton color="primary" onClick={() => handleOpenDialog(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Policy">
            <IconButton color="secondary" onClick={() => handleDeletePolicy(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View History">
            <IconButton color="default" onClick={() => setNotificationMessage('Version history coming soon!')}>
              <HistoryIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

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
          Policy Management
        </Typography>
        <Box>
          <Tooltip title="Export Policies">
            <IconButton onClick={handleExport}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add New Policy">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Policy
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              name="category"
              value={filterCategory}
              onChange={handleFilterChange}
              label="Filter by Category"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Safety">Safety</MenuItem>
              <MenuItem value="Compliance">Compliance</MenuItem>
              <MenuItem value="Operational">Operational</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              name="status"
              value={filterStatus}
              onChange={handleFilterChange}
              label="Filter by Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search Policies"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" component="h2">
          Policies
        </Typography>
        <Toolbar disableGutters>
          {selectedPolicies.length > 0 && (
            <Tooltip title="Delete Selected">
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
              >
                Delete Selected
              </Button>
            </Tooltip>
          )}
        </Toolbar>
        <Paper style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredPolicies}
            columns={columns}
            pageSize={10}
            checkboxSelection
            onSelectionModelChange={(newSelection) => setSelectedPolicies(newSelection)}
            getRowId={(row) => row.id}
          />
        </Paper>
      </Box>

      {/* Policy Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? 'Edit Policy' : 'Add Policy'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={currentPolicy.title}
            onChange={(e) => setCurrentPolicy({ ...currentPolicy, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={currentPolicy.description}
            onChange={(e) => setCurrentPolicy({ ...currentPolicy, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={currentPolicy.category}
              onChange={(e) => setCurrentPolicy({ ...currentPolicy, category: e.target.value })}
              label="Category"
            >
              <MenuItem value="Safety">Safety</MenuItem>
              <MenuItem value="Compliance">Compliance</MenuItem>
              <MenuItem value="Operational">Operational</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={currentPolicy.status}
              onChange={(e) => setCurrentPolicy({ ...currentPolicy, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSavePolicy} color="primary" startIcon={<SaveIcon />}>
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

export default PolicyManagement;

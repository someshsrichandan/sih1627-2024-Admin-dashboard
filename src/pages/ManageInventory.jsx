// ManageInventory.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
  Tooltip,
  Badge,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ExportIcon from '@mui/icons-material/GetApp';
import LowStockIcon from '@mui/icons-material/ErrorOutline';
import MuiAlert from '@mui/material/Alert';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { saveAs } from 'file-saver';
import { DataGrid } from '@mui/x-data-grid';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ManageInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '', batchNumber: '', quantity: 0, expiryDate: null, status: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [expiryRange, setExpiryRange] = useState([null, null]);

  useEffect(() => {
    // Fetch initial inventory data from the server
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/inventory'); // Replace with your actual API endpoint
        const data = await response.json();
        setInventory(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
        setLoading(false);
      }
    };

    fetchInventory();

    // WebSocket setup for real-time updates
    // const ws = new WebSocket('ws://your-websocket-url');
    // ws.onmessage = (event) => {
    //   const newItem = JSON.parse(event.data);
    //   setInventory((prevInventory) => [newItem, ...prevInventory]);
    // };

    // return () => ws.close(); // Cleanup on component unmount
  }, []);

  const handleAddItem = () => {
    const newItemObject = { ...newItem, id: inventory.length + 1 };
    setInventory([...inventory, newItemObject]);
    setNewItem({ name: '', batchNumber: '', quantity: 0, expiryDate: null, status: '' });
    setNotificationMessage('Item added successfully');
    setOpenSnackbar(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleSaveItem = () => {
    setInventory((prevInventory) =>
      prevInventory.map((item) => (item.id === selectedItem.id ? selectedItem : item))
    );
    setSelectedItem(null);
    setOpenDialog(false);
    setNotificationMessage('Item updated successfully');
    setOpenSnackbar(true);
  };

  const handleDeleteItem = (itemId) => {
    setInventory(inventory.filter((item) => item.id !== itemId));
    setNotificationMessage('Item deleted successfully');
    setOpenSnackbar(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Name', 'Batch Number', 'Quantity', 'Expiry Date', 'Status'],
      ...inventory.map((item) => [
        item.id,
        item.name,
        item.batchNumber,
        item.quantity,
        item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '',
        item.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'inventory.csv');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const handleExpiryRangeChange = (index, date) => {
    setExpiryRange((prevRange) => {
      const newRange = [...prevRange];
      newRange[index] = date;
      return newRange;
    });
  };

  const filteredInventory = inventory.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(filterName.toLowerCase());
    const statusMatch = item.status.toLowerCase().includes(filterStatus.toLowerCase());
    const batchMatch = item.batchNumber.toLowerCase().includes(filterBatch.toLowerCase());
    const expiryMatch =
      (!expiryRange[0] || new Date(item.expiryDate) >= expiryRange[0]) &&
      (!expiryRange[1] || new Date(item.expiryDate) <= expiryRange[1]);

    return nameMatch && statusMatch && batchMatch && expiryMatch;
  });

  // Data for the Pie chart (stock distribution)
  const stockDistribution = {
    labels: ['In Stock', 'Low Stock', 'Expired'],
    datasets: [
      {
        label: 'Stock Distribution',
        data: [
          filteredInventory.filter((item) => item.status === 'In Stock').length,
          filteredInventory.filter((item) => item.status === 'Low Stock').length,
          filteredInventory.filter((item) => item.status === 'Expired').length,
        ],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderColor: ['#388e3c', '#f57c00', '#d32f2f'],
        borderWidth: 1,
      },
    ],
  };

  // Data for the Bar chart (expiry status)
  const expiryStatus = {
    labels: ['Expiry Status'],
    datasets: [
      {
        label: 'Expiring Soon',
        data: [filteredInventory.filter((item) => new Date(item.expiryDate) < new Date()).length],
        backgroundColor: '#f44336',
        borderColor: '#d32f2f',
        borderWidth: 1,
      },
      {
        label: 'Safe Expiry',
        data: [filteredInventory.filter((item) => new Date(item.expiryDate) >= new Date()).length],
        backgroundColor: '#4caf50',
        borderColor: '#388e3c',
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
          Manage Inventory
        </Typography>
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={handleDarkModeToggle} />}
          label="Dark Mode"
        />
      </Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Item Name"
            variant="outlined"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Batch Number"
            variant="outlined"
            value={newItem.batchNumber}
            onChange={(e) => setNewItem({ ...newItem, batchNumber: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Quantity"
            variant="outlined"
            type="number"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Expiry Date"
              value={newItem.expiryDate}
              onChange={(date) => setNewItem({ ...newItem, expiryDate: date })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={newItem.status}
              onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            fullWidth
          >
            Add Item
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title="Export as CSV">
            <Button
              variant="contained"
              color="primary"
              startIcon={<ExportIcon />}
              onClick={handleExport}
              fullWidth
            >
              Export
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={3} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Filter by Name"
            variant="outlined"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Filter by Batch"
            variant="outlined"
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="From Expiry Date"
              value={expiryRange[0]}
              onChange={(date) => handleExpiryRangeChange(0, date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="To Expiry Date"
              value={expiryRange[1]}
              onChange={(date) => handleExpiryRangeChange(1, date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h2">
            Stock Distribution
          </Typography>
          <Pie data={stockDistribution} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h2">
            Expiry Status
          </Typography>
          <Bar data={expiryStatus} />
        </Grid>
      </Grid>

      <List>
        {filteredInventory.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem>
              <Badge
                badgeContent={<LowStockIcon color="error" />}
                invisible={item.status !== 'Low Stock'}
              >
                <ListItemText
                  primary={`${item.name} (Batch: ${item.batchNumber})`}
                  secondary={`Quantity: ${item.quantity} | Expiry: ${
                    item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'
                  } | Status: ${item.status}`}
                />
              </Badge>
              <IconButton onClick={() => handleEditItem(item)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteItem(item.id)} color="secondary">
                <DeleteIcon />
              </IconButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {/* Edit Item Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Inventory Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Item Name"
            variant="outlined"
            value={selectedItem?.name || ''}
            onChange={(e) =>
              setSelectedItem((prev) => ({ ...prev, name: e.target.value }))
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Batch Number"
            variant="outlined"
            value={selectedItem?.batchNumber || ''}
            onChange={(e) =>
              setSelectedItem((prev) => ({ ...prev, batchNumber: e.target.value }))
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Quantity"
            variant="outlined"
            type="number"
            value={selectedItem?.quantity || 0}
            onChange={(e) =>
              setSelectedItem((prev) => ({ ...prev, quantity: Number(e.target.value) }))
            }
            fullWidth
            margin="dense"
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Expiry Date"
              value={selectedItem?.expiryDate || null}
              onChange={(date) =>
                setSelectedItem((prev) => ({ ...prev, expiryDate: date }))
              }
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
          </LocalizationProvider>
          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedItem?.status || ''}
              onChange={(e) =>
                setSelectedItem((prev) => ({ ...prev, status: e.target.value }))
              }
              label="Status"
            >
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveItem} color="primary">
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

export default ManageInventory;

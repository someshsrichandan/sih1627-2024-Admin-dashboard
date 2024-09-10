// WarehouseManagement.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Box,
  Button,
  Pagination,
  Tooltip,
  Modal,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import ExportIcon from '@mui/icons-material/GetApp';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { saveAs } from 'file-saver';
import MuiAlert from '@mui/material/Alert';

const WarehouseManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [batchStatusFilter, setBatchStatusFilter] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('');
  const [sortField, setSortField] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const itemsPerPage = 6;

  useEffect(() => {
    // Fetch inventory data from your API or database
    const fetchInventory = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/warehouse-inventory');
        const data = await response.json();
        setInventory(data);
        setFilteredInventory(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterInventory(value, batchStatusFilter, manufacturerFilter, startDate, endDate);
  };

  const handleBatchStatusFilterChange = (event) => {
    const value = event.target.value;
    setBatchStatusFilter(value);
    filterInventory(searchTerm, value, manufacturerFilter, startDate, endDate);
  };

  const handleManufacturerFilterChange = (event) => {
    const value = event.target.value;
    setManufacturerFilter(value);
    filterInventory(searchTerm, batchStatusFilter, value, startDate, endDate);
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortField(value);
    const sorted = [...filteredInventory].sort((a, b) => a[value]?.localeCompare(b[value]));
    setFilteredInventory(sorted);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    filterInventory(searchTerm, batchStatusFilter, manufacturerFilter, date, endDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    filterInventory(searchTerm, batchStatusFilter, manufacturerFilter, startDate, date);
  };

  const filterInventory = (search, status, manufacturer, start, end) => {
    let filtered = inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.batchNumber.toLowerCase().includes(search)
    );

    if (status) {
      filtered = filtered.filter((item) => item.batchStatus === status);
    }

    if (manufacturer) {
      filtered = filtered.filter((item) => item.manufacturer.includes(manufacturer));
    }

    if (start && end) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.expiryDate) >= start &&
          new Date(item.expiryDate) <= end
      );
    }

    setFilteredInventory(filtered);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleAddStock = (batchNumber) => {
    // Logic to add stock (implement your backend API call here)
    console.log(`Adding stock for batch: ${batchNumber}`);
    setNotificationMessage(`Stock added for batch: ${batchNumber}`);
    setSnackbarOpen(true);
  };

  const handleRemoveStock = (batchNumber) => {
    // Logic to remove stock (implement your backend API call here)
    console.log(`Removing stock for batch: ${batchNumber}`);
    setNotificationMessage(`Stock removed for batch: ${batchNumber}`);
    setSnackbarOpen(true);
  };

  const handleEditStock = (batchNumber) => {
    // Logic to edit stock (implement your backend API call here)
    console.log(`Editing stock for batch: ${batchNumber}`);
    setNotificationMessage(`Stock edited for batch: ${batchNumber}`);
    setSnackbarOpen(true);
  };

  const handleExport = () => {
    const csvData = filteredInventory.map((item) => ({
      BatchNumber: item.batchNumber,
      Name: item.name,
      Manufacturer: item.manufacturer,
      ExpiryDate: item.expiryDate,
      Stock: item.stock,
      BatchStatus: item.batchStatus,
    }));

    const csvContent = [
      ['Batch Number', 'Name', 'Manufacturer', 'Expiry Date', 'Stock', 'Batch Status'],
      ...csvData.map((item) => Object.values(item)),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'inventory.csv');
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
      <Typography variant="h4" component="h1" gutterBottom>
        Warehouse Management
      </Typography>
      <Grid container spacing={2} alignItems="center" mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search by Name or Batch"
            variant="outlined"
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
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Batch Status</InputLabel>
            <Select
              value={batchStatusFilter}
              onChange={handleBatchStatusFilterChange}
              label="Batch Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Manufacturer</InputLabel>
            <Select
              value={manufacturerFilter}
              onChange={handleManufacturerFilterChange}
              label="Manufacturer"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Sun Pharma">Sun Pharma</MenuItem>
              <MenuItem value="Cipla">Cipla</MenuItem>
              <MenuItem value="Ranbaxy">Ranbaxy</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortField}
              onChange={handleSortChange}
              label="Sort By"
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="expiryDate">Expiry Date</MenuItem>
              <MenuItem value="stock">Stock</MenuItem>
            </Select>
          </FormControl>
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
      <Grid container spacing={2}>
        {paginatedInventory.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.batchNumber}>
            <Card onClick={() => handleItemClick(item)} style={{ cursor: 'pointer' }}>
              <CardContent>
                <Typography variant="h6">Batch: {item.batchNumber}</Typography>
                <Typography>Name: {item.name}</Typography>
                <Typography>Manufacturer: {item.manufacturer}</Typography>
                <Typography>Expiry Date: {item.expiryDate}</Typography>
                <Typography>Stock: {item.stock}</Typography>
                <Typography>Status: {item.batchStatus}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleAddStock(item.batchNumber)}
                  startIcon={<AddIcon />}
                >
                  Add Stock
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleRemoveStock(item.batchNumber)}
                  startIcon={<RemoveIcon />}
                >
                  Remove Stock
                </Button>
                <Button
                  size="small"
                  color="default"
                  onClick={() => handleEditStock(item.batchNumber)}
                  startIcon={<EditIcon />}
                >
                  Edit Stock
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(filteredInventory.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Detailed Item Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', marginTop: '10%', maxWidth: 500, borderRadius: 2 }}>
          {selectedItem && (
            <>
              <Typography variant="h5" gutterBottom>
                Details for Batch {selectedItem.batchNumber}
              </Typography>
              <Typography>Name: {selectedItem.name}</Typography>
              <Typography>Manufacturer: {selectedItem.manufacturer}</Typography>
              <Typography>Expiry Date: {selectedItem.expiryDate}</Typography>
              <Typography>Stock: {selectedItem.stock}</Typography>
              <Typography>Status: {selectedItem.batchStatus}</Typography>
              {/* Add more details if necessary */}
            </>
          )}
        </Box>
      </Modal>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {notificationMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default WarehouseManagement;

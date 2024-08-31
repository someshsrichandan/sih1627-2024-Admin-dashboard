// TrackShipments.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Box,
  Pagination,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExportIcon from '@mui/icons-material/GetApp';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { saveAs } from 'file-saver';

const TrackShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [originFilter, setOriginFilter] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        // Replace this URL with your actual API endpoint
        const response = await fetch('/api/shipments');
        const data = await response.json();
        setShipments(data);
        setFilteredShipments(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch shipments:', error);
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterShipments(value, statusFilter, originFilter, destinationFilter, startDate, endDate);
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortField(value);
    const sorted = [...filteredShipments].sort((a, b) => a[value].localeCompare(b[value]));
    setFilteredShipments(sorted);
  };

  const handleStatusFilterChange = (event) => {
    const value = event.target.value;
    setStatusFilter(value);
    filterShipments(searchTerm, value, originFilter, destinationFilter, startDate, endDate);
  };

  const handleOriginFilterChange = (event) => {
    const value = event.target.value;
    setOriginFilter(value);
    filterShipments(searchTerm, statusFilter, value, destinationFilter, startDate, endDate);
  };

  const handleDestinationFilterChange = (event) => {
    const value = event.target.value;
    setDestinationFilter(value);
    filterShipments(searchTerm, statusFilter, originFilter, value, startDate, endDate);
  };

  const filterShipments = (search, status, origin, destination, start, end) => {
    let filtered = shipments.filter(
      (shipment) =>
        shipment.id.toLowerCase().includes(search) ||
        shipment.status.toLowerCase().includes(search)
    );

    if (status) {
      filtered = filtered.filter((shipment) => shipment.status === status);
    }

    if (origin) {
      filtered = filtered.filter((shipment) => shipment.origin.includes(origin));
    }

    if (destination) {
      filtered = filtered.filter((shipment) => shipment.destination.includes(destination));
    }

    if (start && end) {
      filtered = filtered.filter(
        (shipment) =>
          new Date(shipment.expectedDelivery) >= start &&
          new Date(shipment.expectedDelivery) <= end
      );
    }

    setFilteredShipments(filtered);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    filterShipments(searchTerm, statusFilter, originFilter, destinationFilter, date, endDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    filterShipments(searchTerm, statusFilter, originFilter, destinationFilter, startDate, date);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDrawerOpen = (shipment) => {
    setSelectedShipment(shipment);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedShipment(null);
  };

  const handleExport = () => {
    const csvData = filteredShipments.map((shipment) => ({
      id: shipment.id,
      status: shipment.status,
      origin: shipment.origin,
      destination: shipment.destination,
      expectedDelivery: shipment.expectedDelivery,
    }));

    const csvContent = [
      ['Shipment ID', 'Status', 'Origin', 'Destination', 'Expected Delivery'],
      ...csvData.map((item) => Object.values(item)),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'shipments.csv');
  };

  const paginatedShipments = filteredShipments.slice(
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
        Track Shipments
      </Typography>
      <Grid container spacing={2} alignItems="center" mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search Shipments"
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
              <MenuItem value="id">Shipment ID</MenuItem>
              <MenuItem value="status">Status</MenuItem>
              <MenuItem value="origin">Origin</MenuItem>
              <MenuItem value="destination">Destination</MenuItem>
              <MenuItem value="expectedDelivery">Expected Delivery</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status"
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="In Transit">In Transit</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Delayed">Delayed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Origin</InputLabel>
            <Select
              value={originFilter}
              onChange={handleOriginFilterChange}
              label="Origin"
            >
              {/* Replace with dynamic origin options */}
              <MenuItem value="">All</MenuItem>
              <MenuItem value="New York">New York</MenuItem>
              <MenuItem value="Los Angeles">Los Angeles</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Destination</InputLabel>
            <Select
              value={destinationFilter}
              onChange={handleDestinationFilterChange}
              label="Destination"
            >
              {/* Replace with dynamic destination options */}
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Chicago">Chicago</MenuItem>
              <MenuItem value="Houston">Houston</MenuItem>
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
        {paginatedShipments.map((shipment) => (
          <Grid item xs={12} sm={6} md={4} key={shipment.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Shipment ID: {shipment.id}</Typography>
                <Typography color="text.secondary">Status: {shipment.status}</Typography>
                <Typography color="text.secondary">Origin: {shipment.origin}</Typography>
                <Typography color="text.secondary">
                  Destination: {shipment.destination}
                </Typography>
                <Typography color="text.secondary">
                  Expected Delivery: {shipment.expectedDelivery}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleDrawerOpen(shipment)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(filteredShipments.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Shipment Details Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        {selectedShipment && (
          <Box width={350} role="presentation" p={2}>
            <Typography variant="h6">Shipment Details</Typography>
            <Divider />
            <List>
              <ListItem>
                <ListItemText
                  primary="Shipment ID"
                  secondary={selectedShipment.id}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Status"
                  secondary={selectedShipment.status}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Origin"
                  secondary={selectedShipment.origin}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Destination"
                  secondary={selectedShipment.destination}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Expected Delivery"
                  secondary={selectedShipment.expectedDelivery}
                />
              </ListItem>
              {/* Add more details as needed */}
            </List>
          </Box>
        )}
      </Drawer>
    </Container>
  );
};

export default TrackShipments;

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  IconButton,
  Snackbar,
  CircularProgress,
  Tooltip,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  Badge,
  LinearProgress, // Import LinearProgress
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ExportIcon from '@mui/icons-material/GetApp';
import MuiAlert from '@mui/material/Alert';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Pie, Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const SupplyChainOverview = () => {
  const [overviewData, setOverviewData] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState([null, null]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Fetch initial overview data from the server
    const fetchOverviewData = async () => {
      try {
        const response = await fetch('/api/supply-chain-overview'); // Replace with your actual API endpoint
        const data = await response.json();
        setOverviewData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch overview data:', error);
        setLoading(false);
      }
    };

    fetchOverviewData();

    // WebSocket setup for real-time updates
    // const ws = new WebSocket('ws://your-websocket-url');
    // ws.onmessage = (event) => {
    //   const updatedData = JSON.parse(event.data);
    //   setOverviewData(updatedData);
    // };

    // return () => ws.close(); // Cleanup on component unmount
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setNotificationMessage('Refreshing data...');
    setOpenSnackbar(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
      setNotificationMessage('Data refreshed successfully');
      setOpenSnackbar(true);
    }, 2000);
  };

  const handleDateRangeChange = (index, date) => {
    setFilterDate((prevRange) => {
      const newRange = [...prevRange];
      newRange[index] = date;
      return newRange;
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const handleExport = () => {
    // Export data logic (e.g., as PDF or Excel)
    setNotificationMessage('Export functionality is under development');
    setOpenSnackbar(true);
  };

  const handleMetricClick = (metric) => {
    setSelectedMetric(metric);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedMetric(null);
  };

  // Sample data for charts
  const totalOrders = overviewData.totalOrders || 0;
  const activeShipments = overviewData.activeShipments || 0;
  const lowStockItems = overviewData.lowStockItems || 0;
  const supplierPerformance = overviewData.supplierPerformance || { good: 0, average: 0, poor: 0 };

  const supplierPerformanceData = {
    labels: ['Good', 'Average', 'Poor'],
    datasets: [
      {
        label: 'Supplier Performance',
        data: [supplierPerformance.good, supplierPerformance.average, supplierPerformance.poor],
        backgroundColor: ['#4caf50', '#ffeb3b', '#f44336'],
        borderColor: ['#388e3c', '#fbc02d', '#d32f2f'],
        borderWidth: 1,
      },
    ],
  };

  const ordersOverTime = {
    labels: overviewData.ordersOverTime?.dates || [],
    datasets: [
      {
        label: 'Orders Over Time',
        data: overviewData.ordersOverTime?.counts || [],
        fill: false,
        backgroundColor: '#1976d2',
        borderColor: '#1976d2',
      },
    ],
  };

  const stockLevelsData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        label: 'Stock Levels',
        data: [overviewData.stockLevels?.inStock || 0, overviewData.stockLevels?.lowStock || 0, overviewData.stockLevels?.outOfStock || 0],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderColor: ['#388e3c', '#f57c00', '#d32f2f'],
        borderWidth: 1,
      },
    ],
  };

  // Map configuration
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: 20.5937, // Example coordinates for India
    lng: 78.9629,
  };

  const locations = overviewData.locations || [
    { lat: 28.7041, lng: 77.1025, name: 'New Delhi' },
    { lat: 19.076, lng: 72.8777, name: 'Mumbai' },
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
          Supply Chain Overview
        </Typography>
        <Box>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={handleDarkModeToggle} />}
            label="Dark Mode"
          />
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleMetricClick('Total Orders')} sx={{ cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{totalOrders}</Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((totalOrders / 100) * 100, 100)}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleMetricClick('Active Shipments')} sx={{ cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h6">Active Shipments</Typography>
              <Typography variant="h4">{activeShipments}</Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((activeShipments / 50) * 100, 100)}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleMetricClick('Low Stock Items')} sx={{ cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h6">Low Stock Items</Typography>
              <Typography variant="h4">{lowStockItems}</Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((lowStockItems / 20) * 100, 100)}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleMetricClick('Supplier Performance')} sx={{ cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h6">Supplier Performance</Typography>
              <Pie data={supplierPerformanceData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h2">
            Orders Over Time
          </Typography>
          <Line data={ordersOverTime} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h2">
            Stock Levels
          </Typography>
          <Bar data={stockLevelsData} />
        </Grid>
      </Grid>

      <Box mt={3}>
        <Typography variant="h6" component="h2">
          Supply Chain Map
        </Typography>
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"> {/* Replace with your Google Maps API key */}
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={5}>
            {locations.map((location, index) => (
              <Marker key={index} position={{ lat: location.lat, lng: location.lng }} label={location.name} />
            ))}
          </GoogleMap>
        </LoadScript>
      </Box>

      <Grid container spacing={2} mt={3} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="From Date"
              value={filterDate[0]}
              onChange={(date) => handleDateRangeChange(0, date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="To Date"
              value={filterDate[1]}
              onChange={(date) => handleDateRangeChange(1, date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title="Filter Data">
            <Button
              variant="contained"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={() => {
                setNotificationMessage('Filter applied');
                setOpenSnackbar(true);
              }}
              fullWidth
            >
              Apply Filter
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title="Export Data">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ExportIcon />}
              onClick={handleExport}
              fullWidth
            >
              Export
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      {/* Drill-Down Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedMetric} Details</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Detailed information and analysis of {selectedMetric} will be displayed here.
          </Typography>
          {/* Placeholder for more detailed analytics, charts, and data views */}
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
        <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {notificationMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default SupplyChainOverview;

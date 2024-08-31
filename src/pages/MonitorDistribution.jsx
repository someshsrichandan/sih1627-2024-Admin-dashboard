import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  Snackbar,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import ExportIcon from '@mui/icons-material/GetApp';
import { GoogleMap, LoadScript, Marker, Polyline, HeatmapLayer } from '@react-google-maps/api';
import MuiAlert from '@mui/material/Alert';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const MonitorDistribution = () => {
  const [distributionData, setDistributionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchDistributionData = async () => {
      try {
        const response = await fetch('/api/distribution'); // Replace with your actual API endpoint
        const data = await response.json();
        setDistributionData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch distribution data:', error);
        setLoading(false);
      }
    };

    fetchDistributionData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setNotificationMessage('Refreshing data...');
    setOpenSnackbar(true);
    setTimeout(() => {
      setLoading(false);
      setNotificationMessage('Data refreshed successfully');
      setOpenSnackbar(true);
    }, 2000);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const handleExport = () => {
    setNotificationMessage('Exporting data...');
    setOpenSnackbar(true);
    setTimeout(() => {
      setNotificationMessage('Data exported successfully');
      setOpenSnackbar(true);
    }, 1000);
  };

  // Sample data for charts
  const deliveryPerformanceData = {
    labels: distributionData.map((item) => item.date) || [],
    datasets: [
      {
        label: 'On-Time Deliveries',
        data: distributionData.map((item) => item.onTimeDeliveries) || [],
        backgroundColor: '#4caf50',
        borderColor: '#388e3c',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
      {
        label: 'Delayed Deliveries',
        data: distributionData.map((item) => item.delayedDeliveries) || [],
        backgroundColor: '#f44336',
        borderColor: '#d32f2f',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const inventoryLevelsData = {
    labels: distributionData.map((item) => item.location) || [],
    datasets: [
      {
        label: 'Inventory Levels',
        data: distributionData.map((item) => item.inventoryLevel) || [],
        backgroundColor: '#2196f3',
        borderColor: '#1976d2',
        borderWidth: 1,
      },
    ],
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: 20.5937, // Example coordinates for India
    lng: 78.9629,
  };

  const routes = distributionData.map((item) => ({
    path: item.route,
    options: {
      strokeColor: '#ff5722',
      strokeOpacity: 0.8,
      strokeWeight: 2,
    },
  }));

  const heatmapData = distributionData.map((item) => ({
    location: new window.google.maps.LatLng(item.latitude, item.longitude),
    weight: item.inventoryLevel, // Example weight based on inventory level
  }));

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
          Monitor Distribution
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
          <Tooltip title="Export Data">
            <IconButton onClick={handleExport}>
              <ExportIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={handleFilterChange}
              label="Filter by Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="On Time">On Time</MenuItem>
              <MenuItem value="Delayed">Delayed</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title="Apply Filters">
            <Button
              variant="contained"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={() => {
                setNotificationMessage('Filters applied');
                setOpenSnackbar(true);
              }}
              fullWidth
            >
              Apply Filter
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h2">
            Delivery Performance
          </Typography>
          <Line data={deliveryPerformanceData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h2">
            Inventory Levels
          </Typography>
          <Bar data={inventoryLevelsData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Grid>
      </Grid>

      <Box mt={3}>
        <Typography variant="h6" component="h2">
          Distribution Routes
        </Typography>
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY" libraries={["visualization"]}> {/* Include libraries prop */}
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={5}>
            {routes.map((route, index) => (
              <Polyline key={index} path={route.path} options={route.options} />
            ))}
            {distributionData.map((location, index) => (
              <Marker
                key={index}
                position={{ lat: location.latitude, lng: location.longitude }}
                label={location.location}
              />
            ))}
            <HeatmapLayer data={heatmapData} options={{ radius: 20 }} />
          </GoogleMap>
        </LoadScript>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" component="h2">
          Distribution Details
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Inventory Level</TableCell>
                <TableCell>On-Time Deliveries</TableCell>
                <TableCell>Delayed Deliveries</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {distributionData
                .filter((item) => (filterStatus ? item.status === filterStatus : true))
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={
                          row.status === 'On Time'
                            ? 'success'
                            : row.status === 'Delayed'
                            ? 'error'
                            : 'warning'
                        }
                        icon={row.status === 'Delayed' && <WarningIcon />}
                      />
                    </TableCell>
                    <TableCell>{row.inventoryLevel}</TableCell>
                    <TableCell>{row.onTimeDeliveries}</TableCell>
                    <TableCell>{row.delayedDeliveries}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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

export default MonitorDistribution;

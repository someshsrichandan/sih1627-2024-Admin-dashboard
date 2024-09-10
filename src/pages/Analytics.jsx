// Analytics.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Snackbar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/GetApp';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import MuiAlert from '@mui/material/Alert';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Fetch initial analytics data from the server
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch('/api/analytics'); // Replace with your actual API endpoint
        const data = await response.json();
        setAnalyticsData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        setLoading(false);
      }
    };

    fetchAnalyticsData();
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

  const handleFilterChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
    setNotificationMessage(`Time range set to ${event.target.value}`);
    setOpenSnackbar(true);
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

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  // Sample data for charts
  const stockLevelsData = {
    labels: analyticsData.map((item) => item.date) || [],
    datasets: [
      {
        label: 'Stock Levels',
        data: analyticsData.map((item) => item.stockLevel) || [],
        backgroundColor: '#42a5f5',
        borderColor: '#1e88e5',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const distributionEfficiencyData = {
    labels: analyticsData.map((item) => item.region) || [],
    datasets: [
      {
        label: 'Distribution Efficiency',
        data: analyticsData.map((item) => item.efficiency) || [],
        backgroundColor: '#66bb6a',
        borderColor: '#43a047',
        borderWidth: 1,
      },
    ],
  };

  const complianceRatesData = {
    labels: ['Compliant', 'Non-Compliant'],
    datasets: [
      {
        data: [analyticsData.filter((item) => item.compliant).length, analyticsData.filter((item) => !item.compliant).length],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#81c784', '#e57373'],
      },
    ],
  };

  const predictiveData = {
    labels: analyticsData.map((item) => item.date) || [],
    datasets: [
      {
        label: 'Predicted Stock Levels',
        data: analyticsData.map((item) => item.predictedStockLevel) || [],
        borderColor: '#ffa726',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const performanceData = {
    labels: analyticsData.map((item) => item.product) || [],
    datasets: [
      {
        label: 'Product Performance',
        data: analyticsData.map((item) => item.performance) || [],
        backgroundColor: '#ff9800',
        borderColor: '#fb8c00',
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
          Analytics
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
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={filterCategory}
              onChange={handleFilterChange}
              label="Filter by Category"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Stock Levels">Stock Levels</MenuItem>
              <MenuItem value="Distribution Efficiency">Distribution Efficiency</MenuItem>
              <MenuItem value="Compliance Rates">Compliance Rates</MenuItem>
              <MenuItem value="Product Performance">Product Performance</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="Time Range"
            >
              <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
              <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
              <MenuItem value="Last 90 Days">Last 90 Days</MenuItem>
              <MenuItem value="Custom Range">Custom Range</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={3}>
        {(filterCategory === 'Stock Levels' || filterCategory === '') && (
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2">
              Stock Levels Over Time
            </Typography>
            <Line data={stockLevelsData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Grid>
        )}

        {(filterCategory === 'Distribution Efficiency' || filterCategory === '') && (
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2">
              Distribution Efficiency by Region
            </Typography>
            <Bar data={distributionEfficiencyData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Grid>
        )}

        {(filterCategory === 'Compliance Rates' || filterCategory === '') && (
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2">
              Compliance Rates
            </Typography>
            <Doughnut data={complianceRatesData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Grid>
        )}

        {(filterCategory === 'Product Performance' || filterCategory === '') && (
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2">
              Product Performance
            </Typography>
            <Pie data={performanceData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Grid>
        )}

        {filterCategory === '' && (
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2">
              Predictive Analytics
            </Typography>
            <Line data={predictiveData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Grid>
        )}
      </Grid>

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

export default Analytics;

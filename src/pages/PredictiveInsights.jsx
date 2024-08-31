// PredictiveInsights.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Snackbar,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ExportIcon from '@mui/icons-material/GetApp';
import WarningIcon from '@mui/icons-material/Warning';
import MuiAlert from '@mui/material/Alert';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const PredictiveInsights = () => {
  const [insightsData, setInsightsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [forecastRange, setForecastRange] = useState('30 days');
  const [filterType, setFilterType] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);

  useEffect(() => {
    // Fetch initial predictive insights data from the server
    const fetchInsightsData = async () => {
      try {
        const response = await fetch('/api/predictive-insights'); // Replace with your actual API endpoint
        const data = await response.json();
        setInsightsData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch predictive insights:', error);
        setLoading(false);
      }
    };

    fetchInsightsData();
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

  const handleForecastRangeChange = (event) => {
    setForecastRange(event.target.value);
    setNotificationMessage(`Forecast range set to ${event.target.value}`);
    setOpenSnackbar(true);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
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
    // Simulate data export
    setTimeout(() => {
      setNotificationMessage('Data exported successfully');
      setOpenSnackbar(true);
    }, 1000);
  };

  const handleScenarioAnalysis = (scenario) => {
    setSelectedScenario(scenario);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedScenario(null);
  };

  // Sample data for predictive charts
  const demandForecastData = {
    labels: insightsData.dates || [],
    datasets: [
      {
        label: 'Demand Forecast',
        data: insightsData.demand || [],
        fill: false,
        backgroundColor: '#4caf50',
        borderColor: '#4caf50',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const stockPredictionData = {
    labels: insightsData.dates || [],
    datasets: [
      {
        label: 'Stock Levels',
        data: insightsData.stock || [],
        backgroundColor: '#2196f3',
        borderColor: '#1976d2',
        borderWidth: 1,
      },
    ],
  };

  const supplierPerformanceData = {
    labels: insightsData.suppliers || ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D'],
    datasets: [
      {
        label: 'Performance Score',
        data: insightsData.supplierPerformance || [75, 85, 65, 90],
        backgroundColor: ['#ffeb3b', '#8bc34a', '#f44336', '#03a9f4'],
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
          Predictive Insights
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
            <InputLabel>Forecast Range</InputLabel>
            <Select
              value={forecastRange}
              onChange={handleForecastRangeChange}
              label="Forecast Range"
            >
              <MenuItem value="7 days">7 Days</MenuItem>
              <MenuItem value="30 days">30 Days</MenuItem>
              <MenuItem value="90 days">90 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={filterType}
              onChange={handleFilterChange}
              label="Filter by Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Demand">Demand</MenuItem>
              <MenuItem value="Stock">Stock</MenuItem>
              <MenuItem value="Supplier Performance">Supplier Performance</MenuItem>
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
            Demand Forecast
          </Typography>
          <Line data={demandForecastData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h2">
            Stock Level Predictions
          </Typography>
          <Bar data={stockPredictionData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" component="h2">
            Supplier Performance Predictions
          </Typography>
          <Bar data={supplierPerformanceData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Grid>
      </Grid>

      {/* Scenario Analysis Section */}
      <Box mt={4}>
        <Typography variant="h6" component="h2">
          Scenario Analysis
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Scenario 1: Optimistic Demand Growth</Typography>
                <Typography variant="body2">
                  Predicted stock levels and supplier performance under increased demand scenarios.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleScenarioAnalysis('Scenario 1')}
                  sx={{ mt: 2 }}
                >
                  Apply Scenario 1
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Scenario 2: Supply Chain Disruption</Typography>
                <Typography variant="body2">
                  Impact analysis of a hypothetical supply chain disruption affecting key suppliers.
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleScenarioAnalysis('Scenario 2')}
                  sx={{ mt: 2 }}
                >
                  Apply Scenario 2
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Scenario Analysis Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedScenario} Results</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Detailed analysis and impact of {selectedScenario}. This section will show the specific metrics affected and
            the projected outcomes based on the applied scenario.
          </Typography>
          {/* Additional charts and detailed data for scenario analysis */}
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

export default PredictiveInsights;

// LiveDistributionReports.js
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
  CircularProgress,
  Box,
  Button,
  Pagination,
  Tooltip,
  Modal,
  Snackbar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import ExportIcon from '@mui/icons-material/GetApp';
import { saveAs } from 'file-saver';
import MuiAlert from '@mui/material/Alert';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const LiveDistributionReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [darkMode, setDarkMode] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    // Fetch live distribution data from your API or database
    const fetchReports = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/live-distribution-reports');
        const data = await response.json();
        setReports(data);
        setFilteredReports(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        setLoading(false);
      }
    };

    fetchReports();

    // Optional: Implement WebSocket or polling for real-time updates
    // const ws = new WebSocket('ws://your-websocket-url');
    // ws.onmessage = (event) => {
    //   const newReport = JSON.parse(event.data);
    //   setReports((prevReports) => [newReport, ...prevReports]);
    // };

    // Cleanup on component unmount
    // return () => ws.close();

  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterReports(value, regionFilter, statusFilter, startDate, endDate);
  };

  const handleRegionFilterChange = (event) => {
    const value = event.target.value;
    setRegionFilter(value);
    filterReports(searchTerm, value, statusFilter, startDate, endDate);
  };

  const handleStatusFilterChange = (event) => {
    const value = event.target.value;
    setStatusFilter(value);
    filterReports(searchTerm, regionFilter, value, startDate, endDate);
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortField(value);
    const sorted = [...filteredReports].sort((a, b) => a[value]?.localeCompare(b[value]));
    setFilteredReports(sorted);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    filterReports(searchTerm, regionFilter, statusFilter, date, endDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    filterReports(searchTerm, regionFilter, statusFilter, startDate, date);
  };

  const filterReports = (search, region, status, start, end) => {
    let filtered = reports.filter(
      (report) =>
        report.id.toLowerCase().includes(search) ||
        report.status.toLowerCase().includes(search)
    );

    if (region) {
      filtered = filtered.filter((report) => report.region.includes(region));
    }

    if (status) {
      filtered = filtered.filter((report) => report.status === status);
    }

    if (start && end) {
      filtered = filtered.filter(
        (report) =>
          new Date(report.lastUpdated) >= start &&
          new Date(report.lastUpdated) <= end
      );
    }

    setFilteredReports(filtered);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleExport = () => {
    const csvData = filteredReports.map((report) => ({
      ID: report.id,
      Region: report.region,
      Status: report.status,
      TotalDistributed: report.totalDistributed,
      LastUpdated: report.lastUpdated,
    }));

    const csvContent = [
      ['ID', 'Region', 'Status', 'Total Distributed', 'Last Updated'],
      ...csvData.map((item) => Object.values(item)),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'distribution_reports.csv');
  };

  const handleRowClick = (report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReport(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const chartData = {
    labels: filteredReports.map((report) => report.region),
    datasets: [
      {
        label: 'Total Distributed',
        data: filteredReports.map((report) => report.totalDistributed),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} />;
      case 'pie':
        return <Pie data={chartData} />;
      default:
        return <Bar data={chartData} />;
    }
  };

  const containerStyles = {
    backgroundColor: darkMode ? '#121212' : '#fff',
    color: darkMode ? '#fff' : '#000',
    padding: '16px',
    borderRadius: '8px',
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container style={containerStyles}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          Live Distribution Reports
        </Typography>
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={handleDarkModeToggle} />}
          label="Dark Mode"
        />
      </Box>
      <Grid container spacing={2} alignItems="center" mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search by ID or Status"
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
            <InputLabel>Region</InputLabel>
            <Select
              value={regionFilter}
              onChange={handleRegionFilterChange}
              label="Region"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="North">North</MenuItem>
              <MenuItem value="South">South</MenuItem>
              <MenuItem value="East">East</MenuItem>
              <MenuItem value="West">West</MenuItem>
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
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="In Transit">In Transit</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
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
              <MenuItem value="id">ID</MenuItem>
              <MenuItem value="totalDistributed">Total Distributed</MenuItem>
              <MenuItem value="lastUpdated">Last Updated</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Chart Type</InputLabel>
            <Select
              value={chartType}
              onChange={handleChartTypeChange}
              label="Chart Type"
            >
              <MenuItem value="bar">Bar</MenuItem>
              <MenuItem value="line">Line</MenuItem>
              <MenuItem value="pie">Pie</MenuItem>
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
        <Grid item xs={12}>
          <Card style={{ backgroundColor: darkMode ? '#333' : '#fff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribution Overview
              </Typography>
              {renderChart()}
            </CardContent>
          </Card>
        </Grid>
        {paginatedReports.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Card
              onClick={() => handleRowClick(report)}
              style={{ cursor: 'pointer', backgroundColor: darkMode ? '#333' : '#fff' }}
            >
              <CardContent>
                <Typography variant="h6">ID: {report.id}</Typography>
                <Typography>Region: {report.region}</Typography>
                <Typography>Status: {report.status}</Typography>
                <Typography>Total Distributed: {report.totalDistributed}</Typography>
                <Typography>Last Updated: {report.lastUpdated}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(filteredReports.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Detailed Report Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', marginTop: '10%', maxWidth: 500, borderRadius: 2 }}>
          {selectedReport && (
            <>
              <Typography variant="h5" gutterBottom>
                Details for Report ID {selectedReport.id}
              </Typography>
              <Typography>Region: {selectedReport.region}</Typography>
              <Typography>Status: {selectedReport.status}</Typography>
              <Typography>Total Distributed: {selectedReport.totalDistributed}</Typography>
              <Typography>Last Updated: {selectedReport.lastUpdated}</Typography>
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

export default LiveDistributionReports;

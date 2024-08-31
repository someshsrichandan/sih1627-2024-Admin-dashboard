// Reports.js
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
  TablePagination,
  Checkbox,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/GetApp';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import MuiAlert from '@mui/material/Alert';

const Reports = () => {
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedReports, setSelectedReports] = useState([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  useEffect(() => {
    // Fetch initial reports data from the server
    const fetchReportsData = async () => {
      try {
        const response = await fetch('/api/reports'); // Replace with your actual API endpoint
        const data = await response.json();
        setReportsData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch reports data:', error);
        setLoading(false);
      }
    };

    fetchReportsData();
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
    setReportType(event.target.value);
  };

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
    setNotificationMessage(`Date range set to ${event.target.value}`);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleExport = () => {
    setNotificationMessage('Exporting report...');
    setOpenSnackbar(true);
    // Simulate export functionality
    setTimeout(() => {
      setNotificationMessage('Report exported successfully');
      setOpenSnackbar(true);
    }, 1000);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggleAdvancedOptions = () => {
    setShowAdvancedOptions((prev) => !prev);
  };

  const handleScheduleReport = () => {
    setNotificationMessage('Scheduling report...');
    setOpenSnackbar(true);
    // Simulate scheduling functionality
    setTimeout(() => {
      setNotificationMessage('Report scheduled successfully');
      setOpenSnackbar(true);
    }, 1000);
  };

  const handleSelectReport = (event, reportId) => {
    const selectedIndex = selectedReports.indexOf(reportId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedReports, reportId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedReports.slice(1));
    } else if (selectedIndex === selectedReports.length - 1) {
      newSelected = newSelected.concat(selectedReports.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedReports.slice(0, selectedIndex),
        selectedReports.slice(selectedIndex + 1)
      );
    }

    setSelectedReports(newSelected);
  };

  const isSelected = (id) => selectedReports.indexOf(id) !== -1;

  const inventoryData = {
    labels: reportsData.map((item) => item.date) || [],
    datasets: [
      {
        label: 'Stock Levels',
        data: reportsData.map((item) => item.stockLevel) || [],
        backgroundColor: '#2196f3',
        borderColor: '#1976d2',
        borderWidth: 1,
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const performanceData = {
    labels: reportsData.map((item) => item.category) || [],
    datasets: [
      {
        label: 'Performance',
        data: reportsData.map((item) => item.performance) || [],
        backgroundColor: ['#ff9800', '#8bc34a', '#f44336', '#03a9f4'],
        borderColor: ['#fb8c00', '#689f38', '#d32f2f', '#0288d1'],
        borderWidth: 1,
      },
    ],
  };

  const complianceData = {
    labels: ['Compliant', 'Non-Compliant'],
    datasets: [
      {
        data: [reportsData.filter((item) => item.compliant).length, reportsData.filter((item) => !item.compliant).length],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#66bb6a', '#e57373'],
      },
    ],
  };

  const handleExportSelected = () => {
    setNotificationMessage('Exporting selected reports...');
    setOpenSnackbar(true);
    // Simulate export functionality
    setTimeout(() => {
      setNotificationMessage('Selected reports exported successfully');
      setOpenSnackbar(true);
    }, 1000);
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
          Reports
        </Typography>
        <Box>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export Report">
            <IconButton onClick={handleExport}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Schedule Report">
            <IconButton onClick={handleScheduleReport}>
              <ScheduleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              onChange={handleFilterChange}
              label="Report Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Inventory">Inventory</MenuItem>
              <MenuItem value="Performance">Performance</MenuItem>
              <MenuItem value="Compliance">Compliance</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              onChange={handleDateRangeChange}
              label="Date Range"
            >
              <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
              <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
              <MenuItem value="Last 90 Days">Last 90 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FilterListIcon />}
            onClick={handleToggleAdvancedOptions}
            fullWidth
          >
            {showAdvancedOptions ? 'Hide Filters' : 'Advanced Filters'}
          </Button>
        </Grid>
      </Grid>

      {showAdvancedOptions && (
        <Box mt={3}>
          {/* Add additional filter options here, such as location, specific metrics, etc. */}
          <Typography variant="subtitle1">Additional Filters Coming Soon!</Typography>
        </Box>
      )}

      <Grid container spacing={3} mt={3}>
        {reportType === 'Inventory' || reportType === '' ? (
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2">
              Inventory Levels
            </Typography>
            <Line data={inventoryData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Grid>
        ) : null}

        {reportType === 'Performance' || reportType === '' ? (
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2">
              Performance Analysis
            </Typography>
            <Bar data={performanceData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Grid>
        ) : null}

        {reportType === 'Compliance' || reportType === '' ? (
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2">
              Compliance Overview
            </Typography>
            <Pie data={complianceData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Grid>
        ) : null}
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" component="h2">
          Detailed Reports
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedReports.length > 0 && selectedReports.length < reportsData.length}
                    checked={reportsData.length > 0 && selectedReports.length === reportsData.length}
                    onChange={(event) => setSelectedReports(event.target.checked ? reportsData.map((n) => n.id) : [])}
                  />
                </TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Stock Level</TableCell>
                <TableCell>Performance</TableCell>
                <TableCell>Compliance Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={(event) => handleSelectReport(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} />
                    </TableCell>
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.stockLevel}</TableCell>
                    <TableCell>{row.performance}</TableCell>
                    <TableCell>{row.compliant ? 'Compliant' : 'Non-Compliant'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={reportsData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {selectedReports.length > 0 && (
          <Box mt={2}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DownloadIcon />}
              onClick={handleExportSelected}
            >
              Export Selected
            </Button>
          </Box>
        )}
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

export default Reports;

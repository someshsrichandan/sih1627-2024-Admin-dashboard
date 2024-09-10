// OrderHistory.js
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
  LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExportIcon from '@mui/icons-material/GetApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import MuiAlert from '@mui/material/Alert';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InputAdornment from '@mui/material/InputAdornment';

import { saveAs } from 'file-saver';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState([null, null]);
  const [filterSearch, setFilterSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Fetch initial order history data from the server
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders'); // Replace with your actual API endpoint
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();

    // WebSocket setup for real-time updates
    // const ws = new WebSocket('ws://your-websocket-url');
    // ws.onmessage = (event) => {
    //   const newOrder = JSON.parse(event.data);
    //   setOrders((prevOrders) => [newOrder, ...prevOrders]);
    // };

    // return () => ws.close(); // Cleanup on component unmount
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Order ID', 'Date', 'Items', 'Quantity', 'Status', 'Total Amount'],
      ...orders.map((order) => [
        order.id,
        new Date(order.date).toLocaleDateString(),
        order.items.join(', '),
        order.quantity,
        order.status,
        order.totalAmount,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'order_history.csv');
    setNotificationMessage('Order history exported successfully');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const handleDateRangeChange = (index, date) => {
    setFilterDate((prevRange) => {
      const newRange = [...prevRange];
      newRange[index] = date;
      return newRange;
    });
  };

  const filteredOrders = orders.filter((order) => {
    const statusMatch = filterStatus ? order.status === filterStatus : true;
    const dateMatch =
      (!filterDate[0] || new Date(order.date) >= filterDate[0]) &&
      (!filterDate[1] || new Date(order.date) <= filterDate[1]);
    const searchMatch =
      order.id.toLowerCase().includes(filterSearch.toLowerCase()) ||
      order.items.some((item) => item.toLowerCase().includes(filterSearch.toLowerCase()));

    return statusMatch && dateMatch && searchMatch;
  });

  // Data for the Pie chart (order status distribution)
  const orderStatusDistribution = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        label: 'Order Status Distribution',
        data: [
          filteredOrders.filter((order) => order.status === 'Completed').length,
          filteredOrders.filter((order) => order.status === 'Pending').length,
          filteredOrders.filter((order) => order.status === 'Cancelled').length,
        ],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderColor: ['#388e3c', '#f57c00', '#d32f2f'],
        borderWidth: 1,
      },
    ],
  };

  // Data for the Line chart (orders over time)
  const ordersOverTime = {
    labels: filteredOrders.map((order) => new Date(order.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Orders Over Time',
        data: filteredOrders.map((order) => order.totalAmount),
        fill: false,
        backgroundColor: '#1976d2',
        borderColor: '#1976d2',
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
          Order History
        </Typography>
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={handleDarkModeToggle} />}
          label="Dark Mode"
        />
      </Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
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
          <TextField
            label="Search Orders"
            variant="outlined"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
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

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h2">
            Order Status Distribution
          </Typography>
          <Pie data={orderStatusDistribution} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h2">
            Orders Over Time
          </Typography>
          <Line data={ordersOverTime} />
        </Grid>
      </Grid>

      <List>
        {filteredOrders.map((order) => (
          <React.Fragment key={order.id}>
            <ListItem>
              <Badge
                badgeContent={
                  order.status === 'Pending' ? <FilterListIcon color="warning" /> : null
                }
                invisible={order.status !== 'Pending'}
              >
                <ListItemText
                  primary={`Order ID: ${order.id}`}
                  secondary={`Date: ${new Date(order.date).toLocaleDateString()} | Status: ${order.status} | Total: ₹${order.totalAmount}`}
                />
              </Badge>
              <LinearProgress
                variant="determinate"
                value={
                  order.status === 'Completed' ? 100 : order.status === 'Pending' ? 50 : 0
                }
                sx={{ width: 100, marginRight: 2 }}
              />
              <IconButton onClick={() => handleViewOrder(order)} color="primary">
                <VisibilityIcon />
              </IconButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="h6">Order ID: {selectedOrder.id}</Typography>
              <Typography>Date: {new Date(selectedOrder.date).toLocaleDateString()}</Typography>
              <Typography>Status: {selectedOrder.status}</Typography>
              <Typography>Total Amount: ₹{selectedOrder.totalAmount}</Typography>
              <Typography variant="h6" mt={2}>Items:</Typography>
              <List>
                {selectedOrder.items.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
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

export default OrderHistory;

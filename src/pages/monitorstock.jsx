import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Grid, Box, TextField, Select, MenuItem,
    InputLabel, FormControl, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TableSortLabel, IconButton, CircularProgress,
    Snackbar, Divider, Chip, Button, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, DatePicker, AdapterDateFns, LocalizationProvider, Pagination, 
    TablePagination, SnackbarProvider, Alert as MuiAlert
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip } from 'chart.js';
import { useSnackbar } from 'notistack';
import { DateRangePicker } from '@mui/x-date-pickers-pro';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip);

const MonitorStock = () => {
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [sortedData, setSortedData] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        // Simulate fetching stock data
        const fetchData = () => {
            setTimeout(() => {
                setStockData([
                    { id: 1, name: 'Aspirin', category: 'Painkiller', quantity: 120, threshold: 50, date: '2024-08-15' },
                    { id: 2, name: 'Paracetamol', category: 'Painkiller', quantity: 60, threshold: 30, date: '2024-08-20' },
                    { id: 3, name: 'Amoxicillin', category: 'Antibiotic', quantity: 20, threshold: 25, date: '2024-08-10' },
                    // Add more sample data here
                ]);
                setLoading(false);
            }, 1000);
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Apply filters and search
        const filtered = stockData.filter(item => {
            const itemDate = new Date(item.date);
            return (filterCategory === 'all' || item.category === filterCategory) &&
                   (item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                   (dateRange[0] === null || itemDate >= dateRange[0]) &&
                   (dateRange[1] === null || itemDate <= dateRange[1]);
        });

        setSortedData(filtered.sort((a, b) => {
            if (order === 'asc') {
                return a[orderBy] < b[orderBy] ? -1 : 1;
            } else {
                return a[orderBy] > b[orderBy] ? -1 : 1;
            }
        }));
    }, [stockData, filterCategory, searchTerm, dateRange, order, orderBy]);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleStockAlert = () => {
        setOpenSnackbar(true);
        enqueueSnackbar('Stock levels are critically low!', { variant: 'warning' });
    };

    const handleDialogOpen = (item) => {
        setSelectedItem(item);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedItem(null);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const stockChartData = {
        labels: sortedData.map(item => item.name),
        datasets: [{
            label: 'Stock Quantity',
            data: sortedData.map(item => item.quantity),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        }],
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Monitor Stock
            </Typography>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Stock Overview</Typography>
                <Divider sx={{ marginY: 2 }} />

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="Painkiller">Painkiller</MenuItem>
                                <MenuItem value="Antibiotic">Antibiotic</MenuItem>
                                {/* Add more categories here */}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateRangePicker
                                startText="Start"
                                endText="End"
                                value={dateRange}
                                onChange={(newValue) => setDateRange(newValue)}
                                renderInput={(startProps, endProps) => (
                                    <>
                                        <TextField {...startProps} fullWidth sx={{ marginRight: 1 }} />
                                        <TextField {...endProps} fullWidth />
                                    </>
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>

                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h6">Stock Levels Chart</Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <Bar
                        data={stockChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                tooltip: { callbacks: { label: (context) => `Quantity: ${context.raw}` } },
                            },
                        }}
                    />
                </Box>
            </Paper>

            {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="60vh">
                    <CircularProgress />
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Loading stock data...
                    </Typography>
                </Box>
            ) : (
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6">Stock Details</Typography>
                    <Divider sx={{ marginY: 2 }} />

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableSortLabel
                                        active={orderBy === 'name'}
                                        direction={orderBy === 'name' ? order : 'asc'}
                                        onClick={() => handleSort('name')}
                                    >
                                        Drug Name
                                    </TableSortLabel>
                                    <TableSortLabel
                                        active={orderBy === 'quantity'}
                                        direction={orderBy === 'quantity' ? order : 'asc'}
                                        onClick={() => handleSort('quantity')}
                                    >
                                        Quantity
                                    </TableSortLabel>
                                    <TableSortLabel
                                        active={orderBy === 'threshold'}
                                        direction={orderBy === 'threshold' ? order : 'asc'}
                                        onClick={() => handleSort('threshold')}
                                    >
                                        Threshold
                                    </TableSortLabel>
                                    <TableSortLabel
                                        active={orderBy === 'date'}
                                        direction={orderBy === 'date' ? order : 'asc'}
                                        onClick={() => handleSort('date')}
                                    >
                                        Date
                                    </TableSortLabel>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={item.quantity}
                                                color={item.quantity < item.threshold ? 'error' : 'success'}
                                            />
                                        </TableCell>
                                        <TableCell>{item.threshold}</TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleDialogOpen(item)}
                                                    sx={{ marginRight: 1 }}
                                                >
                                                    <i className="material-icons">visibility</i>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Notify Low Stock">
                                                <IconButton
                                                    color="warning"
                                                    onClick={handleStockAlert}
                                                >
                                                    <i className="material-icons">warning</i>
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={sortedData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </Paper>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
            >
                <MuiAlert onClose={() => setOpenSnackbar(false)} severity="warning">
                    Stock levels are critically low!
                </MuiAlert>
            </Snackbar>

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Stock Item Details</DialogTitle>
                <DialogContent>
                    {selectedItem && (
                        <Box>
                            <Typography variant="h6">Drug Name: {selectedItem.name}</Typography>
                            <Typography>Category: {selectedItem.category}</Typography>
                            <Typography>Quantity: {selectedItem.quantity}</Typography>
                            <Typography>Threshold: {selectedItem.threshold}</Typography>
                            <Typography>Date: {selectedItem.date}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

const MonitorStockPage = () => (
    <SnackbarProvider maxSnack={3}>
        <MonitorStock />
    </SnackbarProvider>
);

export default MonitorStockPage;

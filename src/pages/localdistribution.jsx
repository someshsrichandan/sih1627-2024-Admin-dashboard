import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Grid, Box, TextField, Select, MenuItem,
    InputLabel, FormControl, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TableSortLabel, IconButton, CircularProgress,
    Snackbar, Divider, Chip, Button, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, DatePicker, AdapterDateFns, LocalizationProvider, Pagination,
    TablePagination, SnackbarProvider, Alert as MuiAlert, Skeleton, Card,
    CardContent, CardHeader, useMediaQuery, useTheme
} from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { useSnackbar } from 'notistack';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, LineElement, BarElement, Title, ChartTooltip, Legend);

const LocalDistribution = () => {
    const [distributionData, setDistributionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [quantityRange, setQuantityRange] = useState([0, 100]);
    const [sortedData, setSortedData] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('date');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        // Simulate fetching distribution data
        const fetchData = () => {
            setTimeout(() => {
                setDistributionData([
                    { id: 1, name: 'Aspirin', quantity: 100, date: '2024-08-15', location: 'Delhi', lat: 28.6139, lon: 77.2090 },
                    { id: 2, name: 'Paracetamol', quantity: 50, date: '2024-08-20', location: 'Mumbai', lat: 19.0760, lon: 72.8777 },
                    { id: 3, name: 'Amoxicillin', quantity: 30, date: '2024-08-10', location: 'Bangalore', lat: 12.9716, lon: 77.5946 },
                    // Add more sample data here
                ]);
                setLoading(false);
            }, 1000);
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Apply filters and search
        const filtered = distributionData.filter(item => {
            const itemDate = new Date(item.date);
            return (filterCategory === 'all' || item.location === filterCategory) &&
                   (item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                   (dateRange[0] === null || itemDate >= dateRange[0]) &&
                   (dateRange[1] === null || itemDate <= dateRange[1]) &&
                   (item.quantity >= quantityRange[0] && item.quantity <= quantityRange[1]);
        });

        setSortedData(filtered.sort((a, b) => {
            if (order === 'asc') {
                return a[orderBy] < b[orderBy] ? -1 : 1;
            } else {
                return a[orderBy] > b[orderBy] ? -1 : 1;
            }
        }));
    }, [distributionData, filterCategory, searchTerm, dateRange, quantityRange, order, orderBy]);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
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

    const handleExport = () => {
        // Implement export logic (e.g., CSV or Excel export)
        enqueueSnackbar('Export feature is not implemented yet', { variant: 'info' });
    };

    const distributionChartData = {
        labels: sortedData.map(item => item.date),
        datasets: [{
            label: 'Quantity Distributed',
            data: sortedData.map(item => item.quantity),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            tension: 0.1,
        }],
    };

    const distributionBarData = {
        labels: sortedData.map(item => item.name),
        datasets: [{
            label: 'Total Quantity',
            data: sortedData.map(item => item.quantity),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
        }],
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Local Distribution
            </Typography>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Distribution Overview</Typography>
                <Divider sx={{ marginY: 2 }} />

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Location</InputLabel>
                            <Select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="Delhi">Delhi</MenuItem>
                                <MenuItem value="Mumbai">Mumbai</MenuItem>
                                <MenuItem value="Bangalore">Bangalore</MenuItem>
                                {/* Add more locations here */}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
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
                    <Grid item xs={12} md={3}>
                        <Typography gutterBottom>Quantity Range</Typography>
                        <Slider
                            value={quantityRange}
                            onChange={(e, newValue) => setQuantityRange(newValue)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={500}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h6">Distribution Trends</Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <Line
                        data={distributionChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                tooltip: { callbacks: { label: (context) => `Quantity: ${context.raw}` } },
                            },
                            scales: {
                                x: { title: { display: true, text: 'Date' } },
                                y: { title: { display: true, text: 'Quantity' }, beginAtZero: true },
                            },
                        }}
                    />
                </Box>

                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h6">Distribution Summary</Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <Bar
                        data={distributionBarData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                tooltip: { callbacks: { label: (context) => `Quantity: ${context.raw}` } },
                            },
                            scales: {
                                x: { title: { display: true, text: 'Drug Name' } },
                                y: { title: { display: true, text: 'Total Quantity' }, beginAtZero: true },
                            },
                        }}
                    />
                </Box>

                <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={handleExport}>
                        Export Data
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => setOpenSnackbar(true)}>
                        Update Data
                    </Button>
                </Box>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={item.quantity}
                                                color={item.quantity < 50 ? 'error' : 'success'}
                                            />
                                        </TableCell>
                                        <TableCell>{item.location}</TableCell>
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
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={sortedData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                        />
                    </TableContainer>
                </Paper>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
            >
                <MuiAlert onClose={() => setOpenSnackbar(false)} severity="info">
                    Distribution data updated!
                </MuiAlert>
            </Snackbar>

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Distribution Details</DialogTitle>
                <DialogContent>
                    {selectedItem && (
                        <Box>
                            <Typography variant="h6">Drug Name: {selectedItem.name}</Typography>
                            <Typography>Date: {selectedItem.date}</Typography>
                            <Typography>Quantity: {selectedItem.quantity}</Typography>
                            <Typography>Location: {selectedItem.location}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ marginTop: 4, height: 400 }}>
                <Typography variant="h6">Distribution Locations</Typography>
                <Divider sx={{ marginY: 2 }} />
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {distributionData.map(item => (
                        <Marker key={item.id} position={[item.lat, item.lon]}>
                            <Popup>
                                <Typography variant="subtitle2">{item.name}</Typography>
                                <Typography>Date: {item.date}</Typography>
                                <Typography>Quantity: {item.quantity}</Typography>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </Box>
        </Container>
    );
};

const LocalDistributionPage = () => (
    <SnackbarProvider maxSnack={3}>
        <LocalDistribution />
    </SnackbarProvider>
);

export default LocalDistributionPage;

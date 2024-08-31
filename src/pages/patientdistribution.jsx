import React, { useState } from 'react';
import {
    Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Grid,
    Card, CardContent, CardHeader, CardActions, Divider, Box, Tooltip, Dialog, DialogActions, DialogContent,
    DialogTitle, CircularProgress, Chip, Stack, Autocomplete, LinearProgress, Popover
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { PieChart } from 'react-minimal-pie-chart'; // Example chart library

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const patientData = [
    // Example data
    { id: 1, patientName: 'John Doe', drugName: 'Paracetamol', quantity: 20, date: '2024-08-01', location: 'Delhi' },
    { id: 2, patientName: 'Jane Smith', drugName: 'Ibuprofen', quantity: 15, date: '2024-08-02', location: 'Mumbai' },
    { id: 3, patientName: 'Alice Johnson', drugName: 'Amoxicillin', quantity: 10, date: '2024-08-03', location: 'Bangalore' },
    // More data...
];

const PatientDistribution = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDrug, setFilterDrug] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState('');

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const filteredData = patientData
        .filter(row =>
            (!searchQuery || row.patientName.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (!filterDrug || row.drugName === filterDrug) &&
            (!filterLocation || row.location === filterLocation) &&
            (!filterDate || row.date === filterDate)
        );

    const handleClearFilters = () => {
        setSearchQuery('');
        setFilterDrug('');
        setFilterLocation('');
        setFilterDate('');
    };

    const handleDialogOpen = (patient) => {
        setSelectedPatient(patient);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleExport = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert('Reports exported successfully!');
        }, 2000);
    };

    const handlePopoverOpen = (event, content) => {
        setAnchorEl(event.currentTarget);
        setPopoverContent(content);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setPopoverContent('');
    };

    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'simple-popover' : undefined;

    const chartData = {
        labels: patientData.map(item => item.patientName),
        datasets: [{
            label: 'Drug Quantity',
            data: patientData.map(item => item.quantity),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    const lineChartData = {
        labels: patientData.map(item => item.date),
        datasets: [{
            label: 'Quantity Over Time',
            data: patientData.map(item => item.quantity),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        }],
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Patient Drug Distribution
            </Typography>

            {/* Summary Card */}
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader title="Total Drugs Distributed" />
                        <CardContent>
                            <Typography variant="h5">
                                {patientData.reduce((total, item) => total + item.quantity, 0)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader title="Most Common Drug" />
                        <CardContent>
                            <Typography variant="h5">
                                {patientData.reduce((max, item) => item.quantity > max.quantity ? item : max, { quantity: 0 }).drugName}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader title="Least Common Drug" />
                        <CardContent>
                            <Typography variant="h5">
                                {patientData.reduce((min, item) => item.quantity < min.quantity ? item : min, { quantity: Infinity }).drugName}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Drug Distribution by Patient</Typography>
                        <PieChart
                            data={patientData.map(item => ({
                                title: item.patientName,
                                value: item.quantity,
                                color: '#'+((1<<24)*Math.random()|0).toString(16)
                            }))}
                            style={{ height: '300px' }}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Drug Quantity by Patient</Typography>
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => `${context.label}: ${context.raw} units`
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        stacked: true,
                                    },
                                    y: {
                                        stacked: true,
                                    }
                                }
                            }}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Quantity Over Time</Typography>
                        <Line
                            data={lineChartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => `${context.label}: ${context.raw} units`
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Date',
                                        },
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Quantity',
                                        },
                                    },
                                },
                            }}
                        />
                    </Paper>
                </Grid>
            </Grid>

            {/* Filters */}
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Search Patient"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={() => setSearchQuery('')}>
                                        <ClearIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Drug</InputLabel>
                            <Select
                                value={filterDrug}
                                onChange={(e) => setFilterDrug(e.target.value)}
                                label="Drug"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Paracetamol">Paracetamol</MenuItem>
                                <MenuItem value="Ibuprofen">Ibuprofen</MenuItem>
                                <MenuItem value="Amoxicillin">Amoxicillin</MenuItem>
                                {/* More drugs... */}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Location</InputLabel>
                            <Select
                                value={filterLocation}
                                onChange={(e) => setFilterLocation(e.target.value)}
                                label="Location"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Delhi">Delhi</MenuItem>
                                <MenuItem value="Mumbai">Mumbai</MenuItem>
                                <MenuItem value="Bangalore">Bangalore</MenuItem>
                                {/* More locations... */}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Date"
                            variant="outlined"
                            size="small"
                            type="date"
                            fullWidth
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setFilterOpen(!filterOpen)}
                            startIcon={<FilterListIcon />}
                        >
                            {filterOpen ? 'Hide Filters' : 'Show Filters'}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleClearFilters}
                        >
                            Clear Filters
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Data Table */}
            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Patient Name</TableCell>
                            <TableCell>Drug Name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.patientName}</TableCell>
                                    <TableCell>{row.drugName}</TableCell>
                                    <TableCell>{row.quantity}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.location}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleDialogOpen(row)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={filteredData.length}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
            />

            {/* Details Dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Patient Details</DialogTitle>
                <DialogContent>
                    {selectedPatient && (
                        <Stack spacing={2}>
                            <Typography variant="body1"><strong>Patient Name:</strong> {selectedPatient.patientName}</Typography>
                            <Typography variant="body1"><strong>Drug Name:</strong> {selectedPatient.drugName}</Typography>
                            <Typography variant="body1"><strong>Quantity:</strong> {selectedPatient.quantity}</Typography>
                            <Typography variant="body1"><strong>Date:</strong> {selectedPatient.date}</Typography>
                            <Typography variant="body1"><strong>Location:</strong> {selectedPatient.location}</Typography>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Export Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleExport}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Export Report'}
                </Button>
            </Box>
        </Container>
    );
};

export default PatientDistribution;

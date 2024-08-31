import React, { useState } from 'react';
import {
    Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, TextField, Grid, Button, MenuItem, FormControl, InputLabel, Select, 
    IconButton, Stack, Chip, Tooltip, Accordion, AccordionSummary, AccordionDetails,
    Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Divider, Box,
    LinearProgress, Badge, Card, CardContent, CardHeader, CardActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import PieChart from 'react-minimal-pie-chart'; // Example chart library
import BarChart from 'react-chartjs-2'; // Example chart library
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const usageData = [
    // Example data, replace with your data fetching logic
    { id: 1, drugName: 'Paracetamol', usage: 500, location: 'Delhi', date: '2024-08-01', details: 'Commonly used analgesic and antipyretic' },
    { id: 2, drugName: 'Ibuprofen', usage: 300, location: 'Mumbai', date: '2024-08-02', details: 'Nonsteroidal anti-inflammatory drug' },
    { id: 3, drugName: 'Amoxicillin', usage: 150, location: 'Bangalore', date: '2024-08-03', details: 'Antibiotic used for bacterial infections' },
    // Add more data as needed
];

const UsageReports = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDrug, setSelectedDrug] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const filteredData = usageData
        .filter(row => 
            (!searchQuery || row.drugName.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (!filterLocation || row.location === filterLocation) &&
            (!filterDate || row.date === filterDate)
        );

    const handleClearFilters = () => {
        setSearchQuery('');
        setFilterLocation('');
        setFilterDate('');
    };

    const handleDialogOpen = (drug) => {
        setSelectedDrug(drug);
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

    const chartData = {
        labels: usageData.map(item => item.drugName),
        datasets: [{
            label: 'Drug Usage',
            data: usageData.map(item => item.usage),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Usage Reports
            </Typography>

            {/* Summary Card */}
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader title="Total Drugs Used" />
                        <CardContent>
                            <Typography variant="h5">
                                {usageData.reduce((total, item) => total + item.usage, 0)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader title="Most Used Drug" />
                        <CardContent>
                            <Typography variant="h5">
                                {usageData.reduce((max, item) => item.usage > max.usage ? item : max, { usage: 0 }).drugName}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader title="Least Used Drug" />
                        <CardContent>
                            <Typography variant="h5">
                                {usageData.reduce((min, item) => item.usage < min.usage ? item : min, { usage: Infinity }).drugName}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Usage Distribution</Typography>
                        <PieChart
                            data={usageData.map(item => ({ title: item.drugName, value: item.usage, color: '#'+((1<<24)*Math.random()|0).toString(16) }))}
                            style={{ height: '300px' }}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Usage by Drug</Typography>
                        <BarChart
                            type='bar'
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
            </Grid>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Search Drug"
                            variant="outlined"
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
                        <FormControl fullWidth>
                            <InputLabel>Location</InputLabel>
                            <Select
                                value={filterLocation}
                                onChange={(e) => setFilterLocation(e.target.value)}
                                label="Location"
                            >
                                <MenuItem value="">All Locations</MenuItem>
                                <MenuItem value="Delhi">Delhi</MenuItem>
                                <MenuItem value="Mumbai">Mumbai</MenuItem>
                                <MenuItem value="Bangalore">Bangalore</MenuItem>
                                {/* Add more locations as needed */}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Date"
                            type="date"
                            variant="outlined"
                            fullWidth
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            onClick={() => setFilterOpen(!filterOpen)}
                        >
                            Advanced Filters
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            variant="outlined"
                            startIcon={<SearchIcon />}
                            onClick={handleClearFilters}
                        >
                            Clear Filters
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            color="primary"
                            onClick={handleExport}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Export Reports'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Accordion expanded={filterOpen}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Advanced Filters</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {/* Add additional filter options here */}
                    <Typography variant="body2">No additional filters available at the moment.</Typography>
                </AccordionDetails>
            </Accordion>

            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Drug Name</TableCell>
                            <TableCell>Usage</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Tooltip title={row.details}>
                                                <InfoIcon fontSize="small" color="action" />
                                            </Tooltip>
                                            <span>{row.drugName}</span>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{row.usage}</TableCell>
                                    <TableCell>{row.location}</TableCell>
                                    <TableCell>{row.date}</TableCell>
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

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Drug Details</DialogTitle>
                <DialogContent>
                    {selectedDrug && (
                        <Stack spacing={2}>
                            <Typography variant="body1"><strong>Drug Name:</strong> {selectedDrug.drugName}</Typography>
                            <Typography variant="body1"><strong>Usage:</strong> {selectedDrug.usage}</Typography>
                            <Typography variant="body1"><strong>Location:</strong> {selectedDrug.location}</Typography>
                            <Typography variant="body1"><strong>Date:</strong> {selectedDrug.date}</Typography>
                            <Typography variant="body1"><strong>Details:</strong> {selectedDrug.details}</Typography>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UsageReports;

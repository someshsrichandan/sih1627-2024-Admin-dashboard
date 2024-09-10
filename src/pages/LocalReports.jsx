import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Grid, Box, Button, TextField, MenuItem, Select,
    InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, IconButton, Snackbar, CircularProgress, Divider,
    Tooltip, Card, CardContent, Chip, Divider as MuiDivider, Typography as MuiTypography,
    Autocomplete, Stack, Collapse, LinearProgress
} from '@mui/material';
import { CSVLink } from 'react-csv';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Chart } from 'react-chartjs-2';
import { useSnackbar } from 'notistack';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const LocalReports = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month'));
    const [endDate, setEndDate] = useState(dayjs());
    const [reportType, setReportType] = useState('sales');
    const [sortedData, setSortedData] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('date');
    const [expanded, setExpanded] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [chartType, setChartType] = useState('bar');
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        // Simulate fetching report data
        const fetchData = () => {
            setTimeout(() => {
                setData([
                    { date: '2024-08-01', drugName: 'Aspirin', quantity: 100, total: 2000 },
                    { date: '2024-08-02', drugName: 'Paracetamol', quantity: 150, total: 3000 },
                    // Add more sample data here
                ]);
                setFilters([
                    'Aspirin',
                    'Paracetamol',
                    // Add more filters here
                ]);
                setLoading(false);
            }, 1000);
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Apply filters
        const filteredData = data.filter(row => selectedFilters.length === 0 || selectedFilters.includes(row.drugName));
        const sorted = filteredData.sort((a, b) => {
            if (order === 'asc') {
                return a[orderBy] < b[orderBy] ? -1 : 1;
            } else {
                return a[orderBy] > b[orderBy] ? -1 : 1;
            }
        });
        setSortedData(sorted);
    }, [data, order, orderBy, selectedFilters]);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleExportCSV = () => {
        enqueueSnackbar('Data exported to CSV!', { variant: 'success' });
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text('Local Reports', 14, 16);
        doc.autoTable({
            head: [['Date', 'Drug Name', 'Quantity', 'Total']],
            body: sortedData.map(row => [row.date, row.drugName, row.quantity, row.total]),
        });
        doc.save('local-reports.pdf');
        enqueueSnackbar('Data exported to PDF!', { variant: 'success' });
    };

    const handleDateChange = (setter) => (date) => {
        setter(date);
    };

    // Chart data
    const chartData = {
        labels: sortedData.map(row => row.date),
        datasets: [
            {
                label: 'Total Sales',
                data: sortedData.map(row => row.total),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Total: ${context.raw}`;
                    },
                },
            },
        },
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Local Reports
            </Typography>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Filters</Typography>
                <Divider sx={{ marginY: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={handleDateChange(setStartDate)}
                            renderInput={(params) => <TextField fullWidth {...params} />}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={handleDateChange(setEndDate)}
                            renderInput={(params) => <TextField fullWidth {...params} />}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Report Type</InputLabel>
                            <Select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                <MenuItem value="sales">Sales</MenuItem>
                                <MenuItem value="inventory">Inventory</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={2} marginTop={2}>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            multiple
                            options={filters}
                            value={selectedFilters}
                            onChange={(event, newValue) => setSelectedFilters(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" label="Filter by Drug" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Chart Type</InputLabel>
                            <Select
                                value={chartType}
                                onChange={(e) => setChartType(e.target.value)}
                            >
                                <MenuItem value="bar">Bar</MenuItem>
                                <MenuItem value="line">Line</MenuItem>
                                <MenuItem value="pie">Pie</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="60vh">
                    <CircularProgress />
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Loading data...
                    </Typography>
                </Box>
            ) : (
                <>
                    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                        <Typography variant="h6">Summary</Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6">Total Quantity</Typography>
                                        <Typography variant="h5">
                                            {sortedData.reduce((acc, row) => acc + row.quantity, 0)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6">Total Sales</Typography>
                                        <Typography variant="h5">
                                            {sortedData.reduce((acc, row) => acc + row.total, 0)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6">Average Sales</Typography>
                                        <Typography variant="h5">
                                            {(sortedData.reduce((acc, row) => acc + row.total, 0) / sortedData.length).toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                        <Typography variant="h6">Sales Chart</Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <Box sx={{ height: 400 }}>
                            <Chart
                                type={chartType}
                                data={chartData}
                                options={chartOptions}
                            />
                        </Box>
                    </Paper>

                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Report Data</Typography>
                        <Divider sx={{ marginY: 2 }} />

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableSortLabel
                                            active={orderBy === 'date'}
                                            direction={orderBy === 'date' ? order : 'asc'}
                                            onClick={() => handleSort('date')}
                                        >
                                            Date
                                        </TableSortLabel>
                                        <TableSortLabel
                                            active={orderBy === 'drugName'}
                                            direction={orderBy === 'drugName' ? order : 'asc'}
                                            onClick={() => handleSort('drugName')}
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
                                            active={orderBy === 'total'}
                                            direction={orderBy === 'total' ? order : 'asc'}
                                            onClick={() => handleSort('total')}
                                        >
                                            Total
                                        </TableSortLabel>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedData.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.date}</TableCell>
                                            <TableCell>{row.drugName}</TableCell>
                                            <TableCell>{row.quantity}</TableCell>
                                            <TableCell>{row.total}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                            <CSVLink
                                data={sortedData}
                                headers={[
                                    { label: 'Date', key: 'date' },
                                    { label: 'Drug Name', key: 'drugName' },
                                    { label: 'Quantity', key: 'quantity' },
                                    { label: 'Total', key: 'total' }
                                ]}
                                filename="local-reports.csv"
                                onClick={handleExportCSV}
                            >
                                <Button variant="contained" color="primary">Export CSV</Button>
                            </CSVLink>
                            <Button variant="contained" color="secondary" onClick={handleExportPDF}>
                                Export PDF
                            </Button>
                        </Box>
                    </Paper>
                </>
            )}

            {/* Snackbar for alerts */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
                message={error || 'An error occurred'}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() => setError(null)}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </Container>
    );
};

export default LocalReports;

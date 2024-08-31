import React, { useState } from 'react';
import {
    Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, Card, CardContent, CardHeader,
    CardActions, Divider, CircularProgress, Box, Chip, Autocomplete, Tooltip, Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend, ArcElement);

// Sample stock data
const stockData = [
    { id: 1, drugName: 'Paracetamol', batchNumber: 'P123', quantity: 100, expiryDate: '2025-01-01', supplier: 'Supplier A' },
    { id: 2, drugName: 'Ibuprofen', batchNumber: 'I456', quantity: 50, expiryDate: '2024-12-31', supplier: 'Supplier B' },
    { id: 3, drugName: 'Amoxicillin', batchNumber: 'A789', quantity: 200, expiryDate: '2026-06-30', supplier: 'Supplier C' },
    // More data...
];

const StockManagement = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDrug, setFilterDrug] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState(''); // 'add' or 'edit'
    const [selectedStock, setSelectedStock] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const filteredData = stockData
        .filter(row =>
            (!searchQuery || row.drugName.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (!filterDrug || row.drugName === filterDrug)
        );

    const handleClearFilters = () => {
        setSearchQuery('');
        setFilterDrug('');
    };

    const handleDialogOpen = (type, stock = null) => {
        setDialogType(type);
        setSelectedStock(stock);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedStock(null);
    };

    const handleSave = () => {
        // Implement save logic (e.g., API call to save stock data)
        console.log(dialogType === 'add' ? 'Add new stock' : 'Edit stock', selectedStock);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            handleDialogClose();
            setSnackbarOpen(true);
        }, 2000);
    };

    const chartData = {
        labels: stockData.map(item => item.drugName),
        datasets: [{
            label: 'Stock Quantity',
            data: stockData.map(item => item.quantity),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    const pieData = {
        labels: stockData.map(item => item.drugName),
        datasets: [{
            label: 'Stock Distribution',
            data: stockData.map(item => item.quantity),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                // Add more colors...
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                // Add more colors...
            ],
            borderWidth: 1,
        }],
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Stock Management
            </Typography>

            {/* Charts */}
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Stock Levels by Drug</Typography>
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
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Stock Distribution</Typography>
                        <Pie
                            data={pieData}
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
                                }
                            }}
                        />
                    </Paper>
                </Grid>
            </Grid>

            {/* Filters and Search */}
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Search Drug"
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
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleDialogOpen('add')}
                            startIcon={<AddIcon />}
                        >
                            Add Stock
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Data Table */}
            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Drug Name</TableCell>
                            <TableCell>Batch Number</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Expiry Date</TableCell>
                            <TableCell>Supplier</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.drugName}</TableCell>
                                    <TableCell>{row.batchNumber}</TableCell>
                                    <TableCell>{row.quantity}</TableCell>
                                    <TableCell>{row.expiryDate}</TableCell>
                                    <TableCell>{row.supplier}</TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleDialogOpen('edit', row)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>

            {/* Dialog for Add/Edit Stock */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{dialogType === 'add' ? 'Add New Stock' : 'Edit Stock'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <TextField
                            label="Drug Name"
                            variant="outlined"
                            fullWidth
                            value={selectedStock?.drugName || ''}
                            onChange={(e) => setSelectedStock({ ...selectedStock, drugName: e.target.value })}
                        />
                        <TextField
                            label="Batch Number"
                            variant="outlined"
                            fullWidth
                            value={selectedStock?.batchNumber || ''}
                            onChange={(e) => setSelectedStock({ ...selectedStock, batchNumber: e.target.value })}
                        />
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={selectedStock?.quantity || ''}
                            onChange={(e) => setSelectedStock({ ...selectedStock, quantity: e.target.value })}
                        />
                        <TextField
                            label="Expiry Date"
                            variant="outlined"
                            type="date"
                            fullWidth
                            value={selectedStock?.expiryDate || ''}
                            onChange={(e) => setSelectedStock({ ...selectedStock, expiryDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Supplier"
                            variant="outlined"
                            fullWidth
                            value={selectedStock?.supplier || ''}
                            onChange={(e) => setSelectedStock({ ...selectedStock, supplier: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">Cancel</Button>
                    <Button onClick={handleSave} color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message="Stock data saved successfully!"
            />

            {/* Clear Filters Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClearFilters}
                >
                    Clear Filters
                </Button>
            </Box>
        </Container>
    );
};

export default StockManagement;

import React, { useState } from 'react';
import {
    Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, Box, CircularProgress, Snackbar,
    Tooltip, Divider, Typography, Chart, useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';

// Initialize Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const ReceiveDrugs = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState(''); // 'add' or 'edit'
    const [selectedDrug, setSelectedDrug] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [filterSupplier, setFilterSupplier] = useState('');
    const [filterDateRange, setFilterDateRange] = useState([null, null]);

    // Sample received drugs data
    const receivedDrugsData = [
        { id: 1, drugName: 'Paracetamol', quantity: 100, receivedDate: '2024-08-01', supplier: 'Supplier A', batchNumber: 'P123' },
        { id: 2, drugName: 'Ibuprofen', quantity: 50, receivedDate: '2024-08-10', supplier: 'Supplier B', batchNumber: 'I456' },
        // More data...
    ];

    const filteredData = receivedDrugsData
        .filter(row => row.drugName.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(row => filterSupplier ? row.supplier === filterSupplier : true)
        .filter(row => {
            if (!filterDateRange[0] || !filterDateRange[1]) return true;
            const receivedDate = new Date(row.receivedDate);
            return receivedDate >= filterDateRange[0] && receivedDate <= filterDateRange[1];
        });

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleDialogOpen = (type, drug = null) => {
        setDialogType(type);
        setSelectedDrug(drug);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedDrug(null);
    };

    const handleSave = () => {
        // Implement save logic (e.g., API call to save drug data)
        console.log(dialogType === 'add' ? 'Add new drug' : 'Edit drug', selectedDrug);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            handleDialogClose();
            setSnackbarOpen(true);
        }, 2000);
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setFilterSupplier('');
        setFilterDateRange([null, null]);
    };

    const chartData = {
        labels: receivedDrugsData.map(drug => drug.drugName),
        datasets: [{
            label: 'Quantity Received',
            data: receivedDrugsData.map(drug => drug.quantity),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }]
    };

    const isSmallScreen = useMediaQuery('(max-width:600px)');

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Receive Drugs
            </Typography>

            {/* Search and Filter */}
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
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
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Supplier</InputLabel>
                            <Select
                                value={filterSupplier}
                                onChange={(e) => setFilterSupplier(e.target.value)}
                                label="Supplier"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Supplier A">Supplier A</MenuItem>
                                <MenuItem value="Supplier B">Supplier B</MenuItem>
                                {/* More suppliers */}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Stack spacing={1}>
                            <Typography variant="caption">Received Date Range</Typography>
                            <TextField
                                label="Start Date"
                                type="date"
                                value={filterDateRange[0] ? filterDateRange[0].toISOString().split('T')[0] : ''}
                                onChange={(e) => setFilterDateRange([new Date(e.target.value), filterDateRange[1]])}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                            <TextField
                                label="End Date"
                                type="date"
                                value={filterDateRange[1] ? filterDateRange[1].toISOString().split('T')[0] : ''}
                                onChange={(e) => setFilterDateRange([filterDateRange[0], new Date(e.target.value)])}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleDialogOpen('add')}
                            startIcon={<AddIcon />}
                        >
                            Receive Drug
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleClearFilters}
                            startIcon={<ClearIcon />}
                        >
                            Clear Filters
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Chart */}
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Drug Quantities Received</Typography>
                <Box sx={{ height: 300 }}>
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
                                        label: function (context) {
                                            return `${context.label}: ${context.raw}`;
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </Box>
            </Paper>

            {/* Data Table */}
            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Drug Name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Received Date</TableCell>
                            <TableCell>Supplier</TableCell>
                            <TableCell>Batch Number</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.drugName}</TableCell>
                                    <TableCell>{row.quantity}</TableCell>
                                    <TableCell>{row.receivedDate}</TableCell>
                                    <TableCell>{row.supplier}</TableCell>
                                    <TableCell>{row.batchNumber}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => handleDialogOpen('edit', row)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="error">
                                                <DeleteIcon />
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
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>

            {/* Dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
                <DialogTitle>{dialogType === 'add' ? 'Receive Drug' : 'Edit Drug'}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Drug Name</InputLabel>
                        <Select
                            value={selectedDrug?.drugName || ''}
                            onChange={(e) => setSelectedDrug({ ...selectedDrug, drugName: e.target.value })}
                            label="Drug Name"
                        >
                            <MenuItem value="Paracetamol">Paracetamol</MenuItem>
                            <MenuItem value="Ibuprofen">Ibuprofen</MenuItem>
                            {/* More drugs */}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Quantity"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={selectedDrug?.quantity || ''}
                        onChange={(e) => setSelectedDrug({ ...selectedDrug, quantity: e.target.value })}
                    />
                    <TextField
                        label="Batch Number"
                        fullWidth
                        margin="normal"
                        value={selectedDrug?.batchNumber || ''}
                        onChange={(e) => setSelectedDrug({ ...selectedDrug, batchNumber: e.target.value })}
                    />
                    <TextField
                        label="Received Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={selectedDrug?.receivedDate || ''}
                        onChange={(e) => setSelectedDrug({ ...selectedDrug, receivedDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Supplier</InputLabel>
                        <Select
                            value={selectedDrug?.supplier || ''}
                            onChange={(e) => setSelectedDrug({ ...selectedDrug, supplier: e.target.value })}
                            label="Supplier"
                        >
                            <MenuItem value="Supplier A">Supplier A</MenuItem>
                            <MenuItem value="Supplier B">Supplier B</MenuItem>
                            {/* More suppliers */}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message="Drug data saved successfully!"
            />
        </Container>
    );
};

export default ReceiveDrugs;

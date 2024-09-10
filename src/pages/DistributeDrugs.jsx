import React, { useState } from 'react';
import {
    Container, Typography, Paper, Box, Grid, TextField, FormControl,
    InputLabel, Select, MenuItem, Button, Divider, IconButton, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableSortLabel, TablePagination, Dialog, DialogTitle, DialogContent,
    DialogActions, Card, CardContent, CardHeader, Switch, FormControlLabel
} from '@mui/material';
import { Visibility, Edit, Delete, Search } from '@mui/icons-material';
import { SnackbarProvider, useSnackbar } from 'notistack'; // Import from 'notistack'

// Custom hook for handling sorting
const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = React.useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = key => {
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

const DistributeDrugs = () => {
    const [selectedDrug, setSelectedDrug] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [destination, setDestination] = useState('');
    const [distributionList, setDistributionList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [enableAdvancedFilters, setEnableAdvancedFilters] = useState(false);
    const [filterDestination, setFilterDestination] = useState('');
    const [filterQuantity, setFilterQuantity] = useState('');

    const { enqueueSnackbar } = useSnackbar();

    // Mock data for drugs and destinations
    const drugs = ['Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Ciprofloxacin'];
    const destinations = ['Hospital A', 'Clinic B', 'Pharmacy C'];

    const handleAddDistribution = () => {
        if (selectedDrug && quantity > 0 && destination) {
            setDistributionList([...distributionList, { drug: selectedDrug, quantity, destination }]);
            setSelectedDrug('');
            setQuantity(0);
            setDestination('');
            enqueueSnackbar('Drug distribution added successfully!', { variant: 'success' });
        } else {
            enqueueSnackbar('Please fill in all fields.', { variant: 'error' });
        }
    };

    const handleDialogOpen = (row) => {
        setSelectedRow(row);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedRow(null);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAdvancedFilterToggle = () => {
        setEnableAdvancedFilters(!enableAdvancedFilters);
    };

    const handleFilterApply = () => {
        enqueueSnackbar('Filters applied.', { variant: 'info' });
    };

    const filteredDistributions = distributionList.filter(item =>
        item.drug.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!filterDestination || item.destination === filterDestination) &&
        (!filterQuantity || item.quantity === Number(filterQuantity))
    );

    const { items: sortedDistributions, requestSort, sortConfig } = useSortableData(filteredDistributions);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Distribute Drugs
            </Typography>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">New Distribution</Typography>
                <Divider sx={{ marginY: 2 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Drug</InputLabel>
                            <Select
                                value={selectedDrug}
                                onChange={(e) => setSelectedDrug(e.target.value)}
                                label="Drug"
                            >
                                {drugs.map(drug => (
                                    <MenuItem key={drug} value={drug}>{drug}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Destination</InputLabel>
                            <Select
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                label="Destination"
                            >
                                {destinations.map(dest => (
                                    <MenuItem key={dest} value={dest}>{dest}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Box sx={{ marginTop: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleAddDistribution}>
                        Add to Distribution List
                    </Button>
                </Box>
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Distribution List</Typography>
                <Divider sx={{ marginY: 2 }} />
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Search"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearch}
                            InputProps={{
                                endAdornment: (
                                    <IconButton>
                                        <Search />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={enableAdvancedFilters}
                                    onChange={handleAdvancedFilterToggle}
                                    color="primary"
                                />
                            }
                            label="Enable Advanced Filters"
                        />
                    </Grid>
                </Grid>
                {enableAdvancedFilters && (
                    <Box sx={{ marginTop: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Filter by Destination</InputLabel>
                                    <Select
                                        value={filterDestination}
                                        onChange={(e) => setFilterDestination(e.target.value)}
                                        label="Filter by Destination"
                                    >
                                        {destinations.map(dest => (
                                            <MenuItem key={dest} value={dest}>{dest}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Filter by Quantity"
                                    type="number"
                                    value={filterQuantity}
                                    onChange={(e) => setFilterQuantity(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ marginTop: 2 }}>
                            <Button variant="contained" color="secondary" onClick={handleFilterApply}>
                                Apply Filters
                            </Button>
                        </Box>
                    </Box>
                )}
                <TableContainer sx={{ marginTop: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig?.key === 'drug'}
                                        direction={sortConfig?.key === 'drug' ? sortConfig.direction : 'asc'}
                                        onClick={() => requestSort('drug')}
                                    >
                                        Drug
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig?.key === 'quantity'}
                                        direction={sortConfig?.key === 'quantity' ? sortConfig.direction : 'asc'}
                                        onClick={() => requestSort('quantity')}
                                    >
                                        Quantity
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig?.key === 'destination'}
                                        direction={sortConfig?.key === 'destination' ? sortConfig.direction : 'asc'}
                                        onClick={() => requestSort('destination')}
                                    >
                                        Destination
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedDistributions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.drug}</TableCell>
                                    <TableCell>{row.quantity}</TableCell>
                                    <TableCell>{row.destination}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton color="primary" onClick={() => {/* handle edit */}}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="error" onClick={() => {/* handle delete */}}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="View Details">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleDialogOpen(row)}
                                            >
                                                <Visibility />
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
                        count={sortedDistributions.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </TableContainer>
            </Paper>

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Distribution Details</DialogTitle>
                <DialogContent>
                    {selectedRow && (
                        <Card>
                            <CardHeader title="Details" />
                            <CardContent>
                                <Typography variant="h6">Drug: {selectedRow.drug}</Typography>
                                <Typography>Quantity: {selectedRow.quantity}</Typography>
                                <Typography>Destination: {selectedRow.destination}</Typography>
                            </CardContent>
                        </Card>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

const DistributeDrugsPage = () => (
    <SnackbarProvider maxSnack={3}>
        <DistributeDrugs />
    </SnackbarProvider>
);

export default DistributeDrugsPage;

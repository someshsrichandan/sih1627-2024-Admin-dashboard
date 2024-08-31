import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Grid, Box, Button, TextField, MenuItem, Select,
    InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, IconButton, Snackbar, Tooltip, CircularProgress,
    Chip, Divider, Autocomplete, Modal, Box as MuiBox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SnackbarProvider, useSnackbar } from 'notistack';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedAlerts, setSortedAlerts] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('date');
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        // Simulate fetching alert data
        const fetchData = () => {
            setTimeout(() => {
                setAlerts([
                    { id: 1, date: '2024-08-01', type: 'Inventory', message: 'Low stock for Aspirin', status: 'Unacknowledged' },
                    { id: 2, date: '2024-08-02', type: 'Expiration', message: 'Paracetamol expiring soon', status: 'Acknowledged' },
                    { id: 3, date: '2024-08-03', type: 'Critical', message: 'Out of stock for Amoxicillin', status: 'Unacknowledged' },
                    // Add more sample data here
                ]);
                setLoading(false);
            }, 1000);
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Apply filters, search, and sorting
        const filtered = alerts.filter(alert => {
            return (filterType === 'all' || alert.type === filterType) &&
                   (filterStatus === 'all' || alert.status === filterStatus) &&
                   (alert.message.toLowerCase().includes(searchTerm.toLowerCase()));
        });

        const sorted = filtered.sort((a, b) => {
            if (order === 'asc') {
                return a[orderBy] < b[orderBy] ? -1 : 1;
            } else {
                return a[orderBy] > b[orderBy] ? -1 : 1;
            }
        });

        setSortedAlerts(sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
    }, [alerts, filterType, filterStatus, searchTerm, order, orderBy, page, rowsPerPage]);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleAcknowledge = (id) => {
        setAlerts(alerts.map(alert =>
            alert.id === id ? { ...alert, status: 'Acknowledged' } : alert
        ));
        enqueueSnackbar('Alert acknowledged!', { variant: 'success' });
    };

    const handleClear = (id) => {
        setAlerts(alerts.filter(alert => alert.id !== id));
        enqueueSnackbar('Alert cleared!', { variant: 'success' });
    };

    const handleOpenModal = (alert) => {
        setSelectedAlert(alert);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedAlert(null);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Alerts
            </Typography>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Filters and Search</Typography>
                <Divider sx={{ marginY: 2 }} />

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Alert Type</InputLabel>
                            <Select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="Inventory">Inventory</MenuItem>
                                <MenuItem value="Expiration">Expiration</MenuItem>
                                <MenuItem value="Critical">Critical</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Alert Status</InputLabel>
                            <Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="Unacknowledged">Unacknowledged</MenuItem>
                                <MenuItem value="Acknowledged">Acknowledged</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
            </Paper>

            {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="60vh">
                    <CircularProgress />
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Loading alerts...
                    </Typography>
                </Box>
            ) : (
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6">Alerts List</Typography>
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
                                        active={orderBy === 'type'}
                                        direction={orderBy === 'type' ? order : 'asc'}
                                        onClick={() => handleSort('type')}
                                    >
                                        Type
                                    </TableSortLabel>
                                    <TableSortLabel
                                        active={orderBy === 'message'}
                                        direction={orderBy === 'message' ? order : 'asc'}
                                        onClick={() => handleSort('message')}
                                    >
                                        Message
                                    </TableSortLabel>
                                    <TableSortLabel
                                        active={orderBy === 'status'}
                                        direction={orderBy === 'status' ? order : 'asc'}
                                        onClick={() => handleSort('status')}
                                    >
                                        Status
                                    </TableSortLabel>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedAlerts.map((alert) => (
                                    <TableRow key={alert.id}>
                                        <TableCell>{alert.date}</TableCell>
                                        <TableCell>
                                            <Chip label={alert.type} color="info" />
                                        </TableCell>
                                        <TableCell>{alert.message}</TableCell>
                                        <TableCell>
                                            <Chip label={alert.status} color={alert.status === 'Acknowledged' ? 'success' : 'warning'} />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleOpenModal(alert)}
                                                sx={{ marginRight: 1 }}
                                            >
                                                Details
                                            </Button>
                                            {alert.status === 'Unacknowledged' && (
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => handleAcknowledge(alert.id)}
                                                    sx={{ marginRight: 1 }}
                                                >
                                                    Acknowledge
                                                </Button>
                                            )}
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => handleClear(alert.id)}
                                            >
                                                Clear
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        <Typography variant="body2">
                            Showing {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, alerts.length)} of {alerts.length} alerts
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setPage(page + 1)}
                            disabled={(page + 1) * rowsPerPage >= alerts.length}
                        >
                            Next
                        </Button>
                    </Box>
                </Paper>
            )}

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="alert-details"
                aria-describedby="alert-details-description"
            >
                <MuiBox sx={{ width: 400, bgcolor: 'background.paper', p: 4, mx: 'auto', mt: '20%', borderRadius: 2 }}>
                    <Typography id="alert-details" variant="h6" component="h2">
                        Alert Details
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    {selectedAlert && (
                        <>
                            <Typography variant="body1"><strong>Date:</strong> {selectedAlert.date}</Typography>
                            <Typography variant="body1"><strong>Type:</strong> {selectedAlert.type}</Typography>
                            <Typography variant="body1"><strong>Message:</strong> {selectedAlert.message}</Typography>
                            <Typography variant="body1"><strong>Status:</strong> {selectedAlert.status}</Typography>
                        </>
                    )}
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <IconButton onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </MuiBox>
            </Modal>
        </Container>
    );
};

const AlertsPage = () => (
    <SnackbarProvider maxSnack={3}>
        <Alerts />
    </SnackbarProvider>
);

export default AlertsPage;

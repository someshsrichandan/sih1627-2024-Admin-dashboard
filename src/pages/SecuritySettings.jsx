import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Box, Grid, TextField, FormControl,
    InputLabel, Select, MenuItem, Switch, Button, Divider, IconButton, Snackbar,
    Alert as MuiAlert, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, TablePagination, Dialog, DialogTitle, DialogContent,
    DialogActions, Tooltip, useMediaQuery, useTheme, TextField as MuiTextField,
    Autocomplete, Chip, InputAdornment
} from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { LocalizationProvider, DatePicker, AdapterDateFns } from '@mui/x-date-pickers';
import { Visibility, VisibilityOff, Search } from '@mui/icons-material';
import { blue, green, red } from '@mui/material/colors';

const SecuritySettings = () => {
    const [passwordPolicy, setPasswordPolicy] = useState('strong');
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState(30);
    const [securityQuestions, setSecurityQuestions] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        // Mock data for demonstration
        setAuditLogs([
            { id: 1, user: 'Admin', action: 'Changed password policy', date: '2024-08-29', details: 'Policy changed to strong' },
            { id: 2, user: 'User1', action: 'Enabled 2FA', date: '2024-08-30', details: 'Two-factor authentication enabled' },
        ]);

        setRecentActivities([
            { id: 1, user: 'Admin', activity: 'Updated password policy', date: '2024-08-29' },
            { id: 2, user: 'User1', activity: 'Activated 2FA', date: '2024-08-30' },
        ]);
    }, []);

    const handlePasswordPolicyChange = (event) => {
        setPasswordPolicy(event.target.value);
    };

    const handleTwoFactorAuthChange = (event) => {
        setTwoFactorAuth(event.target.checked);
    };

    const handleSessionTimeoutChange = (event) => {
        setSessionTimeout(event.target.value);
    };

    const handleSecurityQuestionsChange = (event, value) => {
        setSecurityQuestions(value);
    };

    const handleDialogOpen = (log) => {
        setSelectedLog(log);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedLog(null);
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

    const handleSaveSettings = () => {
        enqueueSnackbar('Security settings saved!', { variant: 'success' });
    };

    const handleFeedbackDialogOpen = () => {
        setOpenFeedbackDialog(true);
    };

    const handleFeedbackDialogClose = () => {
        setOpenFeedbackDialog(false);
        setFeedback('');
    };

    const handleFeedbackSubmit = () => {
        setFeedbackSubmitted(true);
        enqueueSnackbar('Feedback submitted successfully!', { variant: 'success' });
        setFeedback('');
        setOpenFeedbackDialog(false);
    };

    const filteredLogs = auditLogs.filter(log => log.action.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Security Settings
            </Typography>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Password Policy</Typography>
                <Divider sx={{ marginY: 2 }} />
                <FormControl fullWidth>
                    <InputLabel>Password Policy</InputLabel>
                    <Select
                        value={passwordPolicy}
                        onChange={handlePasswordPolicyChange}
                        label="Password Policy"
                    >
                        <MenuItem value="weak">Weak</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="strong">Strong</MenuItem>
                    </Select>
                </FormControl>
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Two-Factor Authentication</Typography>
                <Divider sx={{ marginY: 2 }} />
                <FormControl fullWidth>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" sx={{ flexGrow: 1 }}>
                            Enable Two-Factor Authentication
                        </Typography>
                        <Switch
                            checked={twoFactorAuth}
                            onChange={handleTwoFactorAuthChange}
                        />
                    </Box>
                </FormControl>
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Session Timeout</Typography>
                <Divider sx={{ marginY: 2 }} />
                <TextField
                    fullWidth
                    label="Session Timeout (minutes)"
                    type="number"
                    value={sessionTimeout}
                    onChange={handleSessionTimeoutChange}
                />
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Security Questions</Typography>
                <Divider sx={{ marginY: 2 }} />
                <Autocomplete
                    multiple
                    options={['What is your mother\'s maiden name?', 'What was the name of your first pet?', 'What is your favorite color?']}
                    getOptionLabel={(option) => option}
                    value={securityQuestions}
                    onChange={handleSecurityQuestionsChange}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Security Questions" variant="outlined" />
                    )}
                />
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Recent Security Activities</Typography>
                <Divider sx={{ marginY: 2 }} />
                <TextField
                    fullWidth
                    label="Search Activities"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
                <TableContainer sx={{ marginTop: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>User</TableCell>
                                <TableCell>Activity</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.date}</TableCell>
                                    <TableCell>{log.user}</TableCell>
                                    <TableCell>{log.action}</TableCell>
                                    <TableCell>
                                        <Tooltip title="View Details">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleDialogOpen(log)}
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
                        count={filteredLogs.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </TableContainer>
            </Paper>

            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" onClick={handleSaveSettings}>
                    Save Settings
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ marginLeft: 2 }}
                    onClick={handleFeedbackDialogOpen}
                >
                    Provide Feedback
                </Button>
            </Box>

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Log Details</DialogTitle>
                <DialogContent>
                    {selectedLog && (
                        <Box>
                            <Typography variant="h6">Action: {selectedLog.action}</Typography>
                            <Typography>Date: {selectedLog.date}</Typography>
                            <Typography>User: {selectedLog.user}</Typography>
                            <Typography>Details: {selectedLog.details}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openFeedbackDialog} onClose={handleFeedbackDialogClose}>
                <DialogTitle>Provide Feedback</DialogTitle>
                <DialogContent>
                    <TextField
                        multiline
                        rows={4}
                        label="Your Feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFeedbackDialogClose}>Cancel</Button>
                    <Button onClick={handleFeedbackSubmit} color="primary">Submit</Button>
                </DialogActions>
            </Dialog>

            {feedbackSubmitted && (
                <Snackbar open={feedbackSubmitted} autoHideDuration={6000} onClose={() => setFeedbackSubmitted(false)}>
                    <MuiAlert onClose={() => setFeedbackSubmitted(false)} severity="success">
                        Feedback submitted successfully!
                    </MuiAlert>
                </Snackbar>
            )}
        </Container>
    );
};

const SecuritySettingsPage = () => (
    <SnackbarProvider maxSnack={3}>
        <SecuritySettings />
    </SnackbarProvider>
);

export default SecuritySettingsPage;

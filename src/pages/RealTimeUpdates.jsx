import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Grid, Box, Button, Snackbar, CircularProgress,
    IconButton, Tooltip, Divider, Tabs, Tab, Select, MenuItem, FormControl, InputLabel, TextField
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSnackbar } from 'notistack';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

// Initialize Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, ChartTooltip, Legend);

const RealTimeUpdates = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({});
    const [error, setError] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [filter, setFilter] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchData = () => {
            setTimeout(() => {
                setData(prevData => {
                    const newData = [...prevData, { time: new Date(), value: Math.random() * 100 }];
                    return newData.slice(-10); // Keep only the latest 10 data points
                });
                setLoading(false);
            }, 1000);
        };

        const intervalId = setInterval(fetchData, 3000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            const labels = data.map(d => d.time.toLocaleTimeString());
            const values = data.map(d => d.value);

            setChartData({
                labels: labels,
                datasets: [{
                    label: 'Drug Inventory Levels',
                    data: values,
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.2)',
                    fill: true,
                }]
            });
        }
    }, [data]);

    const handleAlert = (message) => {
        enqueueSnackbar(message, { variant: 'info' });
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleExpandChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Real-Time Updates
            </Typography>

            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="data view tabs">
                <Tab label="Chart View" />
                <Tab label="Recent Updates" />
                <Tab label="Data Filters" />
            </Tabs>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2} marginTop={2}>
                    {tabIndex === 0 && (
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ padding: 2 }}>
                                <Typography variant="h6">Real-Time Data Chart</Typography>
                                <Divider sx={{ marginY: 2 }} />
                                <Box sx={{ height: 400 }}>
                                    <Line
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
                                                            return `${context.label}: ${context.raw.toFixed(2)}`;
                                                        },
                                                    },
                                                },
                                            },
                                            scales: {
                                                x: {
                                                    title: {
                                                        display: true,
                                                        text: 'Time',
                                                    },
                                                    ticks: {
                                                        autoSkip: true,
                                                        maxTicksLimit: 10,
                                                    },
                                                },
                                                y: {
                                                    title: {
                                                        display: true,
                                                        text: 'Value',
                                                    },
                                                    min: 0,
                                                    max: 100,
                                                    ticks: {
                                                        stepSize: 10,
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    )}

                    {tabIndex === 1 && (
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ padding: 2 }}>
                                <Typography variant="h6">Recent Updates</Typography>
                                <Divider sx={{ marginY: 2 }} />
                                <Box>
                                    {data.map((item, index) => (
                                        <Accordion key={index} expanded={expanded === `panel${index}`} onChange={handleExpandChange(`panel${index}`)}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`panel${index}bh-content`}
                                                id={`panel${index}bh-header`}
                                            >
                                                <Typography>{item.time.toLocaleTimeString()}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>Value: {item.value.toFixed(2)}</Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>
                    )}

                    {tabIndex === 2 && (
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ padding: 2 }}>
                                <Typography variant="h6">Data Filters</Typography>
                                <Divider sx={{ marginY: 2 }} />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Filter By</InputLabel>
                                    <Select
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value="high">High Values</MenuItem>
                                        <MenuItem value="low">Low Values</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    fullWidth
                                    margin="normal"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="End Date"
                                    type="date"
                                    fullWidth
                                    margin="normal"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleAlert('Filters applied!')}
                                    >
                                        Apply Filters
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            )}

            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAlert('Real-time data refreshed!')}
                >
                    Refresh Data
                </Button>
            </Box>

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

export default RealTimeUpdates;

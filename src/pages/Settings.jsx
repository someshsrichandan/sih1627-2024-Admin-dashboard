import React, { useState } from 'react';
import {
    Container, Typography, TextField, Button, FormControl,
    InputLabel, Select, MenuItem, Switch, FormControlLabel,
    Tabs, Tab, Box, Slider, Checkbox, Grid, Paper, RadioGroup, Radio,
    Accordion, AccordionSummary, AccordionDetails, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

// TabPanel Component
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Settings = () => {
    const [tabIndex, setTabIndex] = useState(0);

    // State variables for settings
    const [language, setLanguage] = useState('English');
    const [darkMode, setDarkMode] = useState(false);
    const [notification, setNotification] = useState(true);
    const [threshold, setThreshold] = useState(10);
    const [themeColor, setThemeColor] = useState('default');
    const [showInventory, setShowInventory] = useState(true);
    const [userRole, setUserRole] = useState('Admin');
    const [alertFrequency, setAlertFrequency] = useState(30);
    const [fontSize, setFontSize] = useState(14);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [smsNotifications, setSmsNotifications] = useState(true);
    const [backupFrequency, setBackupFrequency] = useState('daily');

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleSave = () => {
        // Implement save logic (e.g., API call to save settings)
        console.log({
            language,
            darkMode,
            notification,
            threshold,
            themeColor,
            showInventory,
            userRole,
            alertFrequency,
            fontSize,
            emailNotifications,
            smsNotifications,
            backupFrequency
        });
        alert('Settings saved successfully!');
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    System Settings
                </Typography>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    aria-label="settings tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ marginBottom: 2 }}
                >
                    <Tab label="General" />
                    <Tab label="Appearance" />
                    <Tab label="Notifications" />
                    <Tab label="User Management" />
                    <Tab label="Advanced" />
                </Tabs>

                <TabPanel value={tabIndex} index={0}>
                    {/* General Settings */}
                    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                        <Typography variant="h6" gutterBottom>General Settings</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Language</InputLabel>
                            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                                <MenuItem value="English">English</MenuItem>
                                <MenuItem value="Hindi">Hindi</MenuItem>
                                <MenuItem value="Tamil">Tamil</MenuItem>
                                <MenuItem value="Telugu">Telugu</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Low Stock Threshold"
                                type="number"
                                value={threshold}
                                onChange={(e) => setThreshold(e.target.value)}
                            />
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showInventory}
                                    onChange={(e) => setShowInventory(e.target.checked)}
                                    name="showInventory"
                                    color="primary"
                                />
                            }
                            label="Show Inventory"
                        />
                    </Paper>
                </TabPanel>

                <TabPanel value={tabIndex} index={1}>
                    {/* Appearance Settings */}
                    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                        <Typography variant="h6" gutterBottom>Appearance Settings</Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={darkMode}
                                    onChange={(e) => setDarkMode(e.target.checked)}
                                    name="darkMode"
                                    color="primary"
                                />
                            }
                            label="Enable Dark Mode"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Theme Color</InputLabel>
                            <Select value={themeColor} onChange={(e) => setThemeColor(e.target.value)}>
                                <MenuItem value="default">Default</MenuItem>
                                <MenuItem value="blue">Blue</MenuItem>
                                <MenuItem value="green">Green</MenuItem>
                                <MenuItem value="red">Red</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography gutterBottom>Font Size</Typography>
                        <Slider
                            value={fontSize}
                            onChange={(e, value) => setFontSize(value)}
                            step={1}
                            min={10}
                            max={24}
                            valueLabelDisplay="auto"
                        />
                    </Paper>
                </TabPanel>

                <TabPanel value={tabIndex} index={2}>
                    {/* Notification Settings */}
                    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                        <Typography variant="h6" gutterBottom>Notification Settings</Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notification}
                                    onChange={(e) => setNotification(e.target.checked)}
                                    name="notification"
                                    color="primary"
                                />
                            }
                            label="Enable Notifications"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={emailNotifications}
                                    onChange={(e) => setEmailNotifications(e.target.checked)}
                                    name="emailNotifications"
                                    color="primary"
                                />
                            }
                            label="Enable Email Notifications"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={smsNotifications}
                                    onChange={(e) => setSmsNotifications(e.target.checked)}
                                    name="smsNotifications"
                                    color="primary"
                                />
                            }
                            label="Enable SMS Notifications"
                        />
                        <Typography gutterBottom>Alert Frequency (Minutes)</Typography>
                        <Slider
                            value={alertFrequency}
                            onChange={(e, value) => setAlertFrequency(value)}
                            step={5}
                            min={5}
                            max={120}
                            valueLabelDisplay="auto"
                        />
                    </Paper>
                </TabPanel>

                <TabPanel value={tabIndex} index={3}>
                    {/* User Management Settings */}
                    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                        <Typography variant="h6" gutterBottom>User Management</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>User Role</InputLabel>
                            <Select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Manager">Manager</MenuItem>
                                <MenuItem value="Viewer">Viewer</MenuItem>
                            </Select>
                        </FormControl>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Role Permissions</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControlLabel
                                    control={<Checkbox name="read" color="primary" />}
                                    label="Read Access"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="write" color="primary" />}
                                    label="Write Access"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="delete" color="primary" />}
                                    label="Delete Access"
                                />
                            </AccordionDetails>
                        </Accordion>
                    </Paper>
                </TabPanel>

                <TabPanel value={tabIndex} index={4}>
                    {/* Advanced Settings */}
                    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                        <Typography variant="h6" gutterBottom>Advanced Settings</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Backup Frequency</InputLabel>
                            <Select value={backupFrequency} onChange={(e) => setBackupFrequency(e.target.value)}>
                                <MenuItem value="daily">Daily</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                            </Select>
                        </FormControl>
                        <Divider sx={{ marginY: 2 }} />
                        <Button variant="outlined" color="secondary" onClick={() => alert('Backup now!')}>
                            Backup Now
                        </Button>
                    </Paper>
                </TabPanel>

                {/* Save Button */}
                <Grid container justifyContent="flex-end" sx={{ marginTop: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save Settings
                    </Button>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default Settings;
import React, { useState } from 'react';
import { 
  Container, Grid, Paper, Typography, Avatar, 
  Tabs, Tab, Box, List, ListItem, ListItemAvatar, 
  ListItemText, Divider, Button, Card, CardContent, 
  CardHeader, IconButton 
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MedicationIcon from '@mui/icons-material/Medication';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from @mui/x-data-grid

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

const UserProfile = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'drug', headerName: 'Drug Name', width: 130 },
    { field: 'quantity', headerName: 'Quantity', width: 130 },
    { field: 'lastUpdated', headerName: 'Last Updated', width: 180 },
  ];

  const rows = [
    { id: 1, drug: 'Paracetamol', quantity: 500, lastUpdated: '2024-08-25' },
    { id: 2, drug: 'Aspirin', quantity: 300, lastUpdated: '2024-08-24' },
    { id: 3, drug: 'Ibuprofen', quantity: 450, lastUpdated: '2024-08-23' },
  ];

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Grid container spacing={3}>
          {/* User Info Section */}
          <Grid item xs={12} sm={4}>
            <Avatar 
              sx={{ width: 100, height: 100, bgcolor: 'primary.main', margin: 'auto' }} 
              alt="User Profile"
            >
              <AccountCircleIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h5" align="center" gutterBottom>
              John Doe
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              johndoe@example.com
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              Pharmacist
            </Typography>
            <Box sx={{ textAlign: 'center', marginTop: '1rem' }}>
              <Button variant="outlined" startIcon={<EditIcon />}>
                Edit Profile
              </Button>
            </Box>
          </Grid>

          {/* Key Metrics Section */}
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardHeader
                    avatar={<TrendingUpIcon />}
                    title="Drugs in Stock"
                  />
                  <CardContent>
                    <Typography variant="h4" component="div">
                      1,250
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardHeader
                    avatar={<AssessmentIcon />}
                    title="Orders Processed"
                  />
                  <CardContent>
                    <Typography variant="h4" component="div">
                      320
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Tabs for Navigation */}
          <Grid item xs={12}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="profile tabs"
              variant="fullWidth"
              centered
            >
              <Tab label="Activity" />
              <Tab label="Inventory" />
              <Tab label="Settings" />
            </Tabs>
          </Grid>

          {/* Tab Panels */}
          <Grid item xs={12}>
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <MedicationIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Restocked Paracetamol"
                    secondary="2 days ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <MedicationIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Updated Inventory for Aspirin"
                    secondary="4 days ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <MedicationIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Reviewed Drug Supply Chain"
                    secondary="1 week ago"
                  />
                </ListItem>
              </List>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Inventory Details
              </Typography>
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={5} />
              </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Account Settings
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<SettingsIcon />}
                fullWidth
                sx={{ marginBottom: '1rem' }}
              >
                Edit Account Settings
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<SettingsIcon />}
                fullWidth
                sx={{ marginBottom: '1rem' }}
              >
                Manage Notification Preferences
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<SettingsIcon />}
                fullWidth
                sx={{ marginBottom: '1rem' }}
              >
                Privacy Settings
              </Button>
            </TabPanel>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfile;

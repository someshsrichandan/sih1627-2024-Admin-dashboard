// src/components/Dashboard/DistributionTracking.jsx
import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, LinearProgress } from '@mui/material';
import { Map, Marker } from 'react-simple-maps'; // You can use a suitable map library like 'react-simple-maps'

const DistributionTracking = () => {
  // Mock data for distribution tracking
  const distributionData = [
    { location: 'New York, NY', status: 'In Transit', progress: 50 },
    { location: 'Los Angeles, CA', status: 'Delivered', progress: 100 },
    { location: 'Chicago, IL', status: 'Pending', progress: 20 },
  ];

  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Typography variant="h6">Distribution Tracking</Typography>
      <Box sx={{ marginTop: 2 }}>
        {/* Example Map Component */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="subtitle1">Distribution Map</Typography>
          {/* This is a placeholder map component; you can replace it with a real map */}
          <Map
            width={300}
            height={150}
            projectionConfig={{ scale: 400 }}
            style={{ width: '100%', height: 'auto' }}
          >
            {distributionData.map((center, index) => (
              <Marker key={index} coordinates={[-74.006, 40.7128]}>
                <circle r={5} fill="#F00" stroke="#fff" strokeWidth={2} />
                <text
                  textAnchor="middle"
                  y={-10}
                  style={{ fontFamily: 'system-ui', fill: '#5D5A6D', fontSize: 10 }}
                >
                  {center.location}
                </text>
              </Marker>
            ))}
          </Map>
        </Box>

        {/* List of distribution centers with status */}
        <List>
          {distributionData.map((center, index) => (
            <ListItem key={index} sx={{ marginBottom: 2 }}>
              <ListItemText
                primary={center.location}
                secondary={`Status: ${center.status}`}
              />
              <Box sx={{ width: '100%', marginTop: 1 }}>
                <LinearProgress variant="determinate" value={center.progress} />
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default DistributionTracking;

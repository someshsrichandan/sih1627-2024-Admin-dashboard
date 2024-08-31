// components/Dashboard/DistributionMap.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DistributionMap = () => {
  const locations = [
    { id: 1, name: 'Warehouse A', position: [51.505, -0.09] },
    { id: 2, name: 'Pharmacy B', position: [51.515, -0.1] },
  ];

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Distribution Map
      </Typography>
      <Paper elevation={3} sx={{ height: '400px', overflow: 'hidden' }}>
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((location) => (
            <Marker key={location.id} position={location.position}>
              <Popup>{location.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </Paper>
    </Box>
  );
};

export default DistributionMap;

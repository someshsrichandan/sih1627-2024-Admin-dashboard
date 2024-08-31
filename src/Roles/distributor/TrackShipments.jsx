// components/TrackShipments.jsx
import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { SyncOutlined } from '@mui/icons-material';

const TrackShipments = () => {
  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Track Shipments
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shipment ID</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">ETA</TableCell>
              <TableCell align="right">Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map through shipment data */}
            <TableRow>
              <TableCell>SHIP12345</TableCell>
              <TableCell align="right"><Chip icon={<SyncOutlined />} label="In Transit" color="primary" /></TableCell>
              <TableCell align="right">2 Days</TableCell>
              <TableCell align="right">Warehouse 3</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TrackShipments;

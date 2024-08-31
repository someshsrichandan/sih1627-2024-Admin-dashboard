// components/Dashboard/Charts.jsx
import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const inventoryData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Inventory Levels',
      data: [30, 45, 60, 40, 70, 80],
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      tension: 0.4,
      fill: true,
    },
  ],
};

const orderTrendsData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Orders Completed',
      data: [15, 20, 35, 40],
      backgroundColor: 'rgba(255,99,132,0.4)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
    },
  ],
};

const Charts = () => {
  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Inventory and Order Trends
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Line data={inventoryData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Bar data={orderTrendsData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Charts;

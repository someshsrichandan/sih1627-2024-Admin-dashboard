import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  TableSortLabel,
  TablePagination,
  Tooltip,
  Autocomplete,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ExpandMoreIcon
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const categories = ['Category 1', 'Category 2', 'Category 3'];

const EmergencyCare = () => {
  const [drugs, setDrugs] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDrugIndex, setSelectedDrugIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleAddDrug = () => {
    if (name && quantity) {
      setLoading(true);
      setTimeout(() => { // Simulate async operation
        setDrugs([...drugs, { name, quantity, category: selectedCategory }]);
        setName('');
        setQuantity('');
        setSelectedCategory('');
        setSnackbarMessage('Drug added successfully');
        setSnackbarOpen(true);
        setLoading(false);
      }, 1000);
    } else {
      setSnackbarMessage('Please fill out all fields');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteDrug = () => {
    if (selectedDrugIndex !== null) {
      setDrugs(drugs.filter((_, index) => index !== selectedDrugIndex));
      setOpenDialog(false);
      setSnackbarMessage('Drug deleted successfully');
      setSnackbarOpen(true);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleCategoryChange = (event, value) => {
    setSelectedCategory(value);
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === 'asc';
    setOrder(isAscending ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filteredDrugs = drugs.filter(drug =>
    drug.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedCategory ? drug.category === selectedCategory : true)
  );

  const sortedDrugs = filteredDrugs.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const paginatedDrugs = sortedDrugs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Emergency Drug Inventory
      </Typography>

      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            disablePortal
            options={categories}
            value={selectedCategory}
            onChange={handleCategoryChange}
            renderInput={(params) => <TextField {...params} label="Category" />}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Drug Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddDrug}
        startIcon={<AddIcon />}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Drug'}
      </Button>

      <TextField
        label="Search"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
        marginTop={2}
      />

      <TableContainer component={Paper} marginTop={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Drug Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'quantity'}
                  direction={orderBy === 'quantity' ? order : 'asc'}
                  onClick={() => handleRequestSort('quantity')}
                >
                  Quantity
                </TableSortLabel>
              </TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDrugs.length > 0 ? (
              paginatedDrugs.map((drug, index) => (
                <TableRow key={index}>
                  <TableCell>{drug.name}</TableCell>
                  <TableCell>{drug.quantity}</TableCell>
                  <TableCell>{drug.category}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => {
                          setSelectedDrugIndex(index);
                          // Implement edit functionality if needed
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => {
                          setSelectedDrugIndex(index);
                          setOpenDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {loading ? <CircularProgress /> : 'No drugs available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredDrugs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this drug?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteDrug} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {paginatedDrugs.length > 0 && (
        <Grid container spacing={2} marginTop={2}>
          {paginatedDrugs.map((drug, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardHeader title={drug.name} subheader={`Category: ${drug.category}`} />
                <CardContent>
                  <Typography variant="body2">Quantity: {drug.quantity}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default EmergencyCare;

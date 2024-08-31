import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
  Avatar,
  Chip,
  Switch,
  FormControlLabel,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import KanbanIcon from '@mui/icons-material/ViewKanban';
import MuiAlert from '@mui/material/Alert';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'; // Import DatePicker here
import { Virtuoso } from 'react-virtuoso';
import { useTheme } from '@mui/material/styles';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';

const TaskManagement = () => {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [kanbanView, setKanbanView] = useState(false);
  const [progressFilter, setProgressFilter] = useState([0, 100]);

  useEffect(() => {
    // Fetch initial task data from the server
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks'); // Replace with your actual API endpoint
        const data = await response.json();
        setTasks(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        setLoading(false);
      }
    };

    fetchTasks();

    // WebSocket setup for real-time updates
    // const ws = new WebSocket('ws://your-websocket-url');
    // ws.onmessage = (event) => {
    //   const newTask = JSON.parse(event.data);
    //   setTasks((prevTasks) => [newTask, ...prevTasks]);
    // };

    // return () => ws.close(); // Cleanup on component unmount
  }, []);

  const handleAddTask = () => {
    const newTaskObject = {
      id: tasks.length + 1,
      text: newTask,
      status: 'Pending',
      priority: 'Medium',
      assignee: 'Unassigned',
      dueDate: null,
      progress: 0,
      comments: [],
    };
    setTasks([...tasks, newTaskObject]);
    setNewTask('');
    setNotificationMessage('Task added successfully');
    setOpenSnackbar(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleSaveTask = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === selectedTask.id ? selectedTask : task))
    );
    setSelectedTask(null);
    setOpenDialog(false);
    setNotificationMessage('Task updated successfully');
    setOpenSnackbar(true);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    setNotificationMessage('Task deleted successfully');
    setOpenSnackbar(true);
  };

  const handleTaskProgressChange = (taskId, progress) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, progress } : task))
    );
  };

  const handleFilterChange = () => {
    let filteredTasks = tasks;

    if (statusFilter) {
      filteredTasks = filteredTasks.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter) {
      filteredTasks = filteredTasks.filter((task) => task.priority === priorityFilter);
    }

    if (assigneeFilter) {
      filteredTasks = filteredTasks.filter((task) => task.assignee.includes(assigneeFilter));
    }

    if (dueDateFilter) {
      filteredTasks = filteredTasks.filter(
        (task) => new Date(task.dueDate) <= new Date(dueDateFilter)
      );
    }

    filteredTasks = filteredTasks.filter(
      (task) => task.progress >= progressFilter[0] && task.progress <= progressFilter[1]
    );

    return filteredTasks;
  };

  const filteredTasks = handleFilterChange();

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const handleKanbanToggle = () => {
    setKanbanView((prev) => !prev);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTasks = Array.from(tasks);
    const [reorderedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, reorderedTask);

    setTasks(updatedTasks);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          Task Management
        </Typography>
        <Box>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={handleDarkModeToggle} />}
            label="Dark Mode"
          />
          <Tooltip title="Toggle Kanban View">
            <IconButton onClick={handleKanbanToggle}>
              <KanbanIcon color={kanbanView ? 'primary' : 'action'} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="New Task"
            variant="outlined"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddTask}
            fullWidth
          >
            Add Task
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              label="Priority"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Assignee"
            variant="outlined"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={dueDateFilter}
              onChange={(date) => setDueDateFilter(date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {kanbanView ? (
        // Kanban View
        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={2} mt={3}>
            {['Pending', 'In Progress', 'Completed'].map((status) => (
              <Grid item xs={12} sm={4} key={status}>
                <Typography variant="h6">{status}</Typography>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        minHeight: 300,
                        padding: 2,
                        backgroundColor: darkMode ? '#333' : '#fff',
                      }}
                    >
                      {filteredTasks
                        .filter((task) => task.status === status)
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  padding: 2,
                                  marginBottom: 1,
                                  borderRadius: 1,
                                  backgroundColor: '#f5f5f5',
                                  border: '1px solid #ddd',
                                  boxShadow: 1,
                                }}
                              >
                                <Typography variant="subtitle1">{task.text}</Typography>
                                <Chip
                                  label={task.priority}
                                  color={
                                    task.priority === 'High'
                                      ? 'error'
                                      : task.priority === 'Medium'
                                      ? 'warning'
                                      : 'default'
                                  }
                                  size="small"
                                  sx={{ marginTop: 1 }}
                                />
                                <LinearProgress
                                  variant="determinate"
                                  value={task.progress}
                                  sx={{ marginTop: 1 }}
                                />
                              </Box>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Grid>
            ))}
          </Grid>
        </DragDropContext>
      ) : (
        // List View
        <List>
          <Virtuoso
            data={filteredTasks}
            itemContent={(index, task) => (
              <React.Fragment key={task.id}>
                <ListItem>
                  <Avatar sx={{ bgcolor: '#1976d2', marginRight: 2 }}>{task.text.charAt(0)}</Avatar>
                  <ListItemText
                    primary={task.text}
                    secondary={
                      <>
                        Status: {task.status} | Priority: {task.priority} | Assignee: {task.assignee} | Due:{' '}
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
                        <LinearProgress
                          variant="determinate"
                          value={task.progress}
                          sx={{ marginTop: 1 }}
                        />
                      </>
                    }
                  />
                  <IconButton onClick={() => handleEditTask(task)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTask(task.id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            )}
          />
        </List>
      )}

      {/* Edit Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Name"
            variant="outlined"
            value={selectedTask?.text || ''}
            onChange={(e) =>
              setSelectedTask((prev) => ({ ...prev, text: e.target.value }))
            }
            fullWidth
            margin="dense"
          />
          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedTask?.status || ''}
              onChange={(e) =>
                setSelectedTask((prev) => ({ ...prev, status: e.target.value }))
              }
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              value={selectedTask?.priority || ''}
              onChange={(e) =>
                setSelectedTask((prev) => ({ ...prev, priority: e.target.value }))
              }
              label="Priority"
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Assignee"
            variant="outlined"
            value={selectedTask?.assignee || ''}
            onChange={(e) =>
              setSelectedTask((prev) => ({ ...prev, assignee: e.target.value }))
            }
            fullWidth
            margin="dense"
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={selectedTask?.dueDate || null}
              onChange={(date) =>
                setSelectedTask((prev) => ({ ...prev, dueDate: date }))
              }
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
          </LocalizationProvider>
          <TextField
            label="Progress"
            type="number"
            variant="outlined"
            value={selectedTask?.progress || 0}
            onChange={(e) =>
              setSelectedTask((prev) => ({
                ...prev,
                progress: parseInt(e.target.value, 10),
              }))
            }
            fullWidth
            margin="dense"
            InputProps={{ inputProps: { min: 0, max: 100 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveTask} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {notificationMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default TaskManagement;

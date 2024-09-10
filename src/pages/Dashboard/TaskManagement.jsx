// src/components/Dashboard/TaskManagement.jsx
import React, { useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, IconButton, TextField, Button } from '@mui/material';
import { CheckCircle, Delete } from '@mui/icons-material';

const TaskManagement = () => {
  // State to manage tasks
  const [tasks, setTasks] = useState([
    { id: 1, description: 'Check inventory levels', completed: false },
    { id: 2, description: 'Process pending orders', completed: false },
    { id: 3, description: 'Update distribution status', completed: true },
  ]);
  const [newTask, setNewTask] = useState('');

  // Function to add a new task
  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: tasks.length + 1, description: newTask, completed: false }]);
      setNewTask('');
    }
  };

  // Function to toggle task completion
  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  // Function to delete a task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Typography variant="h6">Task Management</Typography>
      <Box sx={{ marginTop: 2 }}>
        {/* Task input field */}
        <Box sx={{ display: 'flex', marginBottom: 2 }}>
          <TextField
            label="New Task"
            variant="outlined"
            size="small"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            sx={{ flexGrow: 1, marginRight: 1 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddTask}>
            Add
          </Button>
        </Box>

        {/* Task list */}
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="complete" onClick={() => handleToggleComplete(task.id)}>
                    <CheckCircle color={task.completed ? 'success' : 'disabled'} />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)}>
                    <Delete color="error" />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={task.description}
                secondary={task.completed ? 'Completed' : 'Pending'}
                sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default TaskManagement;

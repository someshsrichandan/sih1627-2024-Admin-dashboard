// components/Dashboard/TaskBoard.jsx
import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialTasks = {
  todo: [{ id: '1', content: 'Review stock levels' }, { id: '2', content: 'Contact supplier' }],
  inProgress: [{ id: '3', content: 'Prepare shipment' }],
  done: [{ id: '4', content: 'Update inventory database' }],
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [open, setOpen] = useState(false);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceClone = Array.from(tasks[source.droppableId]);
    const destClone = Array.from(tasks[destination.droppableId]);
    const [removed] = sourceClone.splice(source.index, 1);

    destClone.splice(destination.index, 0, removed);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceClone,
      [destination.droppableId]: destClone,
    });
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Task Board
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setOpen(true)}>
        Add New Task
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Task Name" variant="outlined" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={3}>
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <Grid item xs={12} md={4} key={columnId}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {columnId.toUpperCase()}
                </Typography>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                p: 1,
                                mb: 1,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                                boxShadow: 1,
                              }}
                            >
                              {task.content}
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
    </Box>
  );
};

export default TaskBoard;

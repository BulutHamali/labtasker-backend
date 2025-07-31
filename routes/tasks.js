import express from 'express';
import Task from '../models/Task.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all tasks for a project
router.get('/:projectId/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId }).sort({ order: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});



// Bulk reorder for drag-and-drop (place first to take precedence)
router.put('/:projectId/tasks/reorder', authMiddleware, async (req, res) => {
  console.log('Entered /:projectId/tasks/reorder route');
  console.log('Request proceeding after authMiddleware:', { user: req.user, body: req.body });
  const { updates } = req.body;
  if (!updates || !Array.isArray(updates)) {
    return res.status(400).json({ error: 'Invalid updates array' });
  }
  try {
    const results = await Promise.all(
      updates.map(({ taskId, status, order }) => {
        console.log(`Updating task ${taskId} with status ${status}, order ${order}`);
        return Task.findOneAndUpdate(
          { _id: taskId, projectId: req.params.projectId },
          { status, order: order || 0 },
          { new: true, runValidators: true, upsert: false }
        );
      })
    );
    const failedUpdates = results.filter(result => !result);
    if (failedUpdates.length > 0) {
      return res.status(404).json({ error: 'One or more tasks not found' });
    }
    console.log('Reorder successful:', results);
    res.json({ message: 'Reordered successfully' });
  } catch (err) {
    console.error('Reorder error details:', err);
    res.status(500).json({ error: `Failed to reorder tasks: ${err.name}: ${err.message}` });
  }
});

// Update a task (edit, mark complete, reorder, etc.) (place second)
router.put('/:projectId/tasks/:taskId', authMiddleware, async (req, res) => {
  // Validate taskId as a 24-character hex string (MongoDB ObjectId pattern)
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.taskId)) {
    return res.status(400).json({ error: 'Invalid taskId format' });
  }
  const { name, dueDate, completed, status, order } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, projectId: req.params.projectId },
      { name, dueDate, completed, status, order },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Create a task
router.post('/:projectId/tasks', authMiddleware, async (req, res) => {
  const { name, dueDate } = req.body;
  try {
    const taskCount = await Task.countDocuments({ projectId: req.params.projectId });
    const task = new Task({
      projectId: req.params.projectId,
      name,
      dueDate,
      status: 'To Do',
      completed: false,
      order: taskCount, // put new task at end
    });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});


// Delete a task (must match project)
router.delete('/:projectId/tasks/:taskId', authMiddleware, async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.taskId,
      projectId: req.params.projectId,
    });
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;

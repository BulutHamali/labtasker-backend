import express from 'express';
import Task from '../models/Task.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get tasks for a project
router.get('/:projectId/tasks', authMiddleware, async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.projectId });
  res.json(tasks);
});

// Create task
router.post('/:projectId/tasks', authMiddleware, async (req, res) => {
  const { name, dueDate } = req.body;
  const task = new Task({ projectId: req.params.projectId, name, dueDate });
  await task.save();
  res.json(task);
});

// Update task
router.put('/tasks/:taskId', authMiddleware, async (req, res) => {
  const { name, completed, dueDate } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.params.taskId,
    { name, completed, dueDate },
    { new: true }
  );
  res.json(task);
});

// Delete task
router.delete('/tasks/:taskId', authMiddleware, async (req, res) => {
  await Task.findByIdAndDelete(req.params.taskId);
  res.json({ message: 'Task deleted' });
});

export default router;
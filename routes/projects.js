import express from 'express';
import Project from '../models/Project.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all projects for a user
router.get('/', authMiddleware, async (req, res) => {
  const projects = await Project.find({ userId: req.user });
  res.json(projects);
});

// Create project
router.post('/', authMiddleware, async (req, res) => {
  const { name, description } = req.body;
  const project = new Project({ userId: req.user, name, description });
  await project.save();
  res.json(project);
});

// Update project
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, userId: req.user },
    { name, description },
    { new: true }
  );
  res.json(project);
});

// Delete project
router.delete('/:id', authMiddleware, async (req, res) => {
  await Project.findOneAndDelete({ _id: req.params.id, userId: req.user });
  res.json({ message: 'Project deleted' });
});

export default router;
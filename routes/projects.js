import express from "express";
import Project from "../models/Project.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all projects for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  const projects = await Project.find({ userId: req.user.id });
  res.json(projects);
});

// Create a project
router.post("/", authMiddleware, async (req, res) => {
  const { name, description } = req.body;

  try {
    const project = new Project({
      userId: req.user.id, // <-- attach owner!
      name,
      description,
    });
    await project.save();
    res.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});


// Get a single project (must own it)
router.get("/:id", authMiddleware, async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

// Update project (must own it)
router.put("/:id", authMiddleware, async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { name, description },
    { new: true }
  );
  if (!project) return res.status(404).json({ error: "Project not found or unauthorized" });
  res.json(project);
});

// Delete project (must own it)
router.delete("/:id", authMiddleware, async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!project) return res.status(404).json({ error: "Project not found or unauthorized" });
  res.json({ message: "Project deleted" });
});

export default router;

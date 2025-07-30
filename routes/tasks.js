import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get tasks for a project (with validation)
router.get("/:projectId/tasks", authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    return res.status(400).json({ error: "Project ID is required" });
  }
  try {
    const tasks = await Task.find({ projectId });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Create task (with validation)
router.post("/:projectId/tasks", authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const { name, dueDate } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: "Project ID is required" });
  }
  if (!name) {
    return res.status(400).json({ error: "Task name is required" });
  }

  try {
    const task = new Task({ projectId, name, dueDate });
    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Update task
router.put("/tasks/:taskId", authMiddleware, async (req, res) => {
  const { name, completed, dueDate } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { name, completed, dueDate },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
router.delete("/tasks/:taskId", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;

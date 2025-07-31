import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Done'], // Kanban-style statuses
      default: 'To Do',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number, // For drag-and-drop ordering
      default: 0,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;

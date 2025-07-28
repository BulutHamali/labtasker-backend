import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date }
});

export default mongoose.model('Task', TaskSchema);
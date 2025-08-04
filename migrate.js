import 'dotenv/config';
import mongoose from 'mongoose';
import Project from './models/Project.js';

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const projects = await Project.find();
    for (let project of projects) {
      if (project.userId) {
        project.owner = project.userId;
        delete project.userId;
        await project.save();
        console.log(`Migrated project ${project._id}`);
      }
    }
    console.log('Migration complete');
    mongoose.connection.close();
  })
  .catch(err => console.error('Migration failed:', err));
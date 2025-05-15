import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  technologies: [{
    type: String,
  }],
  githubLink: {
    type: String,
  },
  liveLink: {
    type: String,
  },
  image: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project; 
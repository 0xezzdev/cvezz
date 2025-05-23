import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'responded'],
    default: 'pending',
  },
  response: {
    type: String,
  },
  respondedAt: {
    type: Date,
  }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact; 
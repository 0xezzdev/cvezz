import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'عنوان الشهادة مطلوب'],
    trim: true
  },
  issuer: {
    type: String,
    required: [true, 'جهة إصدار الشهادة مطلوبة'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'تاريخ الشهادة مطلوب']
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate; 
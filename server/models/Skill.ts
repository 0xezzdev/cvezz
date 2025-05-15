import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  category: {
    type: String,
    required: true,
    enum: ['برمجة', 'تصميم', 'قواعد بيانات', 'تطوير واجهات', 'تطوير تطبيقات', 'أخرى'],
    default: 'أخرى'
  },
  image: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill; 
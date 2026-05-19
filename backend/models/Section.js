import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  order: { type: Number, default: 0 },
  lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
}, { timestamps: true });

export default mongoose.model('Section', sectionSchema);

import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  video: { type: String, default: '' },
  pdf: { type: String, default: '' },
  description: { type: String, default: '' },
  sequenceNumber: { type: Number, default: 0 },
  duration: { type: String, default: '' },
  isFreePreview: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Lecture', lectureSchema);

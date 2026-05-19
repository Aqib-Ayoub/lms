import Lecture from '../models/Lecture.js';
import Section from '../models/Section.js';
import Course from '../models/Course.js';

// POST /api/lectures/section — create section
export const createSection = async (req, res) => {
  try {
    const { title, courseId, order } = req.body;
    const section = await Section.create({ title, course: courseId, order: order || 0 });
    await Course.findByIdAndUpdate(courseId, { $push: { sections: section._id } });
    res.status(201).json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/lectures/section/:id — update section
export const updateSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/lectures/section/:id
export const deleteSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    await Course.findByIdAndUpdate(section.course, { $pull: { sections: section._id } });
    await section.deleteOne();
    res.json({ message: 'Section deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/lectures/section/:sectionId — add lecture
export const addLecture = async (req, res) => {
  try {
    const { title, description, sequenceNumber, duration, isFreePreview } = req.body;
    const section = await Section.findById(req.params.sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    const video = req.files?.video ? `/uploads/${req.files.video[0].filename}` : '';
    const pdf   = req.files?.pdf   ? `/uploads/${req.files.pdf[0].filename}`   : '';

    const lecture = await Lecture.create({
      title, description, sequenceNumber: Number(sequenceNumber) || section.lectures.length,
      duration, video, pdf,
      section: section._id,
      isFreePreview: isFreePreview === 'true',
    });

    section.lectures.push(lecture._id);
    await section.save();
    res.status(201).json(lecture);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/lectures/:id
export const updateLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lecture);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/lectures/:id
export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
    await Section.findByIdAndUpdate(lecture.section, { $pull: { lectures: lecture._id } });
    await lecture.deleteOne();
    res.json({ message: 'Lecture deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

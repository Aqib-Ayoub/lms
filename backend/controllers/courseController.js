import Course from '../models/Course.js';
import User from '../models/User.js';
import Section from '../models/Section.js';

// GET /api/courses
export const getAllCourses = async (req, res) => {
  try {
    const { category, search, level } = req.query;
    let filter = { isPublished: true };
    if (category && category !== 'All') filter.category = category;
    if (level && level !== 'All') filter.level = level;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const courses = await Course.find(filter)
      .populate('instructor', 'name profileImage')
      .select('-sections')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/courses/:id
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name bio profileImage createdCourses')
      .populate({ path: 'sections', options: { sort: { order: 1 } }, populate: { path: 'lectures', options: { sort: { sequenceNumber: 1 } } } });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/courses
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, level, duration } = req.body;
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : '';
    const course = await Course.create({
      title, description, category, price: Number(price),
      level, duration, thumbnail, instructor: req.user._id,
    });
    await User.findByIdAndUpdate(req.user._id, { $push: { createdCourses: course._id } });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/courses/:id
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const thumbnail = req.file ? `/uploads/${req.file.filename}` : course.thumbnail;
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, thumbnail },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/courses/:id
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await course.deleteOne();
    await User.findByIdAndUpdate(req.user._id, { $pull: { createdCourses: course._id } });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/courses/instructor/my
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate({ path: 'sections', populate: { path: 'lectures' } })
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';

// POST /api/enrollments/buy/:courseId
export const buyCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.user._id;

    const existing = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existing) return res.status(400).json({ message: 'Already enrolled in this course' });

    const enrollment = await Enrollment.create({ student: studentId, course: courseId });

    await User.findByIdAndUpdate(studentId, { $push: { purchasedCourses: courseId } });
    await Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });
    await Progress.create({ student: studentId, course: courseId });

    res.status(201).json({ message: 'Enrolled successfully!', enrollment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/enrollments/my
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name profileImage' },
      });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/enrollments/check/:courseId
export const checkEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });
    res.json({ enrolled: !!enrollment, enrollment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import Progress from '../models/Progress.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// POST /api/progress/mark
export const markLectureCompleted = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const studentId = req.user._id;

    let progress = await Progress.findOne({ student: studentId, course: courseId });
    if (!progress) {
      progress = await Progress.create({ student: studentId, course: courseId });
    }

    if (!progress.completedLectures.map(String).includes(String(lectureId))) {
      progress.completedLectures.push(lectureId);
    }

    progress.lastWatchedLecture = lectureId;
    progress.lastUpdated = Date.now();

    // Calculate percentage
    const course = await Course.findById(courseId).populate({
      path: 'sections',
      populate: { path: 'lectures', select: '_id' },
    });
    const allLectures = course.sections.flatMap(s => s.lectures.map(l => l._id.toString()));
    progress.percentage = allLectures.length
      ? Math.round((progress.completedLectures.length / allLectures.length) * 100)
      : 0;

    if (progress.percentage === 100) {
      await Enrollment.findOneAndUpdate(
        { student: studentId, course: courseId },
        { completionStatus: 'completed', certificateIssued: true }
      );
    } else if (progress.percentage > 0) {
      await Enrollment.findOneAndUpdate(
        { student: studentId, course: courseId },
        { completionStatus: 'in-progress' }
      );
    }

    await progress.save();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/progress/:courseId
export const getCourseProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      student: req.user._id,
      course: req.params.courseId,
    }).populate('lastWatchedLecture');
    if (!progress) return res.json({ completedLectures: [], percentage: 0, lastWatchedLecture: null });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/progress/all — all course progresses for a student
export const getAllProgress = async (req, res) => {
  try {
    const progresses = await Progress.find({ student: req.user._id })
      .populate('course', 'title thumbnail');
    res.json(progresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

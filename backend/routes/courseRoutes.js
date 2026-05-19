import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAllCourses, getCourse, createCourse,
  updateCourse, deleteCourse, getInstructorCourses,
} from '../controllers/courseController.js';
import protect from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.random().toString(36).slice(2) + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Must come before /:id to avoid conflict
router.get('/instructor/my', protect, authorizeRole('instructor'), getInstructorCourses);

router.get('/', getAllCourses);
router.get('/:id', getCourse);
router.post('/', protect, authorizeRole('instructor'), upload.single('thumbnail'), createCourse);
router.put('/:id', protect, authorizeRole('instructor'), upload.single('thumbnail'), updateCourse);
router.delete('/:id', protect, authorizeRole('instructor'), deleteCourse);

export default router;

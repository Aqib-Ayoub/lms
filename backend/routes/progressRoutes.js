import express from 'express';
import { markLectureCompleted, getCourseProgress, getAllProgress } from '../controllers/progressController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/mark', protect, markLectureCompleted);
router.get('/all', protect, getAllProgress);
router.get('/:courseId', protect, getCourseProgress);

export default router;

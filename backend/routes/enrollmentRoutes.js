import express from 'express';
import { buyCourse, getMyEnrollments, checkEnrollment } from '../controllers/enrollmentController.js';
import protect from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/buy/:courseId', protect, authorizeRole('student'), buyCourse);
router.get('/my', protect, getMyEnrollments);
router.get('/check/:courseId', protect, checkEnrollment);

export default router;

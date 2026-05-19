import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  addLecture, updateLecture, deleteLecture,
  createSection, updateSection, deleteSection,
} from '../controllers/lectureController.js';
import protect from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.random().toString(36).slice(2) + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } }).fields([
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]);

router.post('/section', protect, authorizeRole('instructor'), createSection);
router.put('/section/:id', protect, authorizeRole('instructor'), updateSection);
router.delete('/section/:id', protect, authorizeRole('instructor'), deleteSection);
router.post('/section/:sectionId', protect, authorizeRole('instructor'), upload, addLecture);
router.put('/:id', protect, authorizeRole('instructor'), updateLecture);
router.delete('/:id', protect, authorizeRole('instructor'), deleteLecture);

export default router;

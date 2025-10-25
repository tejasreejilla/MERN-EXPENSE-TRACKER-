import express from 'express';
import {
  createFeedback,
  getUserFeedback,
  getAllFeedback,
  deleteFeedback,
} from '../controllers/feedbackController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createFeedback);
router.get('/user', protect, getUserFeedback);
router.get('/all', protect, getAllFeedback);
router.delete('/:id', protect, deleteFeedback);

export default router;

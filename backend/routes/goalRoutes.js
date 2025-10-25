import express from 'express';
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  addToGoal,
} from '../controllers/goalController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getGoals).post(createGoal);
router.route('/:id').put(updateGoal).delete(deleteGoal);
router.route('/:id/add').post(addToGoal);

export default router;

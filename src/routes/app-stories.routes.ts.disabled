import { Router } from 'express';
import { authenticate, authorize } from '../middleware';
import {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  toggleStoryStatus
} from '../controllers/app-stories.controller';

const router = Router();

// Public routes - get active stories for mobile app
router.get('/', getStories);
router.get('/:id', getStoryById);

// Admin only routes
router.post('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), createStory);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), updateStory);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), deleteStory);
router.patch('/:id/toggle', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), toggleStoryStatus);

export default router;

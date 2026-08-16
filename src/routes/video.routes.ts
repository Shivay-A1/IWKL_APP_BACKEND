import { Router } from 'express';
import { body } from 'express-validator';
import * as videoController from '../controllers/video.controller';
import { authenticate, authorize, validate, uploadMultiple, apiLimiter } from '../middleware';

const router = Router();

// Public GET endpoints - no authentication required
router.get('/', videoController.getVideos);
router.get('/featured', videoController.getFeaturedVideos);
router.get('/homepage', videoController.getHomepageVideos);
router.get('/:id', videoController.getVideoById);

// Protected routes - require authentication and authorization
router.post('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, uploadMultiple('files', 2), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').notEmpty().withMessage('Category is required'),
], validate, videoController.createVideo);

router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), uploadMultiple('files', 2), [
  body('title').optional().trim().notEmpty(),
], validate, videoController.updateVideo);

router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), videoController.deleteVideo);

export default router;

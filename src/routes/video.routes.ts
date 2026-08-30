import { Router } from 'express';
import { body } from 'express-validator';
import * as videoController from '../controllers/video.controller';
import { validate, uploadMultiple, apiLimiter } from '../middleware';

const router = Router();

// Public GET endpoints - no authentication required
router.get('/', videoController.getVideos);
router.get('/featured', videoController.getFeaturedVideos);
router.get('/homepage', videoController.getHomepageVideos);
router.get('/:id', videoController.getVideoById);

// All routes - authentication removed for now
router.post('/', apiLimiter, uploadMultiple('files', 2), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').notEmpty().withMessage('Category is required'),
], validate, videoController.createVideo);

router.put('/:id', uploadMultiple('files', 2), [
  body('title').optional().trim().notEmpty(),
], validate, videoController.updateVideo);

router.delete('/:id', videoController.deleteVideo);

export default router;

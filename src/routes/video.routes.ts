import { Router } from 'express';
import { body } from 'express-validator';
import * as videoController from '../controllers/video.controller';
import { validate, uploadMultiple, uploadMultipleVideoMemory, apiLimiter } from '../middleware';

const router = Router();

// Public GET endpoints - no authentication required
router.get('/', videoController.getVideos);
router.get('/featured', videoController.getFeaturedVideos);
router.get('/homepage', videoController.getHomepageVideos);
router.get('/:id', videoController.getVideoById);

// All routes - authentication removed for now
// POST - Handle both YouTube URL and file upload (with 1GB limit)
// Use optional file upload to support both modes
router.post('/', apiLimiter, uploadMultipleVideoMemory('files', 2), [
  body('title').trim().notEmpty().withMessage('Title is required'),
], validate, videoController.createVideo);

router.put('/:id', uploadMultipleVideoMemory('files', 2), [
  body('title').optional().trim().notEmpty(),
], validate, videoController.updateVideo);

router.patch('/:id', videoController.updateVideo);

router.delete('/:id', videoController.deleteVideo);

export default router;

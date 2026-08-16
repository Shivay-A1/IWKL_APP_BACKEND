import { Router } from 'express';
import { body } from 'express-validator';
import * as unpluggedController from '../controllers/unplugged.controller';
import { authenticate, authorize, validate, apiLimiter } from '../middleware';

const router = Router();

// Public GET endpoints - no authentication required
router.get('/categories', unpluggedController.getCategories);
router.get('/categories/:id', unpluggedController.getCategoryById);
router.get('/categories/:id/videos', unpluggedController.getVideosByCategory);
router.get('/videos', unpluggedController.getVideos);
router.get('/videos/:id', unpluggedController.getVideoById);

// Protected routes - require authentication and authorization
router.post('/categories', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
], validate, unpluggedController.createCategory);

router.put('/categories/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), [
  body('name').optional().trim().notEmpty(),
  body('slug').optional().trim().notEmpty(),
], validate, unpluggedController.updateCategory);

router.delete('/categories/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), unpluggedController.deleteCategory);

router.post('/videos', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, [
  body('categoryId').notEmpty().withMessage('Category ID is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('thumbnailUrl').trim().notEmpty().withMessage('Thumbnail URL is required'),
], validate, unpluggedController.createVideo);

router.put('/videos/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), [
  body('title').optional().trim().notEmpty(),
], validate, unpluggedController.updateVideo);

router.delete('/videos/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), unpluggedController.deleteVideo);

export default router;

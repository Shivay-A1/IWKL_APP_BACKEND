import { Router } from 'express';
import { body } from 'express-validator';
import * as newsController from '../controllers/news.controller';
import { authenticate, authorize, validate, uploadSingle, apiLimiter } from '../middleware';

const router = Router();

// Create news with single image upload
router.post('/', uploadSingle('image'), authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('isFeatured').optional().isBoolean(),
  body('isPublished').optional().isBoolean(),
], validate, newsController.createNews);

// Create news without image upload
router.post('/simple', apiLimiter, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('isFeatured').optional().isBoolean(),
  body('isPublished').optional().isBoolean(),
], validate, newsController.createNews);

router.get('/', newsController.getNews);

router.get('/featured', newsController.getFeaturedNews);

router.get('/slug/:slug', newsController.getNewsBySlug);

router.get('/:id', newsController.getNewsBySlug);

// Update with single image upload
router.put('/:id', uploadSingle('image'), authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty if provided'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty if provided'),
  body('isFeatured').optional().isBoolean(),
  body('isPublished').optional().isBoolean(),
], validate, newsController.updateNews);

// Simple update route without image upload
router.put('/:id/simple', apiLimiter, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty if provided'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty if provided'),
  body('isFeatured').optional().isBoolean(),
  body('isPublished').optional().isBoolean(),
], validate, newsController.updateNews);

router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), newsController.deleteNews);

router.delete('/all', authenticate, authorize('SUPER_ADMIN'), newsController.deleteAllNews);

router.patch('/:id/views', newsController.incrementViewCount);

export default router;

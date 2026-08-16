import { Router } from 'express';
import { body } from 'express-validator';
import * as newsController from '../controllers/news.controller';
import { authenticate, authorize, validate, uploadSingle, uploadMultiple, apiLimiter } from '../middleware';

const router = Router();

router.post('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, uploadMultiple('images', 10), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
], validate, newsController.createNews);

router.get('/', newsController.getNews);

router.get('/featured', newsController.getFeaturedNews);

router.get('/slug/:slug', newsController.getNewsBySlug);

router.get('/:id', newsController.getNewsBySlug);

router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), uploadMultiple('images', 10), [
  body('title').optional().trim().notEmpty(),
], validate, newsController.updateNews);

router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), newsController.deleteNews);

router.patch('/:id/views', newsController.incrementViewCount);

export default router;

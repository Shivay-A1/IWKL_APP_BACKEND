import { Router } from 'express';
import { body } from 'express-validator';
import * as bannerController from '../controllers/banner.controller';
import { authenticate, authorize, validate, uploadSingle, apiLimiter } from '../middleware';

const router = Router();

// Public GET endpoints - no authentication required
router.get('/', bannerController.getBanners);
router.get('/active', bannerController.getActiveBanners);
router.get('/:id', bannerController.getBannerById);

// Protected routes - require authentication and authorization
router.post('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, uploadSingle('image'), [
  body('title').trim().notEmpty().withMessage('Banner title is required'),
], validate, bannerController.createBanner);

router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), uploadSingle('image'), [
  body('title').optional().trim().notEmpty(),
], validate, bannerController.updateBanner);

router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), bannerController.deleteBanner);

export default router;

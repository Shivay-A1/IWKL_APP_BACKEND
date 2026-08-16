import { Router } from 'express';
import { body } from 'express-validator';
import * as homepageBannerController from '../controllers/homepage-banner.controller';
import { authenticate, authorize, validate, uploadSingle, apiLimiter } from '../middleware';

const router = Router();

// Public route - get active banners
router.get('/', homepageBannerController.getActiveBanners);

// Admin routes
router.use(authenticate);

router.post('/upload', authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, uploadSingle('image'), [
  body('title').optional().trim(),
  body('subtitle').optional().trim(),
  body('ctaText').optional().trim(),
  body('ctaLink').optional().trim(),
], validate, homepageBannerController.uploadBanner);

router.get('/admin/all', authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), homepageBannerController.getAllBanners);

router.put('/update-order', authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), [
  body('banners').isArray().withMessage('Banners array is required'),
], validate, homepageBannerController.updateOrder);

router.put('/status/:id', authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), [
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
], validate, homepageBannerController.updateStatus);

router.delete('/:id', authorize('SUPER_ADMIN'), homepageBannerController.deleteBanner);

export default router;

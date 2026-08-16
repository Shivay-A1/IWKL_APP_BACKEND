import { Router } from 'express';
import { body } from 'express-validator';
import * as homepageBannerController from '../controllers/homepage-banner.controller';
import { authenticate, authorize, validate, uploadSingle, apiLimiter } from '../middleware';

const router = Router();

// Public route - get active banners
router.get('/', homepageBannerController.getActiveBanners);

// Admin routes
router.post('/upload', uploadSingle('image'), authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, [
  body('title').optional().trim(),
  body('subtitle').optional().trim(),
  body('ctaText').optional().trim(),
  body('ctaLink').optional().trim(),
], validate, homepageBannerController.uploadBanner);

router.post('/upload-link', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, [
  body('imageUrl').isURL().withMessage('Valid image URL is required'),
  body('ctaText').optional().trim(),
  body('ctaLink').optional().trim(),
], validate, homepageBannerController.uploadBannerLink);

router.get('/admin/all', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), homepageBannerController.getAllBanners);

router.put('/update-order', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), [
  body('banners').isArray().withMessage('Banners array is required'),
], validate, homepageBannerController.updateOrder);

router.put('/status/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), [
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
], validate, homepageBannerController.updateStatus);

router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), homepageBannerController.deleteBanner);

export default router;

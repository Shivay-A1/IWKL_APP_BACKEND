import { Router } from 'express';
import { body } from 'express-validator';
import * as homepageBannerController from '../controllers/homepage-banner.controller';
import { validate, uploadSingle, apiLimiter } from '../middleware';

const router = Router();

// Public route - get active banners
router.get('/', homepageBannerController.getActiveBanners);

// Admin routes - authentication removed for now
router.post('/upload', uploadSingle('image'), apiLimiter, [
  body('title').optional().trim(),
  body('subtitle').optional().trim(),
  body('ctaText').optional().trim(),
  body('ctaLink').optional().trim(),
], validate, homepageBannerController.uploadBanner);

router.post('/upload-link', apiLimiter, [
  body('imageUrl').isURL().withMessage('Valid image URL is required'),
  body('ctaText').optional().trim(),
  body('ctaLink').optional().trim(),
], validate, homepageBannerController.uploadBannerLink);

// Simple POST route for admin panel
router.post('/', apiLimiter, [
  body('title').optional().trim(),
  body('imageUrl').optional().trim(),
  body('subtitle').optional().trim(),
  body('buttonText').optional().trim(),
  body('buttonUrl').optional().trim(),
  body('isActive').optional().isBoolean(),
  body('order').optional().isInt(),
], validate, homepageBannerController.uploadBannerLink);

router.get('/admin/all', homepageBannerController.getAllBanners);

router.put('/update-order', [
  body('banners').isArray().withMessage('Banners array is required'),
], validate, homepageBannerController.updateOrder);

router.put('/status/:id', [
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
], validate, homepageBannerController.updateStatus);

router.delete('/:id', homepageBannerController.deleteBanner);

export default router;

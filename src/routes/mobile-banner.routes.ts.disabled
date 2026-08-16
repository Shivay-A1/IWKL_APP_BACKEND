import { Router } from 'express';
import { authenticate, authorize } from '../middleware';
import {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
  getActiveBanners
} from '../controllers/mobile-banner.controller';

const router = Router();

// Public routes - get active banners for mobile app
router.get('/active', getActiveBanners);
router.get('/:id', getBannerById);

// Admin only routes
router.get('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), getBanners);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), createBanner);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), updateBanner);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), deleteBanner);
router.patch('/:id/toggle', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), toggleBannerStatus);

export default router;

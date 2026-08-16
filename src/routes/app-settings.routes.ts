import { Router } from 'express';
import { authenticate, authorize } from '../middleware';
import {
  getSettings,
  getSettingByKey,
  updateSetting,
  createSetting,
  deleteSetting,
  getPublicSettings
} from '../controllers/app-settings.controller';

const router = Router();

// Public route - get public settings for mobile app
router.get('/public', getPublicSettings);

// Admin only routes
router.get('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), getSettings);
router.get('/:key', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), getSettingByKey);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), createSetting);
router.put('/:key', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), updateSetting);
router.delete('/:key', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), deleteSetting);

export default router;

import { Router } from 'express';
import * as siteSettingsController from '../controllers/site-settings.controller';
import { authenticate } from '../middleware';

const router = Router();

router.get('/', siteSettingsController.getSiteSettings);
router.put('/', authenticate, siteSettingsController.updateSiteSettings);

export default router;

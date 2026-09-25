import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller';
import { authenticate, apiLimiter } from '../middleware';

const router = Router();

// All settings routes require authentication
router.use(authenticate);

router.get('/', settingsController.getSettings);

router.patch('/', apiLimiter, settingsController.updateSettings);

export default router;

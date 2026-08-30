import { Router } from 'express';
import { body } from 'express-validator';
import * as seasonController from '../controllers/season.controller';
import { authenticate, authorize, validate, apiLimiter } from '../middleware';

const router = Router();

// Simple route to create sample season (no auth for testing)
router.post('/sample', apiLimiter, seasonController.createSampleSeason);

router.post('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, [
  body('name').trim().notEmpty().withMessage('Season name is required'),
  body('year').isInt().withMessage('Year must be a number'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
], validate, seasonController.createSeason);

router.get('/', seasonController.getSeasons);

router.get('/:id', seasonController.getSeasonById);

router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), [
  body('name').optional().trim().notEmpty(),
  body('year').optional().isInt(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
], validate, seasonController.updateSeason);

router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), seasonController.deleteSeason);

router.patch('/:id/activate', authenticate, authorize('SUPER_ADMIN'), seasonController.setActiveSeason);

export default router;

import { Router } from 'express';
import { body } from 'express-validator';
import * as pointsTableController from '../controllers/pointsTable.controller';
import { authenticate, authorize, validate, apiLimiter } from '../middleware';

const router = Router();

router.get('/', pointsTableController.getPointsTable);

router.get('/season/:seasonId', pointsTableController.getPointsTableBySeason);

router.post('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, [
  body('seasonId').notEmpty().withMessage('Season ID is required'),
  body('teamId').notEmpty().withMessage('Team ID is required'),
], validate, pointsTableController.createPointsTableEntry);

router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), [
  body('position').optional().isInt(),
  body('matchesPlayed').optional().isInt(),
  body('wins').optional().isInt(),
  body('losses').optional().isInt(),
  body('ties').optional().isInt(),
  body('points').optional().isInt(),
  body('raidPoints').optional().isInt(),
  body('tacklePoints').optional().isInt(),
], validate, pointsTableController.updatePointsTableEntry);

router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), pointsTableController.deletePointsTableEntry);

export default router;

import { Router } from 'express';
import * as pointsController from '../controllers/points.controller';
import { authenticate, authorize } from '../middleware';

const router = Router();

router.get('/', pointsController.getPointsTable);

router.get('/season/:seasonId', pointsController.getPointsTableBySeason);

router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), pointsController.updatePointsTable);

router.post('/season/:seasonId/recalculate', authenticate, authorize('SUPER_ADMIN'), pointsController.recalculatePointsTable);

export default router;

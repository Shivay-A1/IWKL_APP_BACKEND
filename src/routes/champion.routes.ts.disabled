import { Router } from 'express';
import { body } from 'express-validator';
import * as championController from '../controllers/champion.controller';
import { authenticate, authorize, validate, uploadSingle, apiLimiter } from '../middleware';

const router = Router();

router.use(authenticate);

router.post('/', authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, uploadSingle('trophyImage'), [
  body('seasonId').notEmpty().withMessage('Season ID is required'),
  body('teamId').notEmpty().withMessage('Team ID is required'),
], validate, championController.createChampion);

router.get('/', championController.getChampions);

router.get('/season/:seasonId', championController.getChampionBySeason);

router.get('/:id', championController.getChampionBySeason);

router.put('/:id', authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), uploadSingle('trophyImage'), validate, championController.updateChampion);

router.delete('/:id', authorize('SUPER_ADMIN'), championController.deleteChampion);

export default router;

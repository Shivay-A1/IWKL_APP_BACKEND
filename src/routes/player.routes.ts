import { Router } from 'express';
import { body } from 'express-validator';
import * as playerController from '../controllers/player.controller';
import { authenticate, authorize, validate, uploadSingle, apiLimiter } from '../middleware';

const router = Router();

router.post('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN', 'TEAM_MANAGER'), apiLimiter, uploadSingle('image'), [
  body('name').trim().notEmpty().withMessage('Player name is required'),
  body('teamId').notEmpty().withMessage('Team ID is required'),
], validate, playerController.createPlayer);

router.get('/', playerController.getPlayers);

router.get('/:id', playerController.getPlayerById);

router.put('/:id', authorize('SUPER_ADMIN', 'LEAGUE_ADMIN', 'TEAM_MANAGER'), uploadSingle('image'), [
  body('name').optional().trim().notEmpty(),
], validate, playerController.updatePlayer);

router.delete('/:id', authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), playerController.deletePlayer);

router.get('/team/:teamId', playerController.getPlayersByTeam);

export default router;

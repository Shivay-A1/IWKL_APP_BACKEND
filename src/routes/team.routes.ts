import { Router } from 'express';
import { body } from 'express-validator';
import * as teamController from '../controllers/team.controller';
import { authenticate, authorize, validate, upload, apiLimiter } from '../middleware';

const router = Router();

router.post('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), [
  body('name').trim().notEmpty().withMessage('Team name is required'),
  body('shortName').trim().notEmpty().withMessage('Short name is required'),
  body('seasonId').notEmpty().withMessage('Season ID is required'),
], validate, teamController.createTeam);

// Alternative route for creating teams with logo URL instead of file upload
router.post('/with-logo-url', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, [
  body('name').trim().notEmpty().withMessage('Team name is required'),
  body('shortName').trim().notEmpty().withMessage('Short name is required'),
  body('seasonId').notEmpty().withMessage('Season ID is required'),
  body('logoUrl').trim().notEmpty().withMessage('Logo URL is required'),
], validate, teamController.createTeamWithLogoUrl);

router.get('/', teamController.getTeams);

router.get('/:id', teamController.getTeamById);

router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), [
  body('name').optional().trim().notEmpty(),
  body('shortName').optional().trim().notEmpty(),
], validate, teamController.updateTeam);

router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), teamController.deleteTeam);

router.get('/:id/stats', teamController.getTeamStats);

export default router;

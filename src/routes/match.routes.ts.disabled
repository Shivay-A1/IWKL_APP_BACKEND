import { Router } from 'express';
import { body } from 'express-validator';
import * as matchController from '../controllers/match.controller';
import { authenticate, authorize, validate, apiLimiter } from '../middleware';

const router = Router();

router.post('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, [
  body('seasonId').notEmpty().withMessage('Season ID is required'),
  body('homeTeamId').notEmpty().withMessage('Home team ID is required'),
  body('awayTeamId').notEmpty().withMessage('Away team ID is required'),
  body('matchDate').isISO8601().withMessage('Valid match date is required'),
  body('stadiumId').optional().notEmpty().withMessage('Stadium ID is required'),
  body('matchType').optional().trim().notEmpty(),
], validate, matchController.createMatch);

router.get('/', matchController.getMatches);

router.get('/upcoming', matchController.getUpcomingMatches);

router.get('/live', matchController.getLiveMatches);

router.get('/completed', matchController.getCompletedMatches);

router.get('/:id', matchController.getMatchById);

router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), [
  body('matchDate').optional().isISO8601(),
  body('stadiumId').optional().notEmpty(),
  body('matchType').optional().trim().notEmpty(),
], validate, matchController.updateMatch);

router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), matchController.deleteMatch);

router.post('/:id/duplicate', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), matchController.duplicateMatch);

router.patch('/:id/publish', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), matchController.publishMatch);

router.patch('/:id/score', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), [
  body('homeScore').isInt().withMessage('Home score must be a number'),
  body('awayScore').isInt().withMessage('Away score must be a number'),
], validate, matchController.updateMatchScore);

router.patch('/:id/live-score', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), [
  body('homeScore').isInt().withMessage('Home score must be a number'),
  body('awayScore').isInt().withMessage('Away score must be a number'),
], validate, matchController.updateLiveScore);

router.patch('/:id/status', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), [
  body('status').isIn(['SCHEDULED', 'LIVE', 'COMPLETED', 'POSTPONED', 'CANCELLED', 'ABANDONED']).withMessage('Invalid status'),
], validate, matchController.updateMatchStatus);

router.post('/:id/start', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), matchController.startMatch);

router.post('/:id/pause', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), matchController.pauseMatch);

router.post('/:id/resume', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), matchController.resumeMatch);

router.post('/:id/end', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), [
  body('winnerId').optional().notEmpty(),
  body('manOfTheMatch').optional().trim(),
], validate, matchController.endMatch);

router.get('/:id/history', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), matchController.getMatchHistory);

router.post('/:id/rollback/:historyId', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), matchController.rollbackMatch);

router.get('/:id/logs', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), matchController.getMatchLogs);

router.post('/:id/log-event', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), matchController.logMatchEvent);

router.get('/:id/raids', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), matchController.getMatchRaids);

router.post('/:id/raids', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), matchController.createRaid);

export default router;

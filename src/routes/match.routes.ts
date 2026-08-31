import { Router } from 'express';
import { body } from 'express-validator';
import * as matchController from '../controllers/match.controller';
import { validate, apiLimiter } from '../middleware';

const router = Router();

router.post('/', apiLimiter, [
  body('seasonId').notEmpty().withMessage('Season ID is required'),
  body('homeTeamId').notEmpty().withMessage('Home team ID is required'),
  body('awayTeamId').notEmpty().withMessage('Away team ID is required'),
  body('matchDate').isISO8601().withMessage('Valid match date is required'),
  body('stadiumId').optional().notEmpty().withMessage('Stadium ID is required'),
  body('matchType').optional().trim().notEmpty(),
], validate, matchController.createMatch);

// Simple POST route for admin panel (minimal validation)
router.post('/simple', apiLimiter, matchController.createMatchSimple);

router.get('/', matchController.getMatches);

router.get('/upcoming', matchController.getUpcomingMatches);

router.get('/live', matchController.getLiveMatches);

router.get('/completed', matchController.getCompletedMatches);

router.get('/:id', matchController.getMatchById);

router.put('/:id', [
  body('matchDate').optional().isISO8601(),
  body('stadiumId').optional().notEmpty(),
  body('matchType').optional().trim().notEmpty(),
], validate, matchController.updateMatch);

router.delete('/:id', matchController.deleteMatch);

router.post('/:id/duplicate', matchController.duplicateMatch);

router.patch('/:id/publish', matchController.publishMatch);

router.patch('/:id/score', [
  body('homeScore').isInt().withMessage('Home score must be a number'),
  body('awayScore').isInt().withMessage('Away score must be a number'),
], validate, matchController.updateMatchScore);

router.patch('/:id/live-score', [
  body('homeScore').optional().isInt().withMessage('Home score must be a number'),
  body('awayScore').optional().isInt().withMessage('Away score must be a number'),
], validate, matchController.updateLiveScore);

router.patch('/:id/status', [
  body('status').isIn(['SCHEDULED', 'LIVE', 'COMPLETED', 'POSTPONED', 'CANCELLED', 'ABANDONED']).withMessage('Invalid status'),
], validate, matchController.updateMatchStatus);

router.post('/:id/start', matchController.startMatch);

router.post('/:id/pause', matchController.pauseMatch);

router.post('/:id/resume', matchController.resumeMatch);

router.post('/:id/end', [
  body('winnerId').optional().notEmpty(),
  body('manOfTheMatch').optional().trim(),
], validate, matchController.endMatch);

router.get('/:id/history', matchController.getMatchHistory);

router.post('/:id/rollback/:historyId', matchController.rollbackMatch);

router.get('/:id/logs', matchController.getMatchLogs);

router.post('/:id/log-event', matchController.logMatchEvent);

router.get('/:id/raids', matchController.getMatchRaids);

router.post('/:id/raids', matchController.createRaid);

export default router;

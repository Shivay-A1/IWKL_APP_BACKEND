import { Router } from 'express';
import * as ottController from '../controllers/ott.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// ============================================
// BROADCASTERS
// ============================================
router.get('/broadcasters', ottController.getBroadcasters);
router.post('/broadcasters', authenticate, ottController.createBroadcaster);
router.put('/broadcasters/:id', authenticate, ottController.updateBroadcaster);
router.delete('/broadcasters/:id', authenticate, ottController.deleteBroadcaster);

// ============================================
// LIVE MATCHES
// ============================================
router.get('/live-matches', ottController.getLiveMatches);
router.get('/live-matches/:id', ottController.getLiveMatch);
router.post('/live-matches', authenticate, ottController.createLiveMatch);
router.put('/live-matches/:id', authenticate, ottController.updateLiveMatch);
router.delete('/live-matches/:id', authenticate, ottController.deleteLiveMatch);

// ============================================
// LIVE MATCH SCORE & TIMER CONTROLS (SOCKET.IO)
// ============================================
router.post('/score', ottController.updateOTTScore);
router.post('/timer', ottController.updateOTTTimer);
router.post('/status', ottController.updateOTTMatchStatus);
router.post('/rollback', ottController.rollbackOTTScore);
router.get('/score-history/:matchId', ottController.getOTTScoreHistory);
router.post('/complete-match', ottController.completeOTTMatch);
router.post('/player-stats', ottController.updateOTTPlayerStats);
router.get('/player-stats/:matchId', ottController.getOTTPlayerStats);

// ============================================
// UPCOMING MATCHES
// ============================================
router.get('/upcoming-matches', ottController.getUpcomingMatches);
router.post('/upcoming-matches', authenticate, ottController.createUpcomingMatch);
router.put('/upcoming-matches/:id', authenticate, ottController.updateUpcomingMatch);
router.delete('/upcoming-matches/:id', authenticate, ottController.deleteUpcomingMatch);

// ============================================
// HIGHLIGHTS
// ============================================
router.get('/highlights', ottController.getHighlights);
router.post('/highlights', authenticate, ottController.createHighlight);
router.put('/highlights/:id', authenticate, ottController.updateHighlight);
router.delete('/highlights/:id', authenticate, ottController.deleteHighlight);

// ============================================
// HERO CMS
// ============================================
router.get('/hero', ottController.getHero);
router.post('/hero', authenticate, ottController.createHero);
router.put('/hero/:id', authenticate, ottController.updateHero);

// ============================================
// OTT SETTINGS
// ============================================
router.get('/settings', ottController.getSettings);
router.post('/settings', authenticate, ottController.createSettings);
router.put('/settings/:id', authenticate, ottController.updateSettings);

export default router;

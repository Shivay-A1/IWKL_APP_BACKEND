import { Response } from 'express';
import { AuthRequest } from '../types/express';
import { emitOTTScoreUpdate, emitOTTTimerUpdate, emitOTTMatchStatusUpdate } from '../config/socket';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// BROADCASTERS
// ============================================

export const getBroadcasters = async (req: AuthRequest, res: Response) => {
  try {
    const broadcasters = await prisma.ottBroadcaster.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    });
    res.json({ success: true, data: broadcasters });
  } catch (error) {
    console.error('Error fetching broadcasters:', error);
    res.status(500).json({ error: 'Failed to fetch broadcasters' });
  }
};

export const createBroadcaster = async (req: AuthRequest, res: Response) => {
  try {
    const { name, logo, redirectUrl, displayOrder } = req.body;
    
    const broadcaster = await prisma.ottBroadcaster.create({
      data: {
        name,
        logo,
        redirectUrl,
        displayOrder: displayOrder || 0
      }
    });
    
    res.json({ success: true, data: broadcaster });
  } catch (error) {
    console.error('Error creating broadcaster:', error);
    res.status(500).json({ error: 'Failed to create broadcaster' });
  }
};

export const updateBroadcaster = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, logo, redirectUrl, isActive, displayOrder } = req.body;
    
    const broadcaster = await prisma.ottBroadcaster.update({
      where: { id },
      data: {
        name,
        logo,
        redirectUrl,
        isActive,
        displayOrder
      }
    });
    
    res.json({ success: true, data: broadcaster });
  } catch (error) {
    console.error('Error updating broadcaster:', error);
    res.status(500).json({ error: 'Failed to update broadcaster' });
  }
};

export const deleteBroadcaster = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.ottBroadcaster.delete({
      where: { id }
    });
    
    res.json({ success: true, message: 'Broadcaster deleted successfully' });
  } catch (error) {
    console.error('Error deleting broadcaster:', error);
    res.status(500).json({ error: 'Failed to delete broadcaster' });
  }
};

// ============================================
// LIVE MATCHES
// ============================================

export const getLiveMatches = async (req: AuthRequest, res: Response) => {
  try {
    const liveMatches = await prisma.ottLiveMatch.findMany({
      include: {
        teamA: { select: { id: true, name: true, shortName: true, logo: true } },
        teamB: { select: { id: true, name: true, shortName: true, logo: true } }
      },
      orderBy: { matchDate: 'desc' }
    });
    res.json({ success: true, data: liveMatches });
  } catch (error) {
    console.error('Error fetching live matches:', error);
    res.status(500).json({ error: 'Failed to fetch live matches' });
  }
};

export const getLiveMatch = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const liveMatch = await prisma.ottLiveMatch.findUnique({
      where: { id },
      include: {
        teamA: { select: { id: true, name: true, shortName: true, logo: true } },
        teamB: { select: { id: true, name: true, shortName: true, logo: true } },
        events: { orderBy: { timestamp: 'desc' } }
      }
    });
    
    if (!liveMatch) {
      return res.status(404).json({ error: 'Live match not found' });
    }
    
    res.json({ success: true, data: liveMatch });
  } catch (error) {
    console.error('Error fetching live match:', error);
    res.status(500).json({ error: 'Failed to fetch live match' });
  }
};

export const createLiveMatch = async (req: AuthRequest, res: Response) => {
  try {
    const { teamAId, teamBId, leagueStage, venue, matchDate, matchTime } = req.body;
    
    const liveMatch = await prisma.ottLiveMatch.create({
      data: {
        teamAId,
        teamBId,
        leagueStage,
        venue,
        matchDate: new Date(matchDate),
        matchTime,
        status: 'upcoming'
      },
      include: {
        teamA: { select: { id: true, name: true, shortName: true, logo: true } },
        teamB: { select: { id: true, name: true, shortName: true, logo: true } }
      }
    });
    
    res.json({ success: true, data: liveMatch });
  } catch (error) {
    console.error('Error creating live match:', error);
    res.status(500).json({ error: 'Failed to create live match' });
  }
};

export const updateLiveMatch = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { teamAId, teamBId, leagueStage, venue, matchDate, matchTime, status } = req.body;
    
    const liveMatch = await prisma.ottLiveMatch.update({
      where: { id },
      data: {
        teamAId,
        teamBId,
        leagueStage,
        venue,
        matchDate: matchDate ? new Date(matchDate) : undefined,
        matchTime,
        status
      },
      include: {
        teamA: { select: { id: true, name: true, shortName: true, logo: true } },
        teamB: { select: { id: true, name: true, shortName: true, logo: true } }
      }
    });
    
    res.json({ success: true, data: liveMatch });
  } catch (error) {
    console.error('Error updating live match:', error);
    res.status(500).json({ error: 'Failed to update live match' });
  }
};

export const deleteLiveMatch = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.ottLiveMatch.delete({
      where: { id }
    });
    
    res.json({ success: true, message: 'Live match deleted successfully' });
  } catch (error) {
    console.error('Error deleting live match:', error);
    res.status(500).json({ error: 'Failed to delete live match' });
  }
};

// ============================================
// LIVE MATCH SCORE & TIMER CONTROLS SOCKET.IO
// ============================================

export const updateOTTScore = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId, teamAScore, teamBScore, teamAName, teamBName, pointsType, description } = req.body;
    
    console.log('Updating OTT score:', { matchId, teamAScore, teamBScore });
    
    // Get current match data for history
    const currentMatch = await prisma.ottLiveMatch.findUnique({
      where: { id: matchId },
      select: { teamAScore: true, teamBScore: true }
    });

    if (!currentMatch) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Update database
    const liveMatch = await prisma.ottLiveMatch.update({
      where: { id: matchId },
      data: {
        teamAScore,
        teamBScore
      },
      include: {
        teamA: { select: { id: true, name: true, shortName: true, logo: true } },
        teamB: { select: { id: true, name: true, shortName: true, logo: true } }
      }
    });

    // Create point history entry
    await prisma.ottPointHistory.create({
      data: {
        matchId,
        teamAScore: currentMatch.teamAScore,
        teamBScore: currentMatch.teamBScore,
        newTeamAScore: teamAScore,
        newTeamBScore: teamBScore,
        pointsType: pointsType || 'manual_update',
        description: description || 'Score updated',
        timestamp: new Date()
      }
    });
    
    const scoreData = {
      matchId,
      teamAScore,
      teamBScore,
      teamAName: liveMatch.teamA.name,
      teamBName: liveMatch.teamB.name,
      timestamp: new Date().toISOString()
    };

    emitOTTScoreUpdate(scoreData);
    
    res.json({ success: true, data: liveMatch });
  } catch (error) {
    console.error('Error updating OTT score:', error);
    res.status(500).json({ error: 'Failed to update score', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const updateOTTTimer = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId, timer, half, isPaused } = req.body;
    
    const liveMatch = await prisma.ottLiveMatch.update({
      where: { id: matchId },
      data: {
        timer,
        half,
        isPaused
      }
    });
    
    const timerData = {
      matchId,
      timer,
      half,
      isPaused,
      timestamp: new Date().toISOString()
    };

    emitOTTTimerUpdate(timerData);
    
    res.json({ success: true, data: liveMatch });
  } catch (error) {
    console.error('Error updating OTT timer:', error);
    res.status(500).json({ error: 'Failed to update timer' });
  }
};

export const updateOTTMatchStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId, status } = req.body;
    
    const liveMatch = await prisma.ottLiveMatch.update({
      where: { id: matchId },
      data: { status }
    });
    
    const statusData = {
      matchId,
      status,
      timestamp: new Date().toISOString()
    };

    emitOTTMatchStatusUpdate(statusData);
    
    res.json({ success: true, data: liveMatch });
  } catch (error) {
    console.error('Error updating OTT match status:', error);
    res.status(500).json({ error: 'Failed to update match status' });
  }
};

export const rollbackOTTScore = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId, historyId } = req.body;
    
    // Get the history entry
    const historyEntry = await prisma.ottPointHistory.findUnique({
      where: { id: historyId }
    });

    if (!historyEntry) {
      return res.status(404).json({ error: 'History entry not found' });
    }

    // Rollback to the previous score
    const liveMatch = await prisma.ottLiveMatch.update({
      where: { id: matchId },
      data: {
        teamAScore: historyEntry.teamAScore,
        teamBScore: historyEntry.teamBScore
      },
      include: {
        teamA: { select: { id: true, name: true, shortName: true, logo: true } },
        teamB: { select: { id: true, name: true, shortName: true, logo: true } }
      }
    });

    // Create rollback history entry
    await prisma.ottPointHistory.create({
      data: {
        matchId,
        teamAScore: historyEntry.newTeamAScore,
        teamBScore: historyEntry.newTeamBScore,
        newTeamAScore: historyEntry.teamAScore,
        newTeamBScore: historyEntry.teamBScore,
        pointsType: 'rollback',
        description: `Rolled back to previous score: ${historyEntry.teamAScore}-${historyEntry.teamBScore}`,
        timestamp: new Date()
      }
    });

    const scoreData = {
      matchId,
      teamAScore: historyEntry.teamAScore,
      teamBScore: historyEntry.teamBScore,
      teamAName: liveMatch.teamA.name,
      teamBName: liveMatch.teamB.name,
      timestamp: new Date().toISOString()
    };

    emitOTTScoreUpdate(scoreData);
    
    res.json({ success: true, data: liveMatch });
  } catch (error) {
    console.error('Error rolling back OTT score:', error);
    res.status(500).json({ error: 'Failed to rollback score' });
  }
};

export const getOTTScoreHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId } = req.params;
    
    const history = await prisma.ottPointHistory.findMany({
      where: { matchId },
      orderBy: { timestamp: 'desc' }
    });
    
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching OTT score history:', error);
    res.status(500).json({ error: 'Failed to fetch score history' });
  }
};

export const completeOTTMatch = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId, finalScoreA, finalScoreB } = req.body;
    
    const liveMatch = await prisma.ottLiveMatch.update({
      where: { id: matchId },
      data: {
        status: 'completed',
        teamAScore: finalScoreA,
        teamBScore: finalScoreB
      },
      include: {
        teamA: { select: { id: true, name: true, shortName: true, logo: true } },
        teamB: { select: { id: true, name: true, shortName: true, logo: true } }
      }
    });

    const statusData = {
      matchId,
      status: 'completed',
      timestamp: new Date().toISOString()
    };

    emitOTTMatchStatusUpdate(statusData);
    
    res.json({ success: true, data: liveMatch });
  } catch (error) {
    console.error('Error completing OTT match:', error);
    res.status(500).json({ error: 'Failed to complete match' });
  }
};

export const updateOTTPlayerStats = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId, playerName, team, raids, tackles, points, superRaids, superTackles } = req.body;
    
    // Create or update player stats for the match
    const playerStats = await prisma.ottPlayerStats.upsert({
      where: {
        id: `${matchId}-${playerName}-${team}` // Composite key
      },
      update: {
        raids,
        tackles,
        points,
        superRaids,
        superTackles
      },
      create: {
        id: `${matchId}-${playerName}-${team}`,
        matchId,
        playerName,
        team,
        raids: raids || 0,
        tackles: tackles || 0,
        points: points || 0,
        superRaids: superRaids || 0,
        superTackles: superTackles || 0
      }
    });
    
    res.json({ success: true, data: playerStats });
  } catch (error) {
    console.error('Error updating OTT player stats:', error);
    res.status(500).json({ error: 'Failed to update player stats' });
  }
};

export const getOTTPlayerStats = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId } = req.params;
    
    const playerStats = await prisma.ottPlayerStats.findMany({
      where: { matchId }
    });
    
    res.json({ success: true, data: playerStats });
  } catch (error) {
    console.error('Error fetching OTT player stats:', error);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
};

// ============================================
// UPCOMING MATCHES
// ============================================

export const getUpcomingMatches = async (req: AuthRequest, res: Response) => {
  try {
    const upcomingMatches = await prisma.ottUpcomingMatch.findMany({
      where: { isActive: true },
      include: {
        teamA: { select: { id: true, name: true, shortName: true, logo: true } },
        teamB: { select: { id: true, name: true, shortName: true, logo: true } }
      },
      orderBy: [{ displayOrder: 'asc' }, { matchDate: 'asc' }]
    });
    res.json({ success: true, data: upcomingMatches });
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming matches' });
  }
};

export const createUpcomingMatch = async (req: AuthRequest, res: Response) => {
  try {
    const { teamAId, teamBId, matchDate, matchTime, venue, leagueStage, displayOrder } = req.body;
    
    const upcomingMatch = await prisma.ottUpcomingMatch.create({
      data: {
        teamAId,
        teamBId,
        matchDate: new Date(matchDate),
        matchTime,
        venue,
        leagueStage,
        displayOrder: displayOrder || 0
      },
      include: {
        teamA: { select: { id: true, name: true, shortName: true, logo: true } },
        teamB: { select: { id: true, name: true, shortName: true, logo: true } }
      }
    });
    
    res.json({ success: true, data: upcomingMatch });
  } catch (error) {
    console.error('Error creating upcoming match:', error);
    res.status(500).json({ error: 'Failed to create upcoming match' });
  }
};

export const updateUpcomingMatch = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { teamAId, teamBId, matchDate, matchTime, venue, leagueStage, isActive, displayOrder } = req.body;
    
    const upcomingMatch = await prisma.ottUpcomingMatch.update({
      where: { id },
      data: {
        teamAId,
        teamBId,
        matchDate: matchDate ? new Date(matchDate) : undefined,
        matchTime,
        venue,
        leagueStage,
        isActive,
        displayOrder
      },
      include: {
        teamA: { select: { id: true, name: true, shortName: true, logo: true } },
        teamB: { select: { id: true, name: true, shortName: true, logo: true } }
      }
    });
    
    res.json({ success: true, data: upcomingMatch });
  } catch (error) {
    console.error('Error updating upcoming match:', error);
    res.status(500).json({ error: 'Failed to update upcoming match' });
  }
};

export const deleteUpcomingMatch = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.ottUpcomingMatch.delete({
      where: { id }
    });
    
    res.json({ success: true, message: 'Upcoming match deleted successfully' });
  } catch (error) {
    console.error('Error deleting upcoming match:', error);
    res.status(500).json({ error: 'Failed to delete upcoming match' });
  }
};

// ============================================
// HIGHLIGHTS
// ============================================

export const getHighlights = async (req: AuthRequest, res: Response) => {
  try {
    const highlights = await prisma.ottHighlight.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    res.json({ success: true, data: highlights });
  } catch (error) {
    console.error('Error fetching highlights:', error);
    res.status(500).json({ error: 'Failed to fetch highlights' });
  }
};

export const createHighlight = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, displayOrder } = req.body;
    
    const highlight = await prisma.ottHighlight.create({
      data: {
        title,
        description,
        videoUrl,
        thumbnailUrl,
        displayOrder: displayOrder || 0
      }
    });
    
    res.json({ success: true, data: highlight });
  } catch (error) {
    console.error('Error creating highlight:', error);
    res.status(500).json({ error: 'Failed to create highlight' });
  }
};

export const updateHighlight = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, videoUrl, thumbnailUrl, isPublished, publishedAt, displayOrder } = req.body;
    
    const highlight = await prisma.ottHighlight.update({
      where: { id },
      data: {
        title,
        description,
        videoUrl,
        thumbnailUrl,
        isPublished,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        displayOrder
      }
    });
    
    res.json({ success: true, data: highlight });
  } catch (error) {
    console.error('Error updating highlight:', error);
    res.status(500).json({ error: 'Failed to update highlight' });
  }
};

export const deleteHighlight = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.ottHighlight.delete({
      where: { id }
    });
    
    res.json({ success: true, message: 'Highlight deleted successfully' });
  } catch (error) {
    console.error('Error deleting highlight:', error);
    res.status(500).json({ error: 'Failed to delete highlight' });
  }
};

// ============================================
// HERO CMS
// ============================================

export const getHero = async (req: AuthRequest, res: Response) => {
  try {
    const hero = await prisma.ottHero.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    if (!hero) {
      return res.json({ success: true, data: null });
    }
    
    res.json({ success: true, data: hero });
  } catch (error) {
    console.error('Error fetching hero:', error);
    res.status(500).json({ error: 'Failed to fetch hero' });
  }
};

export const createHero = async (req: AuthRequest, res: Response) => {
  try {
    const { title, subtitle, backgroundImage, isEnabled } = req.body;
    
    const hero = await prisma.ottHero.create({
      data: {
        title,
        subtitle,
        backgroundImage,
        isEnabled: isEnabled !== undefined ? isEnabled : true
      }
    });
    
    res.json({ success: true, data: hero });
  } catch (error) {
    console.error('Error creating hero:', error);
    res.status(500).json({ error: 'Failed to create hero' });
  }
};

export const updateHero = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subtitle, backgroundImage, isEnabled } = req.body;
    
    const hero = await prisma.ottHero.update({
      where: { id },
      data: {
        title,
        subtitle,
        backgroundImage,
        isEnabled
      }
    });
    
    res.json({ success: true, data: hero });
  } catch (error) {
    console.error('Error updating hero:', error);
    res.status(500).json({ error: 'Failed to update hero' });
  }
};

// ============================================
// OTT SETTINGS
// ============================================

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const settings = await prisma.ottSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    if (!settings) {
      return res.json({ success: true, data: null });
    }
    
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const createSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { starSportsUrl, hotstarUrl, defaultStreamUrl, autoRedirect } = req.body;
    
    const settings = await prisma.ottSettings.create({
      data: {
        starSportsUrl,
        hotstarUrl,
        defaultStreamUrl,
        autoRedirect: autoRedirect !== undefined ? autoRedirect : false
      }
    });
    
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error creating settings:', error);
    res.status(500).json({ error: 'Failed to create settings' });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { starSportsUrl, hotstarUrl, defaultStreamUrl, autoRedirect } = req.body;
    
    const settings = await prisma.ottSettings.update({
      where: { id },
      data: {
        starSportsUrl,
        hotstarUrl,
        defaultStreamUrl,
        autoRedirect
      }
    });
    
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

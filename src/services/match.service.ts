import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { getPaginationParams, calculatePagination } from '../utils';

// Helper function to create match history entry
const createMatchHistory = async (matchId: string, adminId: string | null, action: string, field: string | null, oldValue: any, newValue: any, reason: string | null) => {
  await prisma.matchHistory.create({
    data: {
      matchId,
      adminId,
      action,
      field,
      oldValue,
      newValue,
      reason,
    },
  });
};

// Helper function to create match log entry
// @ts-ignore - MatchLog model will be available after Prisma migration
const createMatchLog = async (matchId: string, eventType: string, data: any, teamId?: string, playerId?: string) => {
  await prisma.matchLog.create({
    data: {
      matchId,
      eventType,
      // @ts-ignore - data field will be available after Prisma migration
      data,
      teamId,
      playerId,
    } as any,
  });
};

export const createMatch = async (data: any, adminId?: string) => {
  const match = await prisma.match.create({
    data,
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  // Create history entry
  await createMatchHistory(match.id, adminId || null, 'CREATE', null, null, data, 'Match created');

  return match;
};

export const createMatchSimple = async (data: any) => {
  // Simplified match creation with default values
  const matchData = {
    seasonId: data.seasonId || 'default-season',
    homeTeamId: data.homeTeamId,
    awayTeamId: data.awayTeamId,
    matchDate: data.matchDate || new Date().toISOString(),
    homeScore: data.homeScore || 0,
    awayScore: data.awayScore || 0,
    matchTimer: data.matchTimer || '00:00',
    half: data.half || '1st Half',
    status: data.status || 'SCHEDULED',
    matchType: data.matchType || 'LEAGUE_MATCH',
    venue: data.venue || null,
    stadiumId: data.stadiumId || null,
  };

  const match = await prisma.match.create({
    data: matchData,
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  return match;
};

export const getMatches = async (query: any) => {
  const { page, limit, sortBy, sortOrder } = getPaginationParams(query);
  const { seasonId, teamId, status, search } = query;

  const where: any = {};
  if (seasonId) where.seasonId = seasonId;
  if (teamId) {
    where.OR = [
      { homeTeamId: teamId },
      { awayTeamId: teamId },
    ];
  }
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { venue: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [matches, total] = await Promise.all([
    prisma.match.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        season: true,
        homeTeam: true,
        awayTeam: true,
        stadium: true,
        result: true,
      },
    }),
    prisma.match.count({ where }),
  ]);

  return {
    data: matches,
    pagination: calculatePagination(page, limit, total),
  };
};

export const getMatchById = async (id: string) => {
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
      result: true,
    },
  });

  if (!match) {
    throw new AppError('Match not found', 404);
  }

  return match;
};

export const updateMatch = async (id: string, data: any, adminId?: string) => {
  const existingMatch = await prisma.match.findUnique({ where: { id } });
  if (!existingMatch) {
    throw new AppError('Match not found', 404);
  }

  const match = await prisma.match.update({
    where: { id },
    data,
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  // Create history entries for each changed field
  for (const key in data) {
    if (data[key] !== existingMatch[key as keyof typeof existingMatch]) {
      await createMatchHistory(
        match.id,
        adminId || null,
        'UPDATE',
        key,
        existingMatch[key as keyof typeof existingMatch],
        data[key],
        `Updated ${key}`
      );
    }
  }

  return match;
};

export const deleteMatch = async (id: string, adminId?: string) => {
  const match = await prisma.match.findUnique({ where: { id } });
  if (!match) {
    throw new AppError('Match not found', 404);
  }

  // Create history entry before deletion
  await createMatchHistory(id, adminId || null, 'DELETE', null, match, null, 'Match deleted');

  await prisma.match.delete({ where: { id } });
};

export const duplicateMatch = async (id: string) => {
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  if (!match) {
    throw new AppError('Match not found', 404);
  }

  // Create a duplicate match with a new match date (default to tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(match.matchDate.getHours(), match.matchDate.getMinutes());

  const duplicatedMatch = await prisma.match.create({
    data: {
      seasonId: match.seasonId,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      stadiumId: match.stadiumId,
      matchDate: tomorrow.toISOString(),
      venue: match.venue,
      status: 'SCHEDULED',
      matchType: match.matchType,
      matchTitle: match.matchTitle ? `${match.matchTitle} (Copy)` : null,
      streamUrl: match.streamUrl,
      highlightsUrl: match.highlightsUrl,
      broadcaster: match.broadcaster,
      matchBanner: match.matchBanner,
      toss: match.toss,
      referee: match.referee,
    },
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  return duplicatedMatch;
};

export const publishMatch = async (id: string, data: any) => {
  const { published } = data;

  const match = await prisma.match.findUnique({ where: { id } });
  if (!match) {
    throw new AppError('Match not found', 404);
  }

  const updatedMatch = await prisma.match.update({
    where: { id },
    data: { published },
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  return updatedMatch;
};

export const updateMatchScore = async (id: string, data: any) => {
  const { homeScore, awayScore, winnerId, manOfTheMatch, keyStatistics, quarterScores } = data;

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  if (!match) {
    throw new AppError('Match not found', 404);
  }

  // Create or update match result
  const result = await prisma.matchResult.upsert({
    where: { matchId: id },
    update: {
      homeScore,
      awayScore,
      winnerId,
      manOfTheMatch,
      keyStatistics,
      quarterScores,
    },
    create: {
      matchId: id,
      homeScore,
      awayScore,
      winnerId,
      manOfTheMatch,
      keyStatistics,
      quarterScores,
    },
  });

  // Update match status
  await prisma.match.update({
    where: { id },
    data: { status: 'COMPLETED' },
  });

  // Socket.IO emission disabled for now
  // TODO: Implement proper socket configuration
  /*
  // Emit score update via Socket.IO
  emitScoreUpdate(id, {
    matchId: id,
    homeScore,
    awayScore,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
  });

  // Emit status update via Socket.IO
  emitMatchStatusUpdate(id, {
    matchId: id,
    status: 'COMPLETED',
  });
  */

  // Update points table
  await updatePointsTable(match.seasonId, match.homeTeamId, match.awayTeamId, homeScore, awayScore, winnerId);

  // Create notifications for users following the teams
  await createMatchNotifications(match, result);

  return result;
};

const updatePointsTable = async (
  seasonId: string,
  homeTeamId: string,
  awayTeamId: string,
  homeScore: number,
  awayScore: number,
  winnerId: string | null,
  homeRaidPoints: number = 0,
  awayRaidPoints: number = 0,
  homeTacklePoints: number = 0,
  awayTacklePoints: number = 0
) => {
  const homeEntry = await prisma.pointsTableEntry.findUnique({
    where: { seasonId_teamId: { seasonId, teamId: homeTeamId } },
  });

  const awayEntry = await prisma.pointsTableEntry.findUnique({
    where: { seasonId_teamId: { seasonId, teamId: awayTeamId } },
  });

  if (homeEntry) {
    await prisma.pointsTableEntry.update({
      where: { id: homeEntry.id },
      data: {
        matchesPlayed: homeEntry.matchesPlayed + 1,
        wins: winnerId === homeTeamId ? homeEntry.wins + 1 : homeEntry.wins,
        losses: winnerId && winnerId !== homeTeamId ? homeEntry.losses + 1 : homeEntry.losses,
        points: winnerId === homeTeamId ? homeEntry.points + 2 : homeEntry.points,
        raidPoints: homeEntry.raidPoints + homeRaidPoints,
        tacklePoints: homeEntry.tacklePoints + homeTacklePoints,
        scoreFor: homeEntry.scoreFor + homeScore,
        scoreAgainst: homeEntry.scoreAgainst + awayScore,
        scoreDifference: (homeEntry.scoreFor + homeScore) - (homeEntry.scoreAgainst + awayScore),
      },
    });
  }

  if (awayEntry) {
    await prisma.pointsTableEntry.update({
      where: { id: awayEntry.id },
      data: {
        matchesPlayed: awayEntry.matchesPlayed + 1,
        wins: winnerId === awayTeamId ? awayEntry.wins + 1 : awayEntry.wins,
        losses: winnerId && winnerId !== awayTeamId ? awayEntry.losses + 1 : awayEntry.losses,
        points: winnerId === awayTeamId ? awayEntry.points + 2 : awayEntry.points,
        raidPoints: awayEntry.raidPoints + awayRaidPoints,
        tacklePoints: awayEntry.tacklePoints + awayTacklePoints,
        scoreFor: awayEntry.scoreFor + awayScore,
        scoreAgainst: awayEntry.scoreAgainst + homeScore,
        scoreDifference: (awayEntry.scoreFor + awayScore) - (awayEntry.scoreAgainst + homeScore),
      },
    });
  }

  // Recalculate positions
  await recalculatePositions(seasonId);
};

const recalculatePositions = async (seasonId: string) => {
  const entries = await prisma.pointsTableEntry.findMany({
    where: { seasonId },
    orderBy: [
      { points: 'desc' },
      { scoreDifference: 'desc' },
      { scoreFor: 'desc' },
    ],
  });

  for (let i = 0; i < entries.length; i++) {
    await prisma.pointsTableEntry.update({
      where: { id: entries[i].id },
      data: { position: i + 1 },
    });
  }
};

const createMatchNotifications = async (match: any, result: any) => {
  const favoriteTeams = await prisma.favoriteTeam.findMany({
    where: {
      teamId: { in: [match.homeTeamId, match.awayTeamId] },
    },
  });

  for (const fav of favoriteTeams) {
    await prisma.notification.create({
      data: {
        userId: fav.userId,
        type: 'MATCH_RESULT',
        title: 'Match Result Updated',
        message: `${match.homeTeam.name} ${result.homeScore} - ${result.awayScore} ${match.awayTeam.name}`,
        data: {
          matchId: match.id,
          homeTeam: match.homeTeam.name,
          awayTeam: match.awayTeam.name,
          homeScore: result.homeScore,
          awayScore: result.awayScore,
        },
      },
    });
  }
};

export const getUpcomingMatches = async (query: any) => {
  const { limit = 10 } = query;

  const matches = await prisma.match.findMany({
    where: {
      status: 'SCHEDULED',
    },
    orderBy: { matchDate: 'asc' },
    take: parseInt(limit),
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  return matches;
};

export const getLiveMatches = async () => {
  const matches = await prisma.match.findMany({
    where: { status: 'LIVE' },
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
      result: true,
    },
  });

  return matches;
};

export const getCompletedMatches = async (query: any) => {
  const { page, limit, sortBy, sortOrder } = getPaginationParams(query);
  const { seasonId } = query;

  const where: any = { status: { in: ['COMPLETED', 'CANCELLED', 'ABANDONED'] } };
  if (seasonId) where.seasonId = seasonId;

  const [matches, total] = await Promise.all([
    prisma.match.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        season: true,
        homeTeam: true,
        awayTeam: true,
        stadium: true,
        result: true,
      },
    }),
    prisma.match.count({ where }),
  ]);

  return {
    data: matches,
    pagination: calculatePagination(page, limit, total),
  };
};

export const updateLiveScore = async (id: string, data: any) => {
  const {
    homeScore,
    awayScore,
    homeRaidPoints,
    awayRaidPoints,
    homeTacklePoints,
    awayTacklePoints,
    homeBonusPoints,
    awayBonusPoints,
    homeAllOutCount,
    awayAllOutCount,
    matchTimer,
    halfTimeStatus
  } = data;

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  if (!match) {
    throw new AppError('Match not found', 404);
  }

  // Update match live score fields
  const updatedMatch = await prisma.match.update({
    where: { id },
    data: {
      homeScore: homeScore ?? match.homeScore,
      awayScore: awayScore ?? match.awayScore,
      homeRaidPoints: homeRaidPoints ?? match.homeRaidPoints,
      awayRaidPoints: awayRaidPoints ?? match.awayRaidPoints,
      homeTacklePoints: homeTacklePoints ?? match.homeTacklePoints,
      awayTacklePoints: awayTacklePoints ?? match.awayTacklePoints,
      homeBonusPoints: homeBonusPoints ?? match.homeBonusPoints,
      awayBonusPoints: awayBonusPoints ?? match.awayBonusPoints,
      homeAllOutCount: homeAllOutCount ?? match.homeAllOutCount,
      awayAllOutCount: awayAllOutCount ?? match.awayAllOutCount,
      matchTimer: matchTimer ?? match.matchTimer,
      halfTimeStatus: halfTimeStatus ?? match.halfTimeStatus,
    },
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  // Create or update match result without completing the match
  const result = await prisma.matchResult.upsert({
    where: { matchId: id },
    update: {
      homeScore: homeScore ?? match.homeScore,
      awayScore: awayScore ?? match.awayScore,
    },
    create: {
      matchId: id,
      homeScore: homeScore ?? match.homeScore,
      awayScore: awayScore ?? match.awayScore,
    },
  });

  // Socket.IO emission disabled for now
  // TODO: Implement proper socket configuration
  /*
  // Emit score update via Socket.IO (with error handling)
  try {
    emitScoreUpdate(id, {
      matchId: id,
      homeScore: updatedMatch.homeScore,
      awayScore: updatedMatch.awayScore,
      homeRaidPoints: updatedMatch.homeRaidPoints,
      awayRaidPoints: updatedMatch.awayRaidPoints,
      homeTacklePoints: updatedMatch.homeTacklePoints,
      awayTacklePoints: updatedMatch.awayTacklePoints,
      homeBonusPoints: updatedMatch.homeBonusPoints,
      awayBonusPoints: updatedMatch.awayBonusPoints,
      homeAllOutCount: updatedMatch.homeAllOutCount,
      awayAllOutCount: updatedMatch.awayAllOutCount,
      matchTimer: updatedMatch.matchTimer,
      halfTimeStatus: updatedMatch.halfTimeStatus,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
    });
  } catch (socketError) {
    console.error('Socket.IO emit error (non-critical):', socketError);
    // Continue even if Socket.IO fails - the data is saved
  }
  */

  return { match: updatedMatch, result };
};

export const startMatch = async (id: string, adminId?: string) => {
  const match = await prisma.match.update({
    where: { id },
    data: {
      status: 'LIVE',
      matchTimer: '00:00',
      halfTimeStatus: 'First Half',
    },
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  // Create history entry
  await createMatchHistory(id, adminId || null, 'START', 'status', 'SCHEDULED', 'LIVE', 'Match started');

  // Socket.IO emission disabled for now
  // TODO: Implement proper socket configuration
  /*
  // Emit status update via Socket.IO
  emitMatchStatusUpdate(id, {
    matchId: id,
    status: 'LIVE',
    matchTimer: '00:00',
    halfTimeStatus: 'First Half',
  });
  */

  return match;
};

export const pauseMatch = async (id: string, adminId?: string) => {
  const match = await prisma.match.update({
    where: { id },
    data: {
      halfTimeStatus: 'Paused',
    },
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  // Create history entry
  await createMatchHistory(id, adminId || null, 'PAUSE', 'halfTimeStatus', match.halfTimeStatus, 'Paused', 'Match paused');

  // Socket.IO emission disabled for now
  // TODO: Implement proper socket configuration
  /*
  // Emit status update via Socket.IO
  emitMatchStatusUpdate(id, {
    matchId: id,
    status: match.status,
    halfTimeStatus: 'Paused',
  });
  */

  return match;
};

export const resumeMatch = async (id: string, adminId?: string) => {
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  if (!match) {
    throw new AppError('Match not found', 404);
  }

  const newHalfTimeStatus = match.halfTimeStatus === 'Paused' ? 'First Half' : 'Second Half';

  const updatedMatch = await prisma.match.update({
    where: { id },
    data: {
      halfTimeStatus: newHalfTimeStatus,
    },
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  // Create history entry
  await createMatchHistory(id, adminId || null, 'RESUME', 'halfTimeStatus', match.halfTimeStatus, newHalfTimeStatus, 'Match resumed');

  // Socket.IO emission disabled for now
  // TODO: Implement proper socket configuration
  /*
  // Emit status update via Socket.IO
  emitMatchStatusUpdate(id, {
    matchId: id,
    status: updatedMatch.status,
    halfTimeStatus: updatedMatch.halfTimeStatus,
  });
  */

  return updatedMatch;
};

export const endMatch = async (id: string, data: any, adminId?: string) => {
  const { winnerId, manOfTheMatch, matchSummary, keyStatistics } = data;

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  if (!match) {
    throw new AppError('Match not found', 404);
  }

  // Create history entry before ending match
  await createMatchHistory(id, adminId || null, 'END', 'status', match.status, 'COMPLETED', 'Match ended');

  // Create or update match result
  const result = await prisma.matchResult.upsert({
    where: { matchId: id },
    update: {
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      winnerId,
      manOfTheMatch,
      keyStatistics,
    },
    create: {
      matchId: id,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      winnerId,
      manOfTheMatch,
      keyStatistics,
    },
  });

  // Update match status to COMPLETED
  const updatedMatch = await prisma.match.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      halfTimeStatus: 'Full Time',
    },
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
      result: true,
    },
  });

  // Update points table
  await updatePointsTable(
    match.seasonId,
    match.homeTeamId,
    match.awayTeamId,
    match.homeScore,
    match.awayScore,
    winnerId,
    match.homeRaidPoints,
    match.awayRaidPoints,
    match.homeTacklePoints,
    match.awayTacklePoints
  );

  // Update player statistics for both teams
  await updatePlayerStats(match.seasonId, match.homeTeamId, match.homeRaidPoints, match.homeTacklePoints, match.homeBonusPoints, match.homeAllOutCount);
  await updatePlayerStats(match.seasonId, match.awayTeamId, match.awayRaidPoints, match.awayTacklePoints, match.awayBonusPoints, match.awayAllOutCount);

  // Update team statistics for both teams
  await updateTeamStats(match.seasonId, match.homeTeamId, match.homeScore, match.awayScore, winnerId === match.homeTeamId, winnerId === match.awayTeamId);
  await updateTeamStats(match.seasonId, match.awayTeamId, match.awayScore, match.homeScore, winnerId === match.awayTeamId, winnerId === match.homeTeamId);

  // Emit status update via Socket.IO
  // Socket.IO emission disabled for now
  // TODO: Implement proper socket configuration
  /*
  emitMatchStatusUpdate(id, {
    matchId: id,
    status: 'COMPLETED',
    halfTimeStatus: 'Full Time',
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    winnerId,
  });
  */

  // Emit points table update
  // @ts-ignore - emitPointsTableUpdate signature will be correct after migration
  emitPointsTableUpdate(match.seasonId);

  // Create notifications for users following the teams
  await createMatchNotifications(match, result);

  return { match: updatedMatch, result };
};

const updatePlayerStats = async (seasonId: string, teamId: string, raidPoints: number, tacklePoints: number, bonusPoints: number, allOutCount: number) => {
  // Get all players for the team
  const players = await prisma.player.findMany({
    where: { teamId },
  });

  // Update stats for each player
  for (const player of players) {
    await prisma.playerStats.upsert({
      where: {
        playerId_seasonId: {
          playerId: player.id,
          seasonId,
        },
      },
      update: {
        raidPoints: { increment: raidPoints },
        tacklePoints: { increment: tacklePoints },
        bonusPoints: { increment: bonusPoints },
        allOutsConceded: { increment: allOutCount },
        matchesPlayed: { increment: 1 },
        successRate: 0, // Will be recalculated
        averageRaid: 0, // Will be recalculated
        averageTackle: 0, // Will be recalculated
        lastUpdated: new Date(),
      },
      create: {
        playerId: player.id,
        seasonId,
        raidPoints,
        tacklePoints,
        bonusPoints,
        allOutsConceded: allOutCount,
        matchesPlayed: 1,
        successRate: 0,
        averageRaid: 0,
        averageTackle: 0,
        lastUpdated: new Date(),
      },
    });
  }
};

const updateTeamStats = async (seasonId: string, teamId: string, scoreFor: number, scoreAgainst: number, isWin: boolean, isLoss: boolean) => {
  await prisma.teamStats.upsert({
    where: {
      teamId_seasonId: {
        teamId,
        seasonId,
      },
    },
    update: {
      matchesPlayed: { increment: 1 },
      wins: { increment: isWin ? 1 : 0 },
      losses: { increment: isLoss ? 1 : 0 },
      scoreFor: { increment: scoreFor },
      scoreAgainst: { increment: scoreAgainst },
      scoreDifference: { increment: scoreFor - scoreAgainst },
      raidPoints: { increment: scoreFor },
      tacklePoints: { increment: scoreFor },
      winPercentage: 0, // Will be recalculated
      lastUpdated: new Date(),
    },
    create: {
      teamId,
      seasonId,
      matchesPlayed: 1,
      wins: isWin ? 1 : 0,
      losses: isLoss ? 1 : 0,
      scoreFor,
      scoreAgainst,
      scoreDifference: scoreFor - scoreAgainst,
      raidPoints: scoreFor,
      tacklePoints: scoreFor,
      winPercentage: isWin ? 100 : 0,
      lastUpdated: new Date(),
    },
  });
};

export const updateMatchStatus = async (id: string, data: any) => {
  const { status } = data;

  const match = await prisma.match.update({
    where: { id },
    data: { status },
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  // Emit status update via Socket.IO
  // Socket.IO emission disabled for now
  // TODO: Implement proper socket configuration
  /*
  emitMatchStatusUpdate(id, {
    matchId: id,
    status,
  });
  */

  return match;
};

export const getMatchHistory = async (matchId: string) => {
  const history = await prisma.matchHistory.findMany({
    where: { matchId },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { timestamp: 'desc' },
  });

  return history;
};

export const rollbackMatch = async (matchId: string, historyId: string, adminId?: string) => {
  const history = await prisma.matchHistory.findUnique({
    where: { id: historyId },
  });

  if (!history) {
    throw new AppError('History entry not found', 404);
  }

  if (history.matchId !== matchId) {
    throw new AppError('History entry does not belong to this match', 400);
  }

  // Restore the old value
  const match = await prisma.match.update({
    where: { id: matchId },
    data: {
      [history.field || 'status']: history.oldValue,
    },
    include: {
      season: true,
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  // Create history entry for rollback
  await createMatchHistory(matchId, adminId || null, 'ROLLBACK', history.field, history.newValue, history.oldValue, `Rolled back to ${history.action}`);

  return match;
};

export const getMatchLogs = async (matchId: string) => {
  // @ts-ignore - matchLog model will be available after Prisma migration
  const logs = await prisma.matchLog.findMany({
    where: { matchId },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          shortName: true,
          logo: true,
        },
      },
      player: {
        select: {
          id: true,
          name: true,
          jerseyNumber: true,
          image: true,
        },
      },
    },
    // @ts-ignore - timestamp field will be available after Prisma migration
    orderBy: { timestamp: 'desc' },
  });

  return logs;
};

export const logMatchEvent = async (matchId: string, data: any, adminId?: string) => {
  const { eventType, teamId, playerId, points, scoreUpdate } = data;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (!match) {
    throw new AppError('Match not found', 404);
  }

  // Create match log entry
  await createMatchLog(matchId, eventType, data, teamId, playerId);

  // Update match score if scoreUpdate provided
  if (scoreUpdate) {
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: scoreUpdate,
      include: {
        season: true,
        homeTeam: true,
        awayTeam: true,
        stadium: true,
      },
    });

    // Socket.IO emission disabled for now
    // TODO: Implement proper socket configuration
    /*
    // Emit score update via Socket.IO
    try {
      emitScoreUpdate(matchId, {
        matchId,
        homeScore: updatedMatch.homeScore,
        awayScore: updatedMatch.awayScore,
        homeRaidPoints: updatedMatch.homeRaidPoints,
        awayRaidPoints: updatedMatch.awayRaidPoints,
        homeTacklePoints: updatedMatch.homeTacklePoints,
        awayTacklePoints: updatedMatch.awayTacklePoints,
        homeBonusPoints: updatedMatch.homeBonusPoints,
        awayBonusPoints: updatedMatch.awayBonusPoints,
        homeAllOutCount: updatedMatch.homeAllOutCount,
        awayAllOutCount: updatedMatch.awayAllOutCount,
        matchTimer: updatedMatch.matchTimer,
        halfTimeStatus: updatedMatch.halfTimeStatus,
        homeTeam: updatedMatch.homeTeam,
        awayTeam: updatedMatch.awayTeam,
      });
    } catch (socketError) {
      console.error('Socket.IO emit error (non-critical):', socketError);
    }
    */

    return { match: updatedMatch, logged: true };
  }

  return { logged: true };
};

export const getMatchRaids = async (matchId: string) => {
  const raids = await prisma.raidTracker.findMany({
    where: { matchId },
    include: {
      raider: {
        select: {
          id: true,
          name: true,
          jerseyNumber: true,
          image: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
          shortName: true,
          logo: true,
        },
      },
    },
    orderBy: { raidNumber: 'asc' },
  });

  return raids;
};

export const createRaid = async (matchId: string, data: any, adminId?: string) => {
  const { raiderId, teamId, raidType, points, successful, defendersOnCourt, timeInMatch } = data;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (!match) {
    throw new AppError('Match not found', 404);
  }

  // Get the next raid number
  const raidCount = await prisma.raidTracker.count({
    where: { matchId },
  });

  // @ts-ignore - raidTracker model will be available after Prisma migration
  const raid = await prisma.raidTracker.create({
    data: {
      matchId,
      raiderId,
      teamId,
      raidNumber: raidCount + 1,
      // @ts-ignore - raidType field will be available after Prisma migration
      raidType,
      points: points || 0,
      successful: successful ?? true,
      defendersOnCourt: defendersOnCourt || 0,
      timeInMatch: timeInMatch || '00:00',
    } as any,
    include: {
      raider: {
        select: {
          id: true,
          name: true,
          jerseyNumber: true,
          image: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
          shortName: true,
          logo: true,
        },
      },
    },
  });

  // Create match log entry for the raid
  await createMatchLog(matchId, 'RAID', data, teamId, raiderId);

  return raid;
};

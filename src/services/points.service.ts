import { prisma } from '../config';
import { AppError } from '../middleware/error';

export const getPointsTable = async (query: any) => {
  const { seasonId } = query;

  let activeSeason;
  if (seasonId) {
    activeSeason = await prisma.season.findUnique({ where: { id: seasonId } });
  } else {
    activeSeason = await prisma.season.findFirst({ where: { isActive: true } });
  }

  if (!activeSeason) {
    // Return empty array instead of throwing error
    return [];
  }

  const pointsTable = await prisma.pointsTableEntry.findMany({
    where: { seasonId: activeSeason.id },
    orderBy: [
      { position: 'asc' },
      { points: 'desc' },
      { scoreDifference: 'desc' },
    ],
    include: {
      team: true,
      season: true,
    },
  });

  // Filter out hidden teams and inactive teams
  const filteredPointsTable = pointsTable.filter(entry => 
    !entry.team.name.includes('HIDDEN') && entry.team.isActive === true
  );

  return filteredPointsTable;
};

export const getPointsTableBySeason = async (seasonId: string) => {
  const pointsTable = await prisma.pointsTableEntry.findMany({
    where: { seasonId },
    orderBy: [
      { position: 'asc' },
      { points: 'desc' },
      { scoreDifference: 'desc' },
    ],
    include: {
      team: true,
      season: true,
    },
  });

  // Filter out hidden teams and inactive teams
  const filteredPointsTable = pointsTable.filter(entry => 
    !entry.team.name.includes('HIDDEN') && entry.team.isActive === true
  );

  return filteredPointsTable;
};

export const updatePointsTable = async (id: string, data: any) => {
  const entry = await prisma.pointsTableEntry.update({
    where: { id },
    data,
    include: {
      team: true,
      season: true,
    },
  });

  return entry;
};

export const recalculatePointsTable = async (seasonId: string) => {
  // Reset all entries
  const entries = await prisma.pointsTableEntry.findMany({
    where: { seasonId },
  });

  for (const entry of entries) {
    await prisma.pointsTableEntry.update({
      where: { id: entry.id },
      data: {
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        points: 0,
        scoreFor: 0,
        scoreAgainst: 0,
        scoreDifference: 0,
      } as any,
    });
  }

  // Get all completed matches
  const matches = await prisma.match.findMany({
    where: {
      seasonId,
      status: 'COMPLETED',
    },
    include: {
      result: true,
    },
  });

  // Recalculate from matches
  for (const match of matches) {
    if (match.result) {
      await updatePointsTableHelper(
        seasonId,
        match.homeTeamId,
        match.awayTeamId,
        match.result.homeScore,
        match.result.awayScore,
        match.result.winnerId
      );
    }
  }

  // Recalculate ranks
  const updatedEntries = await prisma.pointsTableEntry.findMany({
    where: { seasonId },
    orderBy: [
      { points: 'desc' },
      { scoreDifference: 'desc' },
      { scoreFor: 'desc' },
    ],
  });

  for (let i = 0; i < updatedEntries.length; i++) {
    await prisma.pointsTableEntry.update({
      where: { id: updatedEntries[i].id },
      data: { rank: i + 1 } as any,
    });
  }

  return { message: 'Points table recalculated successfully' };
};

// Helper function (imported from match.service)
const updatePointsTableHelper = async (
  seasonId: string,
  homeTeamId: string,
  awayTeamId: string,
  homeScore: number,
  awayScore: number,
  winnerId: string | null
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
        scoreFor: awayEntry.scoreFor + awayScore,
        scoreAgainst: awayEntry.scoreAgainst + homeScore,
        scoreDifference: (awayEntry.scoreFor + awayScore) - (awayEntry.scoreAgainst + homeScore),
      },
    });
  }
};

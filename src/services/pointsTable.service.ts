import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { emitPointsTableUpdate } from '../config/socket';

export const getPointsTable = async (query: any) => {
  const { seasonId } = query;

  const where: any = {};
  if (seasonId) where.seasonId = seasonId;

  const entries = await prisma.pointsTableEntry.findMany({
    where,
    include: {
      season: true,
      team: true,
    },
    orderBy: [
      { points: 'desc' },
      { scoreDifference: 'desc' },
      { scoreFor: 'desc' },
    ],
  });

  return entries;
};

export const getPointsTableBySeason = async (seasonId: string) => {
  const entries = await prisma.pointsTableEntry.findMany({
    where: { seasonId },
    include: {
      season: true,
      team: true,
    },
    orderBy: [
      { points: 'desc' },
      { scoreDifference: 'desc' },
      { scoreFor: 'desc' },
    ],
  });

  return entries;
};

export const updatePointsTableEntry = async (id: string, data: any) => {
  const {
    position,
    matchesPlayed,
    wins,
    losses,
    ties,
    points,
    raidPoints,
    tacklePoints,
    scoreFor,
    scoreAgainst,
    scoreDifference,
  } = data;

  const entry = await prisma.pointsTableEntry.update({
    where: { id },
    data: {
      position: position ?? undefined,
      matchesPlayed: matchesPlayed ?? undefined,
      wins: wins ?? undefined,
      losses: losses ?? undefined,
      ties: ties ?? undefined,
      points: points ?? undefined,
      raidPoints: raidPoints ?? undefined,
      tacklePoints: tacklePoints ?? undefined,
      scoreFor: scoreFor ?? undefined,
      scoreAgainst: scoreAgainst ?? undefined,
      scoreDifference: scoreDifference ?? undefined,
      lastUpdated: new Date(),
    },
    include: {
      season: true,
      team: true,
    },
  });

  // Emit points table update via Socket.IO
  emitPointsTableUpdate(entry.seasonId, entry);

  return entry;
};

export const createPointsTableEntry = async (data: any) => {
  const {
    seasonId,
    teamId,
    position,
    matchesPlayed,
    wins,
    losses,
    ties,
    points,
    raidPoints,
    tacklePoints,
    scoreFor,
    scoreAgainst,
    scoreDifference,
  } = data;

  const entry = await prisma.pointsTableEntry.create({
    data: {
      seasonId,
      teamId,
      position: position ?? 0,
      matchesPlayed: matchesPlayed ?? 0,
      wins: wins ?? 0,
      losses: losses ?? 0,
      ties: ties ?? 0,
      points: points ?? 0,
      raidPoints: raidPoints ?? 0,
      tacklePoints: tacklePoints ?? 0,
      scoreFor: scoreFor ?? 0,
      scoreAgainst: scoreAgainst ?? 0,
      scoreDifference: scoreDifference ?? 0,
    },
    include: {
      season: true,
      team: true,
    },
  });

  // Emit points table update via Socket.IO
  emitPointsTableUpdate(seasonId, entry);

  return entry;
};

export const deletePointsTableEntry = async (id: string) => {
  const entry = await prisma.pointsTableEntry.findUnique({ where: { id } });
  if (!entry) {
    throw new AppError('Points table entry not found', 404);
  }

  await prisma.pointsTableEntry.delete({ where: { id } });
};

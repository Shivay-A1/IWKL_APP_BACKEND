import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { uploadToS3, generateS3Key } from '../utils';
import { getPaginationParams, calculatePagination } from '../utils';

export const createPlayer = async (data: any, file?: Express.Multer.File) => {
  let imageUrl = data.image;
  
  if (file) {
    const key = generateS3Key('players/images', file.originalname);
    imageUrl = await uploadToS3(file.buffer, key, file.mimetype);
  }

  const player = await prisma.player.create({
    data: {
      ...data,
      image: imageUrl,
    },
    include: {
      team: {
        include: {
          season: true,
        },
      },
    },
  });

  return player;
};

export const getPlayers = async (query: any) => {
  const { page, limit, sortBy, sortOrder } = getPaginationParams(query);
  const { teamId, search, isActive } = query;

  const where: any = {};
  if (teamId) where.teamId = teamId;
  if (search) where.name = { contains: search, mode: 'insensitive' };
  if (isActive !== undefined) where.isActive = isActive === 'true';

  const [players, total] = await Promise.all([
    prisma.player.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        team: true,
      },
    }),
    prisma.player.count({ where }),
  ]);

  return {
    data: players,
    pagination: calculatePagination(page, limit, total),
  };
};

export const getPlayerById = async (id: string) => {
  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      team: {
        include: {
          season: true,
        },
      },
    },
  });

  if (!player) {
    throw new AppError('Player not found', 404);
  }

  return player;
};

export const updatePlayer = async (id: string, data: any, file?: Express.Multer.File) => {
  let imageUrl = data.image;
  
  if (file) {
    const key = generateS3Key('players/images', file.originalname);
    imageUrl = await uploadToS3(file.buffer, key, file.mimetype);
  }

  const player = await prisma.player.update({
    where: { id },
    data: {
      ...data,
      ...(imageUrl && { image: imageUrl }),
    },
    include: {
      team: true,
    },
  });

  return player;
};

export const deletePlayer = async (id: string) => {
  const player = await prisma.player.findUnique({ where: { id } });
  if (!player) {
    throw new AppError('Player not found', 404);
  }

  await prisma.player.delete({ where: { id } });
};

export const getPlayersByTeam = async (teamId: string) => {
  const players = await prisma.player.findMany({
    where: { teamId, isActive: true },
    orderBy: { jerseyNumber: 'asc' },
    include: {
      team: true,
    },
  });

  return players;
};

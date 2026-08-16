import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { getPaginationParams, calculatePagination } from '../utils';

export const createSeason = async (data: any) => {
  const existingSeason = await prisma.season.findUnique({
    where: { name: data.name },
  });

  if (existingSeason) {
    throw new AppError('Season with this name already exists', 409);
  }

  const season = await prisma.season.create({
    data,
  });

  return season;
};

export const getSeasons = async (query: any) => {
  const { page, limit, sortBy, sortOrder } = getPaginationParams(query);
  const { search, isActive } = query;

  const where: any = {};
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const [seasons, total] = await Promise.all([
    prisma.season.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: {
            teams: true,
            matches: true,
          },
        },
      },
    }),
    prisma.season.count({ where }),
  ]);

  return {
    data: seasons,
    pagination: calculatePagination(page, limit, total),
  };
};

export const getSeasonById = async (id: string) => {
  const season = await prisma.season.findUnique({
    where: { id },
    include: {
      teams: {
        where: { isActive: true },
        include: {
          _count: {
            select: {
              players: true,
            },
          },
        },
      },
      matches: {
        orderBy: { matchDate: 'desc' },
        take: 10,
      },
      champions: {
        include: {
          team: true,
        },
      },
    },
  });

  if (!season) {
    throw new AppError('Season not found', 404);
  }

  return season;
};

export const updateSeason = async (id: string, data: any) => {
  const season = await prisma.season.update({
    where: { id },
    data,
  });

  return season;
};

export const deleteSeason = async (id: string) => {
  const season = await prisma.season.findUnique({ where: { id } });
  if (!season) {
    throw new AppError('Season not found', 404);
  }

  if (season.isActive) {
    throw new AppError('Cannot delete active season', 400);
  }

  await prisma.season.delete({ where: { id } });
};

export const setActiveSeason = async (id: string) => {
  // Deactivate all seasons
  await prisma.season.updateMany({
    data: { isActive: false },
  });

  // Activate the requested season
  const season = await prisma.season.update({
    where: { id },
    data: { isActive: true },
  });

  return season;
};

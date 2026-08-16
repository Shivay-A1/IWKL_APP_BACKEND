import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { getPaginationParams, calculatePagination } from '../utils';

export const getUsers = async (query: any) => {
  const { page, limit, sortBy, sortOrder } = getPaginationParams(query);
  const { role, search, isVerified } = query;

  const where: any = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (isVerified !== undefined) where.isVerified = isVerified === 'true';

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { [sortBy as string]: sortOrder as 'asc' | 'desc' },
      skip: ((page || 1) - 1) * (limit || 10),
      take: limit || 10,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isVerified: true,
        lastLogin: true,
        createdAt: true,
        _count: {
          select: {
            favoriteTeams: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    pagination: calculatePagination(page || 1, limit || 10, total),
  };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      isVerified: true,
      lastLogin: true,
      createdAt: true,
      favoriteTeams: {
        include: {
          team: true,
        },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

export const updateUser = async (id: string, data: any) => {
  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      isVerified: true,
      lastLogin: true,
      createdAt: true,
    },
  });

  return user;
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  await prisma.user.delete({ where: { id } });
};

export const updateUserRole = async (id: string, role: string) => {
  const user = await prisma.user.update({
    where: { id },
    data: { role: role as any },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
};

export const addFavoriteTeam = async (userId: string, teamId: string) => {
  const existing = await prisma.favoriteTeam.findUnique({
    where: { userId_teamId: { userId, teamId } },
  });

  if (existing) {
    throw new AppError('Team already in favorites', 409);
  }

  const favorite = await prisma.favoriteTeam.create({
    data: { userId, teamId },
    include: {
      team: true,
    },
  });

  return favorite;
};

export const removeFavoriteTeam = async (userId: string, teamId: string) => {
  await prisma.favoriteTeam.delete({
    where: { userId_teamId: { userId, teamId } },
  });
};

export const getFavoriteTeams = async (userId: string) => {
  const favorites = await prisma.favoriteTeam.findMany({
    where: { userId },
    include: {
      team: {
        include: {
          season: true,
        },
      },
    },
  });

  return favorites;
};

export const getDashboardStats = async () => {
  const [
    totalTeams,
    totalPlayers,
    totalMatches,
    totalUsers,
    totalVideos,
    totalNews,
    activeSeason,
  ] = await Promise.all([
    prisma.team.count({ where: { isActive: true } }),
    prisma.player.count({ where: { isActive: true } }),
    prisma.match.count(),
    prisma.user.count(),
    prisma.video.count(),
    prisma.news.count({ where: { isPublished: true } }),
    prisma.season.findFirst({ where: { isActive: true } }),
  ]);

  return {
    totalTeams,
    totalPlayers,
    totalMatches,
    totalUsers,
    totalVideos,
    totalNews,
    activeSeason,
  };
};

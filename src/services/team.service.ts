import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { uploadToS3, generateS3Key } from '../utils';
import { getPaginationParams, calculatePagination } from '../utils';

export const createTeam = async (data: any, logoFile?: Express.Multer.File, bannerFile?: Express.Multer.File) => {
  let logoUrl = data.logo;
  let bannerUrl = data.banner;
  
  if (logoFile) {
    const key = generateS3Key('teams/logos', logoFile.originalname);
    logoUrl = await uploadToS3(logoFile.buffer, key, logoFile.mimetype);
  }

  if (bannerFile) {
    const key = generateS3Key('teams/banners', bannerFile.originalname);
    bannerUrl = await uploadToS3(bannerFile.buffer, key, bannerFile.mimetype);
  }

  const team = await prisma.team.create({
    data: {
      ...data,
      logo: logoUrl,
      ...(bannerUrl && { banner: bannerUrl }),
    },
    include: {
      season: true,
    },
  });

  // Initialize points table entry
  await prisma.pointsTableEntry.create({
    data: {
      seasonId: team.seasonId,
      teamId: team.id,
      position: 0,
    },
  });

  return team;
};

export const createTeamWithLogoUrl = async (data: any) => {
  const logoUrl = data.logoUrl;

  const team = await prisma.team.create({
    data: {
      name: data.name,
      shortName: data.shortName,
      seasonId: data.seasonId,
      logo: logoUrl,
    },
    include: {
      season: true,
    },
  });

  // Initialize points table entry
  await prisma.pointsTableEntry.create({
    data: {
      seasonId: team.seasonId,
      teamId: team.id,
      position: 0,
    },
  });

  return team;
};

export const createTeamSimple = async (data: any) => {
  const team = await prisma.team.create({
    data: {
      name: data.name,
      shortName: data.shortName,
      logo: data.logoUrl || null,
      banner: data.bannerUrl || null,
      seasonId: data.seasonId || 'default-season',
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
    include: {
      season: true,
    },
  });

  // Initialize points table entry
  try {
    await prisma.pointsTableEntry.create({
      data: {
        seasonId: team.seasonId,
        teamId: team.id,
        position: 0,
      },
    });
  } catch (pointsError) {
    console.warn('Failed to create points table entry:', pointsError);
  }

  return team;
};

export const getTeams = async (query: any) => {
  const { page, limit, sortBy, sortOrder } = getPaginationParams(query);
  const { seasonId, search, isActive } = query;

  const where: any = {};
  if (seasonId) where.seasonId = seasonId;
  if (search) where.name = { contains: search, mode: 'insensitive' };
  if (isActive !== undefined) where.isActive = isActive === 'true';

  const [teams, total] = await Promise.all([
    prisma.team.findMany({
      where,
      orderBy: { [sortBy as string]: sortOrder as 'asc' | 'desc' },
      skip: ((page || 1) - 1) * (limit || 10),
      take: limit || 10,
      select: {
        id: true,
        name: true,
        shortName: true,
        logo: true,
        banner: true,
        jerseyColor: true,
        city: true,
        stadiumId: true,
        coach: true,
        foundedYear: true,
        description: true,
        isActive: true,
        seasonId: true,
        season: {
          select: {
            id: true,
            name: true,
            year: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            players: true,
          },
        },
      },
    }),
    prisma.team.count({ where }),
  ]);

  return {
    success: true,
    data: teams,
    pagination: calculatePagination(page || 1, limit || 10, total),
  };
};

export const getTeamById = async (id: string) => {
  const team = await prisma.team.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      shortName: true,
      logo: true,
      banner: true,
      jerseyColor: true,
      city: true,
      stadiumId: true,
      coach: true,
      foundedYear: true,
      description: true,
      socialMedia: true,
      isActive: true,
      seasonId: true,
      season: {
        select: {
          id: true,
          name: true,
          year: true,
          isActive: true,
        },
      },
      players: {
        where: { isActive: true },
        orderBy: { jerseyNumber: 'asc' },
        select: {
          id: true,
          name: true,
          image: true,
          jerseyNumber: true,
          position: true,
          height: true,
          weight: true,
          dateOfBirth: true,
          nationality: true,
          biography: true,
          isActive: true,
        },
      },
      pointsTable: {
        select: {
          id: true,
          position: true,
          matchesPlayed: true,
          wins: true,
          losses: true,
          points: true,
          scoreDifference: true,
          highestScore: true,
          season: {
            select: {
              id: true,
              name: true,
              year: true,
            },
          },
        },
      },
      homeMatches: {
        select: {
          id: true,
          matchDate: true,
          status: true,
          homeScore: true,
          awayScore: true,
          awayTeam: {
            select: {
              id: true,
              name: true,
              shortName: true,
              logo: true,
            },
          },
          result: {
            select: {
              id: true,
              winnerId: true,
              homeScore: true,
              awayScore: true,
            },
          },
        },
        orderBy: { matchDate: 'desc' },
        take: 5,
      },
      awayMatches: {
        select: {
          id: true,
          matchDate: true,
          status: true,
          homeScore: true,
          awayScore: true,
          homeTeam: {
            select: {
              id: true,
              name: true,
              shortName: true,
              logo: true,
            },
          },
          result: {
            select: {
              id: true,
              winnerId: true,
              homeScore: true,
              awayScore: true,
            },
          },
        },
        orderBy: { matchDate: 'desc' },
        take: 5,
      },
    },
  });

  if (!team) {
    throw new AppError('Team not found', 404);
  }

  return team;
};

export const updateTeam = async (id: string, data: any, logoFile?: Express.Multer.File, bannerFile?: Express.Multer.File) => {
  let logoUrl = data.logo;
  let bannerUrl = data.banner;
  
  if (logoFile) {
    const key = generateS3Key('teams/logos', logoFile.originalname);
    logoUrl = await uploadToS3(logoFile.buffer, key, logoFile.mimetype);
  }

  if (bannerFile) {
    const key = generateS3Key('teams/banners', bannerFile.originalname);
    bannerUrl = await uploadToS3(bannerFile.buffer, key, bannerFile.mimetype);
  }

  // Filter data to only include valid Team model fields
  const validFields = {
    name: data.name,
    shortName: data.shortName,
    city: data.city,
    stadiumId: data.stadiumId,
    coach: data.coach,
    seasonId: data.seasonId,
    description: data.description,
    jerseyColor: data.primaryColor || data.jerseyColor, // Map primaryColor to jerseyColor
    foundedYear: data.founded ? parseInt(data.founded) : data.foundedYear,
    isActive: data.isActive,
  };

  // Remove undefined values (but keep false for isActive)
  Object.keys(validFields).forEach(key => {
    if (validFields[key] === undefined || validFields[key] === '') {
      delete validFields[key];
    }
  });

  const team = await prisma.team.update({
    where: { id },
    data: {
      ...validFields,
      ...(logoUrl && { logo: logoUrl }),
      ...(bannerUrl && { banner: bannerUrl }),
    },
    include: {
      season: true,
    },
  });

  return team;
};

export const deleteTeam = async (id: string) => {
  const team = await prisma.team.findUnique({ where: { id } });
  if (!team) {
    throw new AppError('Team not found', 404);
  }

  await prisma.team.delete({ where: { id } });
};

export const getTeamStats = async (id: string) => {
  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      pointsTable: true,
      homeMatches: {
        include: { result: true },
      },
      awayMatches: {
        include: { result: true },
      },
    },
  });

  if (!team) {
    throw new AppError('Team not found', 404);
  }

  const allMatches = [...team.homeMatches, ...team.awayMatches];
  const completedMatches = allMatches.filter(m => m.result);

  return {
    team: {
      id: team.id,
      name: team.name,
      logo: team.logo,
    },
    stats: {
      totalMatches: completedMatches.length,
      wins: completedMatches.filter(m => m.result?.winnerId === team.id).length,
      losses: completedMatches.filter(m => m.result?.winnerId !== team.id && m.result).length,
      pointsTable: team.pointsTable,
    },
  };
};

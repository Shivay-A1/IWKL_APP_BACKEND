import { prisma } from '../config';
import { AppError } from '../middleware/error';

export const registerFanClub = async (data: {
  fullName: string;
  mobileNumber: string;
  email: string;
  city: string;
  state: string;
  gender: string;
  age: number;
  favoriteTeamId: string;
  documentSignature?: string;
}) => {
  if (!prisma) {
    throw new AppError('Database not available', 503);
  }
  return await prisma.fanClubRegistration.create({
    data,
  });
};

export const getAllRegistrations = async (search?: string) => {
  if (!prisma) {
    throw new AppError('Database not available', 503);
  }
  const where = search
    ? {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { mobileNumber: { contains: search, mode: 'insensitive' as const } },
          { city: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  return await prisma.fanClubRegistration.findMany({
    where,
    include: {
      favoriteTeam: {
        select: {
          id: true,
          name: true,
          shortName: true,
          logo: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getRegistrationById = async (id: string) => {
  if (!prisma) {
    throw new AppError('Database not available', 503);
  }
  const registration = await prisma.fanClubRegistration.findUnique({
    where: { id },
    include: {
      favoriteTeam: {
        select: {
          id: true,
          name: true,
          shortName: true,
          logo: true,
        },
      },
    },
  });

  if (!registration) {
    throw new AppError('Registration not found', 404);
  }

  return registration;
};

export const exportRegistrations = async () => {
  if (!prisma) {
    throw new AppError('Database not available', 503);
  }
  const registrations = await prisma.fanClubRegistration.findMany({
    include: {
      favoriteTeam: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const headers = ['Full Name', 'Mobile Number', 'Email', 'City', 'State', 'Gender', 'Age', 'Favorite Team', 'Registration Date'];
  const rows = registrations.map((r) => [
    r.fullName,
    r.mobileNumber,
    r.email,
    r.city,
    r.state,
    r.gender,
    r.age,
    r.favoriteTeam?.name || 'N/A',
    r.createdAt.toISOString(),
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  return csv;
};

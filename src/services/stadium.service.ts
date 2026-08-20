import getPrisma from '../config/database';
import { AppError } from '../middleware/error';

// Helper function to check if prisma is available
const isPrismaAvailable = () => getPrisma() !== null;

export const createStadium = async (data: any, file?: any) => {
  const prisma = getPrisma();
  if (!prisma) {
    throw new AppError('Database not available', 503);
  }
  
  const { name, city, state, capacity, description } = data;
  const image = file ? file.path : null;

  const stadium = await prisma.stadium.create({
    data: {
      name,
      city,
      state,
      capacity: capacity ? parseInt(capacity) : null,
      image,
      description,
    },
  });

  return stadium;
};

export const getStadiums = async (query: any) => {
  const { city, isActive } = query;
  const where: any = {};

  if (city) {
    where.city = city;
  }

  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const stadiums = await prisma.stadium.findMany({
    where,
    include: {
      teams: true,
    },
    orderBy: { name: 'asc' },
  });

  return stadiums;
};

export const getStadiumById = async (id: string) => {
  const stadium = await prisma.stadium.findUnique({
    where: { id },
    include: {
      teams: true,
    },
  });

  if (!stadium) {
    throw new AppError('Stadium not found', 404);
  }

  return stadium;
};

export const updateStadium = async (id: string, data: any, file?: any) => {
  const { name, city, state, capacity, description, isActive } = data;
  const image = file ? file.path : undefined;

  const stadium = await prisma.stadium.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(city && { city }),
      ...(state !== undefined && { state }),
      ...(capacity !== undefined && { capacity: parseInt(capacity) }),
      ...(image !== undefined && { image }),
      ...(description !== undefined && { description }),
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
    },
    include: {
      teams: true,
    },
  });

  return stadium;
};

export const deleteStadium = async (id: string) => {
  const stadium = await prisma.stadium.findUnique({
    where: { id },
    include: {
      matches: true,
    },
  });

  if (!stadium) {
    throw new AppError('Stadium not found', 404);
  }

  if (stadium.matches.length > 0) {
    throw new AppError('Cannot delete stadium with associated matches', 400);
  }

  await prisma.stadium.delete({
    where: { id },
  });
};

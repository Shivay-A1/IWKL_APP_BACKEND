import { prisma } from '../config';
import { AppError } from '../middleware/error';

export const getAllLeadership = async () => {
  return await prisma.leadership.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
};

export const getLeadershipById = async (id: string) => {
  const leadership = await prisma.leadership.findUnique({
    where: { id },
  });

  if (!leadership) {
    throw new AppError('Leadership member not found', 404);
  }

  return leadership;
};

export const createLeadership = async (data: {
  name: string;
  designation: string;
  description: string;
  photo: string;
  order?: number;
}) => {
  return await prisma.leadership.create({
    data,
  });
};

export const updateLeadership = async (
  id: string,
  data: {
    name?: string;
    designation?: string;
    description?: string;
    photo?: string;
    order?: number;
    isActive?: boolean;
  }
) => {
  const existing = await prisma.leadership.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError('Leadership member not found', 404);
  }

  return await prisma.leadership.update({
    where: { id },
    data,
  });
};

export const deleteLeadership = async (id: string) => {
  const existing = await prisma.leadership.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError('Leadership member not found', 404);
  }

  await prisma.leadership.delete({
    where: { id },
  });
};

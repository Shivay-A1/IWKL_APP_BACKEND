import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createVideoCategory = async (data: any) => {
  return await prisma.videoCategory.create({
    data: {
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description,
      displayOrder: data.displayOrder || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
};

export const getVideoCategories = async () => {
  return await prisma.videoCategory.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
  });
};

export const getVideoCategoryById = async (id: string) => {
  return await prisma.videoCategory.findUnique({
    where: { id },
  });
};

export const updateVideoCategory = async (id: string, data: any) => {
  return await prisma.videoCategory.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      displayOrder: data.displayOrder,
      isActive: data.isActive,
    },
  });
};

export const deleteVideoCategory = async (id: string) => {
  return await prisma.videoCategory.delete({
    where: { id },
  });
};

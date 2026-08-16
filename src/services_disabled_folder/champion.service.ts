import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { uploadToS3, generateS3Key, deleteFromS3 } from '../utils';
import { getPaginationParams, calculatePagination } from '../utils';

export const createChampion = async (data: any, file?: Express.Multer.File) => {
  let trophyImage = data.trophyImage;

  if (file) {
    const key = generateS3Key('champions', file.originalname);
    trophyImage = await uploadToS3(file.buffer, key, file.mimetype);
  }

  const champion = await prisma.champion.create({
    data: {
      ...data,
      trophyImage,
    },
    include: {
      season: true,
      team: true,
    },
  });

  return champion;
};

export const getChampions = async (query: any) => {
  const { page, limit, sortBy, sortOrder } = getPaginationParams(query);

  const [champions, total] = await Promise.all([
    prisma.champion.findMany({
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        season: true,
        team: true,
      },
    }),
    prisma.champion.count(),
  ]);

  return {
    data: champions,
    pagination: calculatePagination(page, limit, total),
  };
};

export const getChampionBySeason = async (seasonId: string) => {
  const champion = await prisma.champion.findUnique({
    where: { seasonId },
    include: {
      season: true,
      team: true,
    },
  });

  return champion;
};

export const updateChampion = async (id: string, data: any, file?: Express.Multer.File) => {
  let trophyImage = data.trophyImage;

  if (file) {
    const key = generateS3Key('champions', file.originalname);
    trophyImage = await uploadToS3(file.buffer, key, file.mimetype);
  }

  const champion = await prisma.champion.update({
    where: { id },
    data: {
      ...data,
      ...(trophyImage && { trophyImage }),
    },
    include: {
      season: true,
      team: true,
    },
  });

  return champion;
};

export const deleteChampion = async (id: string) => {
  const champion = await prisma.champion.findUnique({ where: { id } });
  if (!champion) {
    throw new AppError('Champion not found', 404);
  }

  // Delete from S3
  if (champion.trophyImage) {
    const key = champion.trophyImage.split('/').pop();
    await deleteFromS3(`champions/${key}`);
  }

  await prisma.champion.delete({ where: { id } });
};

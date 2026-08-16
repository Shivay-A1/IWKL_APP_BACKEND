import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { uploadToS3, generateS3Key, deleteFromS3 } from '../utils';
import { getPaginationParams, calculatePagination } from '../utils';

export const createSponsor = async (data: any, file?: Express.Multer.File) => {
  let logo = data.logo;

  if (file) {
    const key = generateS3Key('sponsors/logos', file.originalname);
    logo = await uploadToS3(file.buffer, key, file.mimetype);
  }

  const sponsor = await prisma.sponsor.create({
    data: {
      ...data,
      logo,
    },
  });

  return sponsor;
};

export const getSponsors = async (query: any) => {
  const { page, limit, sortBy, sortOrder } = getPaginationParams(query);
  const { category, isActive } = query;

  const where: any = {};
  if (category) where.category = category;
  if (isActive !== undefined) where.isActive = isActive === 'true';

  const [sponsors, total] = await Promise.all([
    prisma.sponsor.findMany({
      where,
      orderBy: { [sortBy as string]: sortOrder as 'asc' | 'desc' },
      skip: ((page || 1) - 1) * (limit || 10),
      take: limit || 10,
    }),
    prisma.sponsor.count({ where }),
  ]);

  return {
    data: sponsors,
    pagination: calculatePagination(page || 1, limit || 10, total),
  };
};

export const getSponsorById = async (id: string) => {
  const sponsor = await prisma.sponsor.findUnique({
    where: { id },
  });

  if (!sponsor) {
    throw new AppError('Sponsor not found', 404);
  }

  return sponsor;
};

export const updateSponsor = async (id: string, data: any, file?: Express.Multer.File) => {
  let logo = data.logo;

  if (file) {
    const key = generateS3Key('sponsors/logos', file.originalname);
    logo = await uploadToS3(file.buffer, key, file.mimetype);
  }

  const sponsor = await prisma.sponsor.update({
    where: { id },
    data: {
      ...data,
      ...(logo && { logo }),
    },
  });

  return sponsor;
};

export const deleteSponsor = async (id: string) => {
  const sponsor = await prisma.sponsor.findUnique({ where: { id } });
  if (!sponsor) {
    throw new AppError('Sponsor not found', 404);
  }

  // Delete from S3
  if (sponsor.logo) {
    const key = sponsor.logo.split('/').pop();
    await deleteFromS3(`sponsors/logos/${key}`);
  }

  await prisma.sponsor.delete({ where: { id } });
};

export const getSponsorsByCategory = async (category: string) => {
  const sponsors = await prisma.sponsor.findMany({
    where: { category: category as any, isActive: true },
    orderBy: { order: 'asc' },
  });

  return sponsors;
};

export const getActiveSponsors = async () => {
  const sponsors = await prisma.sponsor.findMany({
    where: { isActive: true },
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  });

  return sponsors;
};

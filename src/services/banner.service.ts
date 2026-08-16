import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { uploadToS3, generateS3Key, deleteFromS3 } from '../utils';

export const createBanner = async (data: any, file?: Express.Multer.File) => {
  let image = data.image;

  if (file) {
    const key = generateS3Key('banners', file.originalname);
    image = await uploadToS3(file.buffer, key, file.mimetype);
  }

  const banner = await prisma.banner.create({
    data: {
      ...data,
      image,
    },
  });

  return banner;
};

export const getBanners = async () => {
  const banners = await prisma.banner.findMany({
    orderBy: { order: 'asc' },
  });

  return banners;
};

export const getBannerById = async (id: string) => {
  const banner = await prisma.banner.findUnique({
    where: { id },
  });

  if (!banner) {
    throw new AppError('Banner not found', 404);
  }

  return banner;
};

export const updateBanner = async (id: string, data: any, file?: Express.Multer.File) => {
  let image = data.image;

  if (file) {
    const key = generateS3Key('banners', file.originalname);
    image = await uploadToS3(file.buffer, key, file.mimetype);
  }

  const banner = await prisma.banner.update({
    where: { id },
    data: {
      ...data,
      ...(image && { image }),
    },
  });

  return banner;
};

export const deleteBanner = async (id: string) => {
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) {
    throw new AppError('Banner not found', 404);
  }

  // Delete from S3
  if (banner.image) {
    const key = banner.image.split('/').pop();
    await deleteFromS3(`banners/${key}`);
  }

  await prisma.banner.delete({ where: { id } });
};

export const getActiveBanners = async () => {
  const now = new Date();
  const banners = await prisma.banner.findMany({
    where: {
      isActive: true,
      OR: [
        { startDate: null },
        { startDate: { lte: now } },
      ],
      AND: [
        { endDate: null },
        { endDate: { gte: now } },
      ],
    },
    orderBy: { order: 'asc' },
  });

  return banners;
};

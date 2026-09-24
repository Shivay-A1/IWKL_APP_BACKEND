import { prisma } from '../config';
import { AppError } from '../middleware/error';

export const createBanner = async (data: any, file?: Express.Multer.File) => {
  let imageUrl = data.imageUrl;

  if (file) {
    // Store file locally in uploads/banners directory
    const backendUrl = process.env.RAILWAY_PUBLIC_URL || 'https://iwklappbackend-production.up.railway.app';
    imageUrl = `${backendUrl}/uploads/banners/${file.filename}`;
  }

  const banner = await prisma.homepageBanner.create({
    data: {
      imageUrl,
      title: data.title,
      subtitle: data.subtitle,
      ctaText: data.ctaText,
      ctaLink: data.ctaLink,
      displayOrder: data.displayOrder ? parseInt(data.displayOrder) : 0,
      isActive: data.isActive !== undefined ? data.isActive === 'true' : true,
      filePath: file ? file.path : null,
    },
  });

  return banner;
};

export const getBanners = async () => {
  const banners = await prisma.homepageBanner.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return banners;
};

export const getBannerById = async (id: string) => {
  const banner = await prisma.homepageBanner.findUnique({
    where: { id },
  });

  if (!banner) {
    throw new AppError('Banner not found', 404);
  }

  return banner;
};

export const updateBanner = async (id: string, data: any, file?: Express.Multer.File) => {
  let imageUrl = data.imageUrl;

  if (file) {
    const backendUrl = process.env.RAILWAY_PUBLIC_URL || 'https://iwklappbackend-production.up.railway.app';
    imageUrl = `${backendUrl}/uploads/banners/${file.filename}`;
  }

  const banner = await prisma.homepageBanner.update({
    where: { id },
    data: {
      ...(imageUrl && { imageUrl }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
      ...(data.ctaText !== undefined && { ctaText: data.ctaText }),
      ...(data.ctaLink !== undefined && { ctaLink: data.ctaLink }),
      ...(data.displayOrder !== undefined && { displayOrder: parseInt(data.displayOrder) }),
      ...(data.isActive !== undefined && { isActive: data.isActive === 'true' }),
      ...(file && { filePath: file.path }),
    },
  });

  return banner;
};

export const deleteBanner = async (id: string) => {
  const banner = await prisma.homepageBanner.findUnique({ where: { id } });
  if (!banner) {
    throw new AppError('Banner not found', 404);
  }

  await prisma.homepageBanner.delete({ where: { id } });
};

export const getActiveBanners = async () => {
  const banners = await prisma.homepageBanner.findMany({
    where: {
      isActive: true,
    },
    orderBy: { displayOrder: 'asc' },
  });

  return banners;
};

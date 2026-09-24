import { prisma } from '../config';
import { AppError } from '../middleware/error';

export const createBanner = async (data: any, file?: Express.Multer.File) => {
  let imageUrl = data.imageUrl;
  let imageData = null;

  if (file) {
    // Convert file to base64 and store in database
    const base64Data = file.buffer.toString('base64');
    const mimeType = file.mimetype;
    imageData = `data:${mimeType};base64,${base64Data}`;
  }

  const banner = await prisma.homepageBanner.create({
    data: {
      imageUrl,
      imageData,
      title: data.title,
      subtitle: data.subtitle,
      ctaText: data.ctaText,
      ctaLink: data.ctaLink,
      displayOrder: data.displayOrder ? parseInt(data.displayOrder) : 0,
      isActive: data.isActive !== undefined ? data.isActive === 'true' : true,
      filePath: file ? file.filename : null,
    },
  });

  // Update imageUrl to use backend endpoint if file was uploaded
  if (file) {
    const backendUrl = process.env.RAILWAY_PUBLIC_URL || 'https://iwklappbackend-production.up.railway.app';
    imageUrl = `${backendUrl}/api/homepage-banners/${banner.id}/image`;
    
    await prisma.homepageBanner.update({
      where: { id: banner.id },
      data: { imageUrl },
    });
    
    banner.imageUrl = imageUrl;
  }

  return banner;
};

export const getBanners = async () => {
  const banners = await prisma.homepageBanner.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  const backendUrl = process.env.RAILWAY_PUBLIC_URL || 'https://iwklappbackend-production.up.railway.app';
  
  // Normalize image URLs - use backend endpoint for banners with imageData
  return banners.map(banner => ({
    ...banner,
    imageUrl: banner.imageData 
      ? `${backendUrl}/api/homepage-banners/${banner.id}/image`
      : banner.imageUrl
  }));
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
  let imageData = undefined;

  if (file) {
    const base64Data = file.buffer.toString('base64');
    const mimeType = file.mimetype;
    imageData = `data:${mimeType};base64,${base64Data}`;
    
    const backendUrl = process.env.RAILWAY_PUBLIC_URL || 'https://iwklappbackend-production.up.railway.app';
    imageUrl = `${backendUrl}/api/homepage-banners/${id}/image`;
  }

  const banner = await prisma.homepageBanner.update({
    where: { id },
    data: {
      ...(imageUrl && { imageUrl }),
      ...(imageData !== undefined && { imageData }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
      ...(data.ctaText !== undefined && { ctaText: data.ctaText }),
      ...(data.ctaLink !== undefined && { ctaLink: data.ctaLink }),
      ...(data.displayOrder !== undefined && { displayOrder: parseInt(data.displayOrder) }),
      ...(data.isActive !== undefined && { isActive: data.isActive === 'true' }),
      ...(file && { filePath: file.filename }),
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

  const backendUrl = process.env.RAILWAY_PUBLIC_URL || 'https://iwklappbackend-production.up.railway.app';
  
  // Normalize image URLs - use backend endpoint for banners with imageData
  return banners.map(banner => ({
    ...banner,
    imageUrl: banner.imageData 
      ? `${backendUrl}/api/homepage-banners/${banner.id}/image`
      : banner.imageUrl
  }));
};

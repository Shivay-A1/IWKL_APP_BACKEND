import getPrisma from '../config/database';
import slugify from 'slugify';

// Helper function to check if prisma is available
const isPrismaAvailable = () => getPrisma() !== null;

// Category Services
export const createCategory = async (data: any) => {
  const prisma = getPrisma();
  if (!prisma) {
    throw new Error('Database not available');
  }
  
  const { name, description, displayOrder } = data;
  const slug = data.slug || slugify(name, { lower: true });
  
  return await prisma.videoCategory.create({
    data: {
      name,
      slug,
      description,
      displayOrder: displayOrder || 0,
    },
    include: {
      videos: true,
    },
  });
};

export const getCategories = async (params: any = {}) => {
  const { isActive } = params;
  
  return await prisma.videoCategory.findMany({
    where: isActive !== undefined ? { isActive: isActive === 'true' } : undefined,
    orderBy: { displayOrder: 'asc' },
    include: {
      videos: {
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      },
    },
  });
};

export const getCategoryById = async (id: string) => {
  return await prisma.videoCategory.findUnique({
    where: { id },
    include: {
      videos: {
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      },
    },
  });
};

export const updateCategory = async (id: string, data: any) => {
  const { name, description, displayOrder, isActive } = data;
  const slug = data.slug || (name ? slugify(name, { lower: true }) : undefined);
  
  return await prisma.videoCategory.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(description !== undefined && { description }),
      ...(displayOrder !== undefined && { displayOrder }),
      ...(isActive !== undefined && { isActive }),
    },
    include: {
      videos: true,
    },
  });
};

export const deleteCategory = async (id: string) => {
  return await prisma.videoCategory.delete({
    where: { id },
  });
};

// Video Services
export const createVideo = async (data: any) => {
  const { categoryId, title, description, thumbnailUrl, youtubeUrl, duration, displayOrder } = data;
  
  // Extract YouTube video ID from URL
  let youtubeVideoId = data.youtubeVideoId;
  if (youtubeUrl && !youtubeVideoId) {
    const match = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (match) {
      youtubeVideoId = match[1];
    }
  }
  
  return await prisma.video.create({
    data: {
      categoryId,
      title,
      description,
      thumbnailUrl,
      youtubeUrl,
      youtubeVideoId,
      duration,
      displayOrder: displayOrder || 0,
      publishedAt: new Date(),
    },
    include: {
      category: true,
    },
  });
};

export const getVideos = async (params: any = {}) => {
  const { categoryId, isActive, isFeatured } = params;
  
  return await prisma.video.findMany({
    where: {
      ...(categoryId && { categoryId }),
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
      ...(isFeatured !== undefined && { isFeatured: isFeatured === 'true' }),
    },
    orderBy: { displayOrder: 'asc' },
    include: {
      category: true,
    },
  });
};

export const getVideoById = async (id: string) => {
  return await prisma.video.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
};

export const getVideosByCategory = async (categoryId: string) => {
  return await prisma.video.findMany({
    where: {
      categoryId,
      isActive: true,
    },
    orderBy: { displayOrder: 'asc' },
    include: {
      category: true,
    },
  });
};

export const updateVideo = async (id: string, data: any) => {
  const { categoryId, title, description, thumbnailUrl, youtubeUrl, duration, displayOrder, isActive, isFeatured } = data;
  
  // Extract YouTube video ID from URL if provided
  let youtubeVideoId = data.youtubeVideoId;
  if (youtubeUrl && !youtubeVideoId) {
    const match = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (match) {
      youtubeVideoId = match[1];
    }
  }
  
  return await prisma.video.update({
    where: { id },
    data: {
      ...(categoryId && { categoryId }),
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(thumbnailUrl && { thumbnailUrl }),
      ...(youtubeUrl && { youtubeUrl }),
      ...(youtubeVideoId && { youtubeVideoId }),
      ...(duration !== undefined && { duration }),
      ...(displayOrder !== undefined && { displayOrder }),
      ...(isActive !== undefined && { isActive }),
      ...(isFeatured !== undefined && { isFeatured }),
    },
    include: {
      category: true,
    },
  });
};

export const deleteVideo = async (id: string) => {
  return await prisma.video.delete({
    where: { id },
  });
};

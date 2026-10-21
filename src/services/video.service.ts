import prisma from '../config/database';
import { AppError } from '../middleware/error';
import { uploadToS3, generateS3Key, deleteFromS3 } from '../utils';
import { getPaginationParams, calculatePagination } from '../utils';

export const createVideo = async (data: any, files?: Express.Multer.File[]) => {
  let videoUrl = data.videoUrl;
  let thumbnailUrl = data.thumbnail;

  // For file uploads, store in database as base64 (Railway database storage)
  // Handle files even when videoUrl is provided (for YouTube thumbnail uploads)
  if (files && files.length > 0) {
    try {
      const { prisma: prismaDB } = await import('../config');
      const backendUrl = process.env.BACKEND_URL || 'https://iwklappbackend-production.up.railway.app';

      // If uploading video file (first file is video when no videoUrl)
      if (files.length > 0 && !data.videoUrl) {
        const videoFile = files[0];
        if (!videoFile.buffer) {
          throw new Error('Video file buffer is missing. File might have been saved to disk instead of memory.');
        }
        const videoBase64 = videoFile.buffer.toString('base64');
        const uploadedVideo = await prismaDB.uploadedFile.create({
          data: {
            fileName: videoFile.originalname,
            fileType: 'video',
            mimeType: videoFile.mimetype,
            fileData: videoBase64,
            fileSize: videoFile.size
          }
        });
        videoUrl = `${backendUrl}/api/files/${uploadedVideo.id}`;
      }

      // Handle thumbnail (second file or first file if only thumbnail for YouTube)
      if (files.length > 1) {
        const thumbnailFile = files[1];
        if (!thumbnailFile.buffer) {
          throw new Error('Thumbnail file buffer is missing. File might have been saved to disk instead of memory.');
        }
        const thumbnailBase64 = thumbnailFile.buffer.toString('base64');
        const uploadedThumbnail = await prismaDB.uploadedFile.create({
          data: {
            fileName: thumbnailFile.originalname,
            fileType: 'image',
            mimeType: thumbnailFile.mimetype,
            fileData: thumbnailBase64,
            fileSize: thumbnailFile.size
          }
        });
        thumbnailUrl = `${backendUrl}/api/files/${uploadedThumbnail.id}`;
      } else if (files.length === 1 && data.videoUrl) {
        // Single file upload with YouTube URL - treat as thumbnail
        const thumbnailFile = files[0];
        if (!thumbnailFile.buffer) {
          throw new Error('Thumbnail file buffer is missing. File might have been saved to disk instead of memory.');
        }
        const thumbnailBase64 = thumbnailFile.buffer.toString('base64');
        const uploadedThumbnail = await prismaDB.uploadedFile.create({
          data: {
            fileName: thumbnailFile.originalname,
            fileType: 'image',
            mimeType: thumbnailFile.mimetype,
            fileData: thumbnailBase64,
            fileSize: thumbnailFile.size
          }
        });
        thumbnailUrl = `${backendUrl}/api/files/${uploadedThumbnail.id}`;
      }
    } catch (dbError) {
      console.error('Database upload error:', dbError);
      throw new Error('Failed to upload video file to database.');
    }
  }

  // Parse tags if provided as JSON string
  let tags = data.tags;
  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch (e) {
      // If parsing fails, split by comma
      tags = tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
    }
  }

  // Parse duration if provided as string
  let duration = data.duration;
  if (typeof duration === 'string') {
    duration = parseInt(duration) || null;
  }

  // Parse publishedAt if provided as string
  let publishedAt = data.publishedAt;
  if (publishedAt && typeof publishedAt === 'string') {
    publishedAt = new Date(publishedAt);
  }

  // Parse displayOrder - ensure it's an integer
  let displayOrder = data.displayOrder;
  if (typeof displayOrder === 'string') {
    displayOrder = parseInt(displayOrder) || 0;
  } else if (displayOrder === undefined || displayOrder === null) {
    displayOrder = 0;
  }

  // Handle category - if it's a string like 'featured' or 'videos', find or create the category
  let categoryId = data.categoryId || data.category;
  if (categoryId && typeof categoryId === 'string' && !categoryId.startsWith('cuid')) {
    // Find category by name
    const category = await prisma.videoCategory.findFirst({
      where: { name: categoryId },
    });
    if (category) {
      categoryId = category.id;
    } else {
      // Create category if it doesn't exist
      const newCategory = await prisma.videoCategory.create({
        data: {
          name: categoryId,
          slug: categoryId.toLowerCase().replace(/\s+/g, '-'),
        },
      });
      categoryId = newCategory.id;
    }
  }

  // Detect if videoUrl is a YouTube URL
  const isYouTube = videoUrl && (
    videoUrl.includes('youtube.com') ||
    videoUrl.includes('youtu.be') ||
    videoUrl.includes('youtube-nocookie.com')
  );

  const video = await prisma.video.create({
    data: {
      title: data.title,
      description: data.description || null,
      categoryId: categoryId || null,
      youtubeUrl: isYouTube ? videoUrl : (videoUrl || null),
      thumbnailUrl: thumbnailUrl || data.thumbnailUrl || null,
      isFeatured: data.isFeatured === 'true' || data.isFeatured === true,
      isActive: data.isActive !== 'false' && data.isActive !== false,
      duration: duration || null,
      publishedAt: publishedAt || null,
      tags: tags || [],
      displayOrder: displayOrder,
    },
  });

  return video;
};

export const getVideos = async (query: any) => {
  const { page, limit, sortBy, sortOrder } = getPaginationParams(query);
  const { category, isFeatured, isActive } = query;

  const where: any = {};
  if (category) where.categoryId = category;
  if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';
  if (isActive !== undefined) where.isActive = isActive === 'true';

  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        youtubeUrl: true,
        thumbnailUrl: true,
        isFeatured: true,
        isActive: true,
        duration: true,
        publishedAt: true,
        tags: true,
        displayOrder: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { [sortBy || 'displayOrder']: sortOrder || 'asc' },
      skip: ((page || 1) - 1) * (limit || 1000),
      take: limit || 1000,
    }),
    prisma.video.count({ where }),
  ]);

  return {
    data: videos,
    pagination: calculatePagination(page || 1, limit || 1000, total),
  };
};

export const getVideoById = async (id: string) => {
  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!video) {
    throw new AppError('Video not found', 404);
  }

  return video;
};

export const updateVideo = async (id: string, data: any, files?: Express.Multer.File[]) => {
  let videoUrl = data.videoUrl;
  let thumbnailUrl = data.thumbnail;

  // For file uploads, store in database as base64 (Railway database storage)
  if (files && files.length > 0) {
    try {
      const { prisma: prismaDB } = await import('../config');
      const backendUrl = process.env.BACKEND_URL || 'https://iwklappbackend-production.up.railway.app';

      // First file is video
      if (files.length > 0) {
        const videoFile = files[0];
        const videoBase64 = videoFile.buffer.toString('base64');
        const uploadedVideo = await prismaDB.uploadedFile.create({
          data: {
            fileName: videoFile.originalname,
            fileType: 'video',
            mimeType: videoFile.mimetype,
            fileData: videoBase64,
            fileSize: videoFile.size
          }
        });
        videoUrl = `${backendUrl}/api/files/${uploadedVideo.id}`;
      }

      // Second file is thumbnail
      if (files.length > 1) {
        const thumbnailFile = files[1];
        const thumbnailBase64 = thumbnailFile.buffer.toString('base64');
        const uploadedThumbnail = await prismaDB.uploadedFile.create({
          data: {
            fileName: thumbnailFile.originalname,
            fileType: 'image',
            mimeType: thumbnailFile.mimetype,
            fileData: thumbnailBase64,
            fileSize: thumbnailFile.size
          }
        });
        thumbnailUrl = `${backendUrl}/api/files/${uploadedThumbnail.id}`;
      }
    } catch (dbError) {
      console.error('Database upload error:', dbError);
      throw new Error('Failed to upload video file to database.');
    }
  }

  // Parse tags if provided as JSON string
  let tags = data.tags;
  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch (e) {
      // If parsing fails, split by comma
      tags = tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
    }
  }

  // Parse duration if provided as string
  let duration = data.duration;
  if (typeof duration === 'string') {
    duration = parseInt(duration) || null;
  }

  // Parse publishedAt if provided as string
  let publishedAt = data.publishedAt;
  if (publishedAt && typeof publishedAt === 'string') {
    publishedAt = new Date(publishedAt);
  }

  const updateData: any = {
    title: data.title,
    description: data.description,
    ...(data.categoryId && { categoryId: data.categoryId }),
    ...(data.category && !data.categoryId && { categoryId: data.category }),
    ...(videoUrl && { youtubeUrl: videoUrl }),
    ...(thumbnailUrl && { thumbnailUrl }),
    ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured === 'true' || data.isFeatured === true }),
    ...(data.isActive !== undefined && { isActive: data.isActive !== 'false' && data.isActive !== false }),
    ...(duration !== undefined && { duration }),
    ...(publishedAt !== undefined && { publishedAt }),
    ...(tags !== undefined && { tags }),
    ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
    ...(data.order !== undefined && { displayOrder: data.order }),
  };

  const video = await prisma.video.update({
    where: { id },
    data: updateData,
  });

  return video;
};

export const deleteVideo = async (id: string) => {
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) {
    throw new AppError('Video not found', 404);
  }

  // Delete from database (uploaded files)
  // Note: We're not deleting the actual files from UploadedFile table to keep it simple
  // In production, you might want to clean up orphaned files

  await prisma.video.delete({ where: { id } });
};

export const getFeaturedVideos = async () => {
  const videos = await prisma.video.findMany({
    where: { isFeatured: true },
    orderBy: { publishedAt: 'desc' },
    take: 10,
    select: {
      id: true,
      title: true,
      description: true,
      youtubeUrl: true,
      thumbnailUrl: true,
      isFeatured: true,
      isActive: true,
      duration: true,
      publishedAt: true,
      tags: true,
      displayOrder: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  return videos;
};

export const getHomepageVideos = async () => {
  // Get featured video (first one by displayOrder)
  const featuredVideo = await prisma.video.findFirst({
    where: {
      isActive: true,
      isFeatured: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      youtubeUrl: true,
      thumbnailUrl: true,
      isFeatured: true,
      isActive: true,
      duration: true,
      publishedAt: true,
      tags: true,
      displayOrder: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { displayOrder: 'asc' },
  });

  // Get top 4 videos (active, by displayOrder)
  const topVideos = await prisma.video.findMany({
    where: {
      isActive: true,
      ...(featuredVideo && { id: { not: featuredVideo.id } }),
    },
    select: {
      id: true,
      title: true,
      description: true,
      youtubeUrl: true,
      thumbnailUrl: true,
      isFeatured: true,
      isActive: true,
      duration: true,
      publishedAt: true,
      tags: true,
      displayOrder: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { displayOrder: 'asc' },
    take: 4,
  });

  return {
    featuredVideo: featuredVideo || null,
    topVideos,
  };
};

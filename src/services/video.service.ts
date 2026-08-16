import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { uploadToS3, generateS3Key, deleteFromS3 } from '../utils';
import { getPaginationParams, calculatePagination } from '../utils';

export const createVideo = async (data: any, files?: Express.Multer.File[]) => {
  let videoUrl = data.videoUrl;
  let thumbnailUrl = data.thumbnail;

  // Only upload to S3 if files are provided AND uploadType is 'upload'
  // If videoUrl is provided (YouTube URL), skip S3 upload
  if (files && files.length > 0 && !data.videoUrl) {
    // Files are uploaded with field name 'files' from frontend
    // First file is video, second file is thumbnail (if provided)
    if (files.length > 0) {
      const videoFile = files[0];
      const key = generateS3Key('videos', videoFile.originalname);
      videoUrl = await uploadToS3(videoFile.buffer, key, videoFile.mimetype);
    }

    if (files.length > 1) {
      const thumbnailFile = files[1];
      const key = generateS3Key('videos/thumbnails', thumbnailFile.originalname);
      thumbnailUrl = await uploadToS3(thumbnailFile.buffer, key, thumbnailFile.mimetype);
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

  const video = await prisma.video.create({
    data: {
      title: data.title,
      description: data.description,
      categoryId: data.categoryId || data.category,
      youtubeUrl: videoUrl || '',
      thumbnailUrl: thumbnailUrl || '',
      isFeatured: data.isFeatured === 'true' || data.isFeatured === true,
      isActive: data.isActive !== 'false' && data.isActive !== false,
      duration: duration || null,
      publishedAt: publishedAt || null,
      tags: tags || [],
      displayOrder: data.displayOrder || 0,
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
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { [sortBy || 'displayOrder']: sortOrder || 'asc' },
      skip: ((page || 1) - 1) * (limit || 10),
      take: limit || 10,
    }),
    prisma.video.count({ where }),
  ]);

  return {
    data: videos,
    pagination: calculatePagination(page || 1, limit || 10, total),
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

  if (files) {
    // Files are uploaded with field name 'files' from frontend
    // First file is video, second file is thumbnail (if provided)
    if (files.length > 0) {
      const videoFile = files[0];
      const key = generateS3Key('videos', videoFile.originalname);
      videoUrl = await uploadToS3(videoFile.buffer, key, videoFile.mimetype);
    }

    if (files.length > 1) {
      const thumbnailFile = files[1];
      const key = generateS3Key('videos/thumbnails', thumbnailFile.originalname);
      thumbnailUrl = await uploadToS3(thumbnailFile.buffer, key, thumbnailFile.mimetype);
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

  // Delete from S3
  if (video.youtubeUrl) {
    const key = video.youtubeUrl.split('/').pop();
    await deleteFromS3(`videos/${key}`);
  }

  await prisma.video.delete({ where: { id } });
};

export const getFeaturedVideos = async () => {
  const videos = await prisma.video.findMany({
    where: { isFeatured: true },
    orderBy: { publishedAt: 'desc' },
    take: 10,
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
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { displayOrder: 'asc' },
  });

  // Get top 4 videos (active, by displayOrder)
  const topVideos = await prisma.video.findMany({
    where: {
      isActive: true,
      ...(featuredVideo && { id: { not: featuredVideo.id } }),
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { displayOrder: 'asc' },
    take: 4,
  });

  return {
    featuredVideo: featuredVideo || null,
    topVideos,
  };
};

import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { uploadToS3, generateS3Key, deleteFromS3 } from '../utils';
import { getPaginationParams, calculatePagination } from '../utils';

export const createGalleryItem = async (data: any, files?: Express.Multer.File[]) => {
  let mediaUrl = data.mediaUrl;
  let thumbnailUrl = data.thumbnailUrl;

  if (files && files.length > 0) {
    const mediaFile = files[0];
    const key = generateS3Key('gallery', mediaFile.originalname);
    mediaUrl = await uploadToS3(mediaFile.buffer, key, mediaFile.mimetype);

    // Generate thumbnail for videos
    if (mediaFile.mimetype.startsWith('video/')) {
      const thumbnailFile = files[1];
      if (thumbnailFile) {
        const thumbKey = generateS3Key('gallery/thumbnails', thumbnailFile.originalname);
        thumbnailUrl = await uploadToS3(thumbnailFile.buffer, thumbKey, thumbnailFile.mimetype);
      }
    }
  }

  const item = await prisma.galleryItem.create({
    data: {
      ...data,
      mediaUrl,
      thumbnailUrl,
    },
  });

  return item;
};

export const getGalleryItems = async (query: any) => {
  const { page, limit, sortBy, sortOrder } = getPaginationParams(query);
  const { mediaType, category, album, isFeatured } = query;

  const where: any = {};
  if (mediaType) where.mediaType = mediaType;
  if (category) where.category = category;
  if (album) where.album = album;
  if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

  const [items, total] = await Promise.all([
    prisma.galleryItem.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.galleryItem.count({ where }),
  ]);

  return {
    data: items,
    pagination: calculatePagination(page, limit, total),
  };
};

export const getGalleryItemById = async (id: string) => {
  const item = await prisma.galleryItem.findUnique({
    where: { id },
  });

  if (!item) {
    throw new AppError('Gallery item not found', 404);
  }

  return item;
};

export const updateGalleryItem = async (id: string, data: any, files?: Express.Multer.File[]) => {
  let mediaUrl = data.mediaUrl;
  let thumbnailUrl = data.thumbnailUrl;

  if (files && files.length > 0) {
    const mediaFile = files[0];
    const key = generateS3Key('gallery', mediaFile.originalname);
    mediaUrl = await uploadToS3(mediaFile.buffer, key, mediaFile.mimetype);

    if (files.length > 1) {
      const thumbnailFile = files[1];
      const thumbKey = generateS3Key('gallery/thumbnails', thumbnailFile.originalname);
      thumbnailUrl = await uploadToS3(thumbnailFile.buffer, thumbKey, thumbnailFile.mimetype);
    }
  }

  const item = await prisma.galleryItem.update({
    where: { id },
    data: {
      ...data,
      ...(mediaUrl && { mediaUrl }),
      ...(thumbnailUrl && { thumbnailUrl }),
    },
  });

  return item;
};

export const deleteGalleryItem = async (id: string) => {
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) {
    throw new AppError('Gallery item not found', 404);
  }

  // Delete from S3
  if (item.mediaUrl) {
    const key = item.mediaUrl.split('/').pop();
    await deleteFromS3(`gallery/${key}`);
  }

  await prisma.galleryItem.delete({ where: { id } });
};

export const getGalleryByCategory = async (category: string) => {
  const items = await prisma.galleryItem.findMany({
    where: { category },
    orderBy: { order: 'asc' },
  });

  return items;
};

export const getGalleryByAlbum = async (album: string) => {
  const items = await prisma.galleryItem.findMany({
    where: { album },
    orderBy: { order: 'asc' },
  });

  return items;
};

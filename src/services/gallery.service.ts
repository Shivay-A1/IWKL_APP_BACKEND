import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { getPaginationParams, calculatePagination } from '../utils';
import path from 'path';

export const createGalleryItem = async (data: any, files?: Express.Multer.File[]) => {
  console.log('Creating gallery item:', { data, hasFiles: !!files, fileCount: files?.length });
  
  let mediaUrl = data.mediaUrl;
  let thumbnailUrl = data.thumbnailUrl;

  // Handle file upload if provided
  if (files && files.length > 0) {
    const mediaFile = files[0];
    // Use local file path instead of S3
    mediaUrl = `/uploads/gallery/${mediaFile.filename}`;
    console.log('File saved locally:', mediaUrl);

    // Handle thumbnail for videos
    if (files.length > 1) {
      const thumbnailFile = files[1];
      thumbnailUrl = `/uploads/gallery/${thumbnailFile.filename}`;
    }
  } else if (!mediaUrl) {
    // If no file and no mediaUrl, use a placeholder
    mediaUrl = '/uploads/gallery/placeholder.png';
    console.log('No file provided, using placeholder');
  }

  const item = await prisma.galleryItem.create({
    data: {
      title: data.title || 'Untitled Gallery Item',
      description: data.description,
      mediaUrl,
      thumbnailUrl,
      mediaType: data.mediaType || 'IMAGE',
      category: data.category,
      album: data.album,
      isFeatured: data.isFeatured === 'true' || data.isFeatured === true,
      order: data.order || 0,
    },
  });

  console.log('Gallery item created:', item.id);
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
      select: {
        id: true,
        title: true,
        description: true,
        mediaUrl: true,
        thumbnailUrl: true,
        mediaType: true,
        category: true,
        album: true,
        isFeatured: true,
        order: true,
        createdAt: true,
      },
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
    // Use local file path instead of S3
    mediaUrl = `/uploads/gallery/${mediaFile.filename}`;

    if (files.length > 1) {
      const thumbnailFile = files[1];
      thumbnailUrl = `/uploads/gallery/${thumbnailFile.filename}`;
    }
  }

  const item = await prisma.galleryItem.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      ...(mediaUrl && { mediaUrl }),
      ...(thumbnailUrl && { thumbnailUrl }),
      mediaType: data.mediaType,
      category: data.category,
      album: data.album,
      isFeatured: data.isFeatured === 'true' || data.isFeatured === true,
      order: data.order,
    },
  });

  return item;
};

export const deleteGalleryItem = async (id: string) => {
  console.log('Deleting gallery item:', id);
  
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) {
    console.error('Gallery item not found:', id);
    throw new AppError('Gallery item not found', 404);
  }

  console.log('Gallery item found:', { id, mediaUrl: item.mediaUrl, thumbnailUrl: item.thumbnailUrl });

  // Delete local files if they exist
  if (item.mediaUrl && item.mediaUrl.startsWith('/uploads/')) {
    try {
      const filePath = path.join(process.cwd(), item.mediaUrl);
      console.log('Attempting to delete file:', filePath);
      if (require('fs').existsSync(filePath)) {
        require('fs').unlinkSync(filePath);
        console.log('Deleted local file:', filePath);
      } else {
        console.log('File does not exist:', filePath);
      }
    } catch (error) {
      console.error('Error deleting local file:', error);
      // Continue with database deletion even if file deletion fails
    }
  }

  // Delete thumbnail if exists
  if (item.thumbnailUrl && item.thumbnailUrl.startsWith('/uploads/')) {
    try {
      const filePath = path.join(process.cwd(), item.thumbnailUrl);
      console.log('Attempting to delete thumbnail:', filePath);
      if (require('fs').existsSync(filePath)) {
        require('fs').unlinkSync(filePath);
        console.log('Deleted local thumbnail:', filePath);
      } else {
        console.log('Thumbnail does not exist:', filePath);
      }
    } catch (error) {
      console.error('Error deleting local thumbnail:', error);
    }
  }

  const deletedItem = await prisma.galleryItem.delete({ where: { id } });
  console.log('Gallery item deleted from database:', deletedItem.id);
  
  return deletedItem;
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

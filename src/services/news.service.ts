import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { generateUniqueSlug } from '../utils';
import { getPaginationParams, calculatePagination } from '../utils';
import * as fs from 'fs';
import * as path from 'path';

const getAbsoluteImageUrl = (relativePath: string) => {
  if (!relativePath || relativePath === '') return '';
  // If already an absolute URL (starts with http), return as-is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  // Use hardcoded backend URL without /api for static files
  const baseUrl = 'https://iwkl-backend-lg6t-production.up.railway.app';
  return `${baseUrl}${relativePath}`;
};

const saveBase64Image = (base64Data: string): string => {
  if (!base64Data || !base64Data.startsWith('data:image/')) {
    return '';
  }

  try {
    // Extract the base64 string (remove data:image/xxx;base64, prefix)
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches || matches.length < 3) {
      return '';
    }

    const extension = matches[1];
    const base64String = matches[2];
    const buffer = Buffer.from(base64String, 'base64');

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', 'news', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
    const filepath = path.join(uploadDir, filename);

    // Save the file
    fs.writeFileSync(filepath, buffer);

    return `/uploads/news/images/${filename}`;
  } catch (error) {
    console.error('Error saving base64 image:', error);
    return '';
  }
};

export const createNews = async (data: any, file?: Express.Multer.File, files?: Express.Multer.File[]) => {
  let featuredImage = data.featuredImage;

  // Handle single file upload (image field)
  if (file) {
    featuredImage = `/uploads/news/images/${file.filename}`;
  }
  // Handle base64 image data (from frontend)
  else if (data.featuredImage && data.featuredImage.startsWith('data:image/')) {
    featuredImage = saveBase64Image(data.featuredImage);
  }
  // Handle URL mode - if it's already an absolute URL, keep it as-is
  else if (data.featuredImage && (data.featuredImage.startsWith('http://') || data.featuredImage.startsWith('https://'))) {
    featuredImage = data.featuredImage;
  }

  // Set default value for featuredImage if not provided
  if (!featuredImage) {
    featuredImage = '';
  }

  // Set default value for excerpt if not provided
  if (!data.excerpt) {
    data.excerpt = '';
  }

  // Auto-mark as featured if image is uploaded and not explicitly set
  if ((file || (data.featuredImage && data.featuredImage.startsWith('data:image/'))) && data.isFeatured === undefined) {
    data.isFeatured = true;
  }

  // Auto-publish if not explicitly set
  if (data.isPublished === undefined) {
    data.isPublished = true;
  }

  const slug = await generateUniqueSlug(data.title, async (slug) => {
    const existing = await prisma.news.findUnique({ where: { slug } });
    return !!existing;
  });

  const news = await prisma.news.create({
    data: {
      ...data,
      slug,
      featuredImage,
    },
  });

  // Handle multiple image uploads (images field) - using local storage
  if (files && files.length > 0) {
    const imageUploads = files.map(async (file, index) => {
      try {
        const imageUrl = `/uploads/news/images/${file.filename}`;
        return prisma.newsImage.create({
          data: {
            newsId: news.id,
            imageUrl,
            order: index,
          },
        });
      } catch (error) {
        console.error('Error saving image:', error);
        // Skip failed uploads
        return null;
      }
    });

    await Promise.all(imageUploads.filter(Boolean));
  }

  // Return news with absolute image URL
  return {
    ...news,
    featuredImage: getAbsoluteImageUrl(news.featuredImage),
  };
};

export const getNews = async (query: any) => {
  const paginationParams = getPaginationParams(query);
  const page = paginationParams.page || 1;
  const limit = paginationParams.limit || 10;
  const sortBy = paginationParams.sortBy;
  const sortOrder = paginationParams.sortOrder;
  
  const { category, isFeatured, isPublished, search } = query;

  const where: any = {};
  if (category) where.category = category;
  if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';
  if (isPublished !== undefined) where.isPublished = isPublished === 'true';
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy: any = {};
  if (sortBy && sortOrder) {
    orderBy[sortBy] = sortOrder;
  }

  const [news, total] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: Object.keys(orderBy).length > 0 ? orderBy : { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        featuredImage: true,
        category: true,
        isFeatured: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.news.count({ where }),
  ]);

  // Convert relative image paths to absolute URLs
  const newsWithAbsoluteUrls = news.map((item: any) => ({
    ...item,
    featuredImage: getAbsoluteImageUrl(item.featuredImage),
  }));

  return {
    data: newsWithAbsoluteUrls,
    pagination: calculatePagination(page, limit, total),
  };
};

export const getNewsBySlug = async (slug: string) => {
  const news = await prisma.news.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!news) {
    throw new AppError('News not found', 404);
  }

  console.log('🔵 getNewsBySlug Debug:', {
    slug,
    featuredImage: news.featuredImage,
    featuredImageType: typeof news.featuredImage,
    absoluteUrl: getAbsoluteImageUrl(news.featuredImage)
  });

  // Return news with absolute image URL
  return {
    ...news,
    featuredImage: getAbsoluteImageUrl(news.featuredImage),
    images: news.images.map((img: any) => ({
      ...img,
      imageUrl: getAbsoluteImageUrl(img.imageUrl),
    })),
  };
};

export const updateNews = async (id: string, data: any, file?: Express.Multer.File, files?: Express.Multer.File[]) => {
  let featuredImage = data.featuredImage;

  if (file) {
    featuredImage = `/uploads/news/images/${file.filename}`;
  }
  // Handle base64 image data (from frontend)
  else if (data.featuredImage && data.featuredImage.startsWith('data:image/')) {
    featuredImage = saveBase64Image(data.featuredImage);
  }
  // Handle URL mode - if it's already an absolute URL, keep it as-is
  else if (data.featuredImage && (data.featuredImage.startsWith('http://') || data.featuredImage.startsWith('https://'))) {
    featuredImage = data.featuredImage;
  }
  // If no new image provided, keep existing one (handled by Prisma)
  else if (!data.featuredImage) {
    featuredImage = undefined; // Don't update featuredImage if not provided
  }

  // Set default value for featuredImage if not provided
  if (featuredImage === '') {
    featuredImage = ''
  }

  // Set default value for excerpt if not provided
  if (!data.excerpt) {
    data.excerpt = '';
  }

  if (data.title && !data.slug) {
    data.slug = await generateUniqueSlug(data.title, async (slug) => {
      const existing = await prisma.news.findFirst({
        where: { slug, id: { not: id } },
      });
      return !!existing;
    });
  }

  const news = await prisma.news.update({
    where: { id },
    data: {
      ...data,
      ...(featuredImage !== undefined && { featuredImage }),
    },
  });

  // Handle multiple image uploads
  if (files && files.length > 0) {
    // Delete existing images
    await prisma.newsImage.deleteMany({
      where: { newsId: id },
    });

    // Upload new images using local storage
    const imageUploads = files.map(async (file, index) => {
      const imageUrl = `/uploads/news/images/${file.filename}`;
      return prisma.newsImage.create({
        data: {
          newsId: news.id,
          imageUrl,
          order: index,
        },
      });
    });

    await Promise.all(imageUploads);
  }

  // Return news with absolute image URL
  return {
    ...news,
    featuredImage: getAbsoluteImageUrl(news.featuredImage),
  };
};

export const deleteNews = async (id: string) => {
  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) {
    throw new AppError('News not found', 404);
  }

  await prisma.news.delete({ where: { id } });
};

export const getFeaturedNews = async () => {
  const news = await prisma.news.findMany({
    where: { isFeatured: true, isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: 5,
  });

  // Convert relative image paths to absolute URLs
  return news.map((item: any) => ({
    ...item,
    featuredImage: getAbsoluteImageUrl(item.featuredImage),
  }));
};

export const deleteAllNews = async () => {
  // Delete all news images first
  await prisma.newsImage.deleteMany({});
  
  // Delete all news
  await prisma.news.deleteMany({});
  
  return { message: 'All news deleted successfully' };
};

export const incrementViewCount = async (id: string) => {
  await prisma.news.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
};

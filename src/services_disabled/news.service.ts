import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { uploadToS3, generateS3Key } from '../utils';
import { generateUniqueSlug } from '../utils';
import { getPaginationParams, calculatePagination } from '../utils';

export const createNews = async (data: any, file?: Express.Multer.File, files?: Express.Multer.File[]) => {
  let featuredImage = data.featuredImage;

  if (file) {
    const key = generateS3Key('news/images', file.originalname);
    featuredImage = await uploadToS3(file.buffer, key, file.mimetype);
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

  // Handle multiple image uploads
  if (files && files.length > 0) {
    const imageUploads = files.map(async (file, index) => {
      const key = generateS3Key('news/images', file.originalname);
      const imageUrl = await uploadToS3(file.buffer, key, file.mimetype);
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

  return news;
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
    }),
    prisma.news.count({ where }),
  ]);

  return {
    data: news,
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

  return news;
};

export const updateNews = async (id: string, data: any, file?: Express.Multer.File, files?: Express.Multer.File[]) => {
  let featuredImage = data.featuredImage;

  if (file) {
    const key = generateS3Key('news/images', file.originalname);
    featuredImage = await uploadToS3(file.buffer, key, file.mimetype);
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
      ...(featuredImage && { featuredImage }),
    },
  });

  // Handle multiple image uploads
  if (files && files.length > 0) {
    // Delete existing images
    await prisma.newsImage.deleteMany({
      where: { newsId: id },
    });

    // Upload new images
    const imageUploads = files.map(async (file, index) => {
      const key = generateS3Key('news/images', file.originalname);
      const imageUrl = await uploadToS3(file.buffer, key, file.mimetype);
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

  return news;
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

  return news;
};

export const incrementViewCount = async (id: string) => {
  await prisma.news.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
};

import { Router } from 'express';
import { body } from 'express-validator';
import * as bannerController from '../controllers/banner.controller';
import { authenticate, authorize, validate, uploadSingle, apiLimiter, upload } from '../middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Auto-migrate filePath column if it doesn't exist
const ensureFilePathColumn = async () => {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "HomepageBanner" ADD COLUMN "filePath" TEXT`);
  } catch (error) {
    // Column might already exist, ignore error
    console.log('filePath column already exists or migration not needed');
  }
};

ensureFilePathColumn();

const router = Router();

// Configure upload directory for banners
const uploadDir = path.join(process.cwd(), 'uploads', 'banners');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create separate multer instance for banner uploads
const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const bannerUpload = multer({
  storage: bannerStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Public GET endpoints - no authentication required
router.get('/', bannerController.getBanners);
router.get('/active', bannerController.getActiveBanners);
router.get('/:id', bannerController.getBannerById);
router.get('/:id/image', async (req, res) => {
  try {
    const banner = await prisma.homepageBanner.findUnique({
      where: { id: req.params.id }
    });

    if (!banner || !banner.imageData) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Extract base64 data and send as image
    const base64Data = banner.imageData.split(',')[1];
    const mimeType = banner.imageData.split(';')[0].split(':')[1];
    
    const buffer = Buffer.from(base64Data, 'base64');
    res.set('Content-Type', mimeType);
    res.send(buffer);
  } catch (error) {
    console.error('Error serving banner image:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

// Protected routes - require authentication and authorization
router.post('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, uploadSingle('image'), [
  body('title').trim().notEmpty().withMessage('Banner title is required'),
], validate, bannerController.createBanner);

// POST /homepage-banners/upload - Upload banner with file (no auth for admin panel)
router.post('/upload', bannerUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const {
      title,
      subtitle,
      buttonText,
      buttonUrl,
      order,
      isActive,
    } = req.body;

    // Convert file to base64
    const base64Data = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const imageData = `data:${mimeType};base64,${base64Data}`;
    
    // Use backend URL for imageUrl
    const backendUrl = process.env.RAILWAY_PUBLIC_URL || 'https://iwklappbackend-production.up.railway.app';
    const bannerId = `banner_${Date.now()}`;
    const imageUrl = `${backendUrl}/api/homepage-banners/${bannerId}/image`;

    const banner = await prisma.homepageBanner.create({
      data: {
        id: bannerId,
        title: title || null,
        imageUrl: imageUrl,
        imageData: imageData,
        subtitle: subtitle || null,
        ctaText: buttonText || null,
        ctaLink: buttonUrl || null,
        filePath: req.file.filename,
        displayOrder: order ? parseInt(order) : 0,
        isActive: isActive !== undefined ? isActive === 'true' : true,
      },
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error('Error uploading banner:', error);
    res.status(500).json({ error: 'Failed to upload banner' });
  }
});

router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), uploadSingle('image'), [
  body('title').optional().trim().notEmpty(),
], validate, bannerController.updateBanner);

// PATCH /:id - for admin panel status/order updates (no auth needed for basic updates)
router.patch('/:id', bannerController.updateBanner);

router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), bannerController.deleteBanner);

export default router;

import multer from 'multer';
import path from 'path';
import { storageConfig } from '../config/storage';
import { AppError } from './error';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create news images directory
const newsImagesDir = path.join(uploadsDir, 'news', 'images');
if (!fs.existsSync(newsImagesDir)) {
  fs.mkdirSync(newsImagesDir, { recursive: true });
}

// Create homepage banners directory
const bannersDir = path.join(uploadsDir, 'banners');
if (!fs.existsSync(bannersDir)) {
  fs.mkdirSync(bannersDir, { recursive: true });
}

// Create gallery directory
const galleryDir = path.join(uploadsDir, 'gallery');
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [...storageConfig.allowedImageTypes, ...storageConfig.allowedVideoTypes, ...(storageConfig as any).allowedDocumentTypes || []];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only images, videos, and PDFs are allowed.', 400));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Upload destination check:', {
      originalUrl: req.originalUrl,
      url: req.url,
      path: req.path,
      fieldname: file.fieldname
    });
    
    // Check if this is a banner upload based on route
    const isBannerUpload = req.originalUrl?.includes('homepage-banners') ||
                          req.url?.includes('homepage-banners') ||
                          req.path?.includes('homepage-banners');
    
    // Check if this is a gallery upload
    const isGalleryUpload = req.originalUrl?.includes('gallery') ||
                          req.url?.includes('gallery') ||
                          req.path?.includes('gallery');

    if (isGalleryUpload) {
      const galleryDir = path.join(uploadsDir, 'gallery');
      if (!fs.existsSync(galleryDir)) {
        fs.mkdirSync(galleryDir, { recursive: true });
      }
      console.log('Using gallery directory:', galleryDir);
      cb(null, galleryDir);
    } else if (isBannerUpload) {
      const bannersDir = path.join(uploadsDir, 'banners');
      if (!fs.existsSync(bannersDir)) {
        fs.mkdirSync(bannersDir, { recursive: true });
      }
      cb(null, bannersDir);
    } else {
      const newsImagesDir = path.join(uploadsDir, 'news', 'images');
      if (!fs.existsSync(newsImagesDir)) {
        fs.mkdirSync(newsImagesDir, { recursive: true });
      }
      cb(null, newsImagesDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Memory storage for S3 uploads (not used currently but kept for future)
const memoryStorage = multer.memoryStorage();

export const uploadMemory = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for memory storage
  },
});

export const uploadMultipleMemory = (fieldName: string, maxCount: number) => uploadMemory.array(fieldName, maxCount);

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: storageConfig.maxFileSize,
  },
});

export const uploadSingle = (fieldName: string) => upload.single(fieldName);
export const uploadMultiple = (fieldName: string, maxCount: number) => upload.array(fieldName, maxCount);

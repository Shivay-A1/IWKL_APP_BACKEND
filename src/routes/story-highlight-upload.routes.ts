import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads/highlights');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

// POST /api/highlights/:id/media/upload - Upload media to highlight
router.post('/:id/media/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { caption, order } = req.body;

    // Check if highlight exists
    const highlight = await prisma.storyHighlight.findUnique({
      where: { id: req.params.id },
    });

    if (!highlight) {
      return res.status(404).json({ error: 'Highlight not found' });
    }

    // Create file URL
    const backendUrl = process.env.RAILWAY_PUBLIC_URL || 'https://iwklappbackend-production.up.railway.app';
    const fileUrl = `${backendUrl}/uploads/highlights/${req.file.filename}`;
    const isVideoFile = req.file.mimetype.startsWith('video/');

    const media = await prisma.storyMedia.create({
      data: {
        highlightId: req.params.id,
        type: isVideoFile ? 'video' : 'image',
        url: fileUrl,
        caption: caption || null,
        order: order ? parseInt(order) : 0,
      },
    });

    res.status(201).json(media);
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

// POST /api/highlights/cover/upload - Upload cover image for highlight
router.post('/cover/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { highlightId } = req.body;

    // Create file URL
    const backendUrl = process.env.RAILWAY_PUBLIC_URL || 'https://iwklappbackend-production.up.railway.app';
    const fileUrl = `${backendUrl}/uploads/highlights/${req.file.filename}`;

    // Update highlight with cover image
    const highlight = await prisma.storyHighlight.update({
      where: { id: highlightId },
      data: { coverImage: fileUrl },
    });

    res.json(highlight);
  } catch (error) {
    console.error('Error uploading cover:', error);
    res.status(500).json({ error: 'Failed to upload cover image' });
  }
});

export default router;

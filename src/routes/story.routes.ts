import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads/stories');
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
    fileSize: 10 * 1024 * 1024, // 10MB limit
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

// GET /api/stories - Get all active stories
router.get('/', async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      where: {
        enabled: true,
        OR: [
          { expiryTime: null },
          { expiryTime: { gt: new Date() } },
        ],
      },
      orderBy: {
        order: 'asc',
      },
    });

    res.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// GET /api/stories/:id - Get single story
router.get('/:id', async (req, res) => {
  try {
    const story = await prisma.story.findUnique({
      where: { id: req.params.id },
    });

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

// POST /api/stories/upload - Upload story with file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const {
      title,
      caption,
      link,
      username,
      userImage,
      expiryTime,
      order,
      enabled,
      isVideo,
    } = req.body;

    // Create file URL and file path with full backend URL
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    const fileUrl = `${baseUrl}/uploads/stories/${req.file.filename}`;
    const filePath = `uploads/stories/${req.file.filename}`;
    const isVideoFile = req.file.mimetype.startsWith('video/');

    const story = await prisma.story.create({
      data: {
        title,
        imageUrl: !isVideoFile ? fileUrl : null,
        videoUrl: isVideoFile ? fileUrl : null,
        filePath: filePath,
        isVideo: isVideoFile || isVideo === 'true',
        caption,
        link,
        username,
        userImage,
        expiryTime: expiryTime ? new Date(expiryTime) : null,
        order: order ? parseInt(order) : 0,
        enabled: enabled !== undefined ? enabled === 'true' : true,
      },
    });

    res.status(201).json(story);
  } catch (error) {
    console.error('Error uploading story:', error);
    res.status(500).json({ error: 'Failed to upload story' });
  }
});

// POST /api/stories - Create new story (Public for testing)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      imageUrl,
      videoUrl,
      isVideo,
      caption,
      link,
      username,
      userImage,
      expiryTime,
      order,
      enabled,
    } = req.body;

    const story = await prisma.story.create({
      data: {
        title,
        imageUrl,
        videoUrl,
        isVideo: isVideo || false,
        caption,
        link,
        username,
        userImage,
        expiryTime: expiryTime ? new Date(expiryTime) : null,
        order: order || 0,
        enabled: enabled !== undefined ? enabled : true,
      },
    });

    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

// PUT /api/stories/:id - Update story (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      imageUrl,
      videoUrl,
      isVideo,
      caption,
      link,
      username,
      userImage,
      expiryTime,
      order,
      enabled,
    } = req.body;

    const story = await prisma.story.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(isVideo !== undefined && { isVideo }),
        ...(caption !== undefined && { caption }),
        ...(link !== undefined && { link }),
        ...(username !== undefined && { username }),
        ...(userImage !== undefined && { userImage }),
        ...(expiryTime !== undefined && { expiryTime: new Date(expiryTime) }),
        ...(order !== undefined && { order }),
        ...(enabled !== undefined && { enabled }),
      },
    });

    res.json(story);
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ error: 'Failed to update story' });
  }
});

// DELETE /api/stories/:id - Delete story (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.story.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

// PATCH /api/stories/:id/toggle - Toggle story enable/disable (Admin only)
router.patch('/:id/toggle', async (req, res) => {
  try {
    const story = await prisma.story.findUnique({
      where: { id: req.params.id },
    });

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const updatedStory = await prisma.story.update({
      where: { id: req.params.id },
      data: { enabled: !story.enabled },
    });

    res.json(updatedStory);
  } catch (error) {
    console.error('Error toggling story:', error);
    res.status(500).json({ error: 'Failed to toggle story' });
  }
});

export default router;

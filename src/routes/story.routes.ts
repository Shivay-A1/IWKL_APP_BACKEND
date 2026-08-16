import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

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

// POST /api/stories - Create new story (Admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
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
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
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
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
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
router.patch('/:id/toggle', authenticate, authorize('admin'), async (req, res) => {
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

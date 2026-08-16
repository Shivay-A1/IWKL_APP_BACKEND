import { Request, Response } from 'express';
import { prisma } from '../config';

// Get all active stories for mobile app
export const getStories = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const stories = await prisma.appStory.findMany({
      where: {
        isActive: true,
        OR: [
          { expiryDate: null },
          { expiryDate: { gt: now } }
        ],
        AND: [
          {
            OR: [
              { scheduledAt: null },
              { scheduledAt: { lte: now } }
            ]
          }
        ]
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });

    res.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
};

// Get story by ID
export const getStoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const story = await prisma.appStory.findUnique({
      where: { id }
    });

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
};

// Create new story (Admin)
export const createStory = async (req: Request, res: Response) => {
  try {
    const { title, mediaUrl, mediaType, thumbnailUrl, linkUrl, description, displayOrder, expiryDate, scheduledAt } = req.body;

    const story = await prisma.appStory.create({
      data: {
        title,
        mediaUrl,
        mediaType,
        thumbnailUrl,
        linkUrl,
        description,
        displayOrder: displayOrder || 0,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      }
    });

    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
};

// Update story (Admin)
export const updateStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, mediaUrl, mediaType, thumbnailUrl, linkUrl, description, displayOrder, expiryDate, scheduledAt, isActive } = req.body;

    const story = await prisma.appStory.update({
      where: { id },
      data: {
        title,
        mediaUrl,
        mediaType,
        thumbnailUrl,
        linkUrl,
        description,
        displayOrder,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        isActive
      }
    });

    res.json(story);
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ error: 'Failed to update story' });
  }
};

// Delete story (Admin)
export const deleteStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.appStory.delete({
      where: { id }
    });

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
};

// Toggle story status (Admin)
export const toggleStoryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const story = await prisma.appStory.findUnique({
      where: { id }
    });

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const updatedStory = await prisma.appStory.update({
      where: { id },
      data: { isActive: !story.isActive }
    });

    res.json(updatedStory);
  } catch (error) {
    console.error('Error toggling story status:', error);
    res.status(500).json({ error: 'Failed to toggle story status' });
  }
};

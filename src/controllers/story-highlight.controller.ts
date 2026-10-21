import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/highlights - Get all active highlights
export const getHighlights = async (req: Request, res: Response) => {
  try {
    const highlights = await prisma.storyHighlight.findMany({
      where: { isActive: true },
      include: {
        media: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    res.json(highlights);
  } catch (error) {
    console.error('Error fetching highlights:', error);
    res.status(500).json({ error: 'Failed to fetch highlights' });
  }
};

// GET /api/highlights/:id - Get single highlight with media
export const getHighlightById = async (req: Request, res: Response) => {
  try {
    const highlight = await prisma.storyHighlight.findUnique({
      where: { id: req.params.id },
      include: {
        media: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!highlight) {
      return res.status(404).json({ error: 'Highlight not found' });
    }

    res.json(highlight);
  } catch (error) {
    console.error('Error fetching highlight:', error);
    res.status(500).json({ error: 'Failed to fetch highlight' });
  }
};

// POST /api/highlights - Create new highlight
export const createHighlight = async (req: Request, res: Response) => {
  try {
    const { name, coverImage, isActive, displayOrder } = req.body;

    const highlight = await prisma.storyHighlight.create({
      data: {
        name,
        coverImage,
        isActive: isActive !== undefined ? isActive : true,
        displayOrder: displayOrder || 0,
      },
    });

    res.status(201).json(highlight);
  } catch (error) {
    console.error('Error creating highlight:', error);
    res.status(500).json({ error: 'Failed to create highlight' });
  }
};

// PUT /api/highlights/:id - Update highlight
export const updateHighlight = async (req: Request, res: Response) => {
  try {
    const { name, coverImage, isActive, displayOrder } = req.body;

    const highlight = await prisma.storyHighlight.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(coverImage !== undefined && { coverImage }),
        ...(isActive !== undefined && { isActive }),
        ...(displayOrder !== undefined && { displayOrder }),
      },
    });

    res.json(highlight);
  } catch (error) {
    console.error('Error updating highlight:', error);
    res.status(500).json({ error: 'Failed to update highlight' });
  }
};

// DELETE /api/highlights/:id - Delete highlight (cascades to media)
export const deleteHighlight = async (req: Request, res: Response) => {
  try {
    await prisma.storyHighlight.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Highlight deleted successfully' });
  } catch (error) {
    console.error('Error deleting highlight:', error);
    res.status(500).json({ error: 'Failed to delete highlight' });
  }
};

// PATCH /api/highlights/:id/toggle - Toggle highlight active status
export const toggleHighlight = async (req: Request, res: Response) => {
  try {
    const highlight = await prisma.storyHighlight.findUnique({
      where: { id: req.params.id },
    });

    if (!highlight) {
      return res.status(404).json({ error: 'Highlight not found' });
    }

    const updatedHighlight = await prisma.storyHighlight.update({
      where: { id: req.params.id },
      data: { isActive: !highlight.isActive },
    });

    res.json(updatedHighlight);
  } catch (error) {
    console.error('Error toggling highlight:', error);
    res.status(500).json({ error: 'Failed to toggle highlight' });
  }
};

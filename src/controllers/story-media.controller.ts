import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/highlights/:id/media - Get all media for a highlight
export const getHighlightMedia = async (req: Request, res: Response) => {
  try {
    const media = await prisma.storyMedia.findMany({
      where: { highlightId: req.params.id },
      orderBy: { order: 'asc' },
    });

    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};

// POST /api/highlights/:id/media - Add media to highlight
export const addMediaToHighlight = async (req: Request, res: Response) => {
  try {
    const { type, url, caption, order } = req.body;

    const media = await prisma.storyMedia.create({
      data: {
        highlightId: req.params.id,
        type,
        url,
        caption,
        order: order || 0,
      },
    });

    res.status(201).json(media);
  } catch (error) {
    console.error('Error adding media:', error);
    res.status(500).json({ error: 'Failed to add media' });
  }
};

// PUT /api/highlights/:id/media/:mediaId - Update media
export const updateMedia = async (req: Request, res: Response) => {
  try {
    const { type, url, caption, order } = req.body;

    const media = await prisma.storyMedia.update({
      where: { id: req.params.mediaId },
      data: {
        ...(type !== undefined && { type }),
        ...(url !== undefined && { url }),
        ...(caption !== undefined && { caption }),
        ...(order !== undefined && { order }),
      },
    });

    res.json(media);
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({ error: 'Failed to update media' });
  }
};

// DELETE /api/highlights/:id/media/:mediaId - Remove media from highlight
export const deleteMedia = async (req: Request, res: Response) => {
  try {
    await prisma.storyMedia.delete({
      where: { id: req.params.mediaId },
    });

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
};

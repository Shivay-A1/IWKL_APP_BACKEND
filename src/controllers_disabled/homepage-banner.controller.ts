import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const uploadBanner = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, ctaText, ctaLink } = req.body;
    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Get the highest display order
    const lastBanner = await prisma.homepageBanner.findFirst({
      orderBy: { displayOrder: 'desc' }
    });

    const displayOrder = lastBanner ? lastBanner.displayOrder + 1 : 0;

    const banner = await prisma.homepageBanner.create({
      data: {
        imageUrl,
        title: title || null,
        subtitle: subtitle || null,
        ctaText: ctaText || null,
        ctaLink: ctaLink || null,
        displayOrder,
        isActive: true
      }
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error('Error uploading banner:', error);
    res.status(500).json({ error: 'Failed to upload banner' });
  }
};

export const getActiveBanners = async (_req: Request, res: Response) => {
  try {
    const banners = await prisma.homepageBanner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    });

    res.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
};

export const getAllBanners = async (_req: Request, res: Response) => {
  try {
    const banners = await prisma.homepageBanner.findMany({
      orderBy: { displayOrder: 'asc' }
    });

    res.json(banners);
  } catch (error) {
    console.error('Error fetching all banners:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { banners } = req.body;

    // Update each banner's display order
    for (const banner of banners) {
      await prisma.homepageBanner.update({
        where: { id: banner.id },
        data: { displayOrder: banner.displayOrder }
      });
    }

    const updatedBanners = await prisma.homepageBanner.findMany({
      orderBy: { displayOrder: 'asc' }
    });

    res.json(updatedBanners);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const banner = await prisma.homepageBanner.update({
      where: { id },
      data: { isActive }
    });

    res.json(banner);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.homepageBanner.delete({
      where: { id }
    });

    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
};

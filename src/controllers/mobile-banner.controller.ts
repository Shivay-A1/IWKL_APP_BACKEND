import { Request, Response } from 'express';
import { prisma } from '../config';

// Get all banners (Admin)
export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await prisma.mobileBanner.findMany({
      orderBy: {
        displayOrder: 'asc'
      }
    });

    res.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
};

// Get banner by ID
export const getBannerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const banner = await prisma.mobileBanner.findUnique({
      where: { id }
    });

    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.json(banner);
  } catch (error) {
    console.error('Error fetching banner:', error);
    res.status(500).json({ error: 'Failed to fetch banner' });
  }
};

// Get active banners for mobile app
export const getActiveBanners = async (req: Request, res: Response) => {
  try {
    const { screen } = req.query;
    const now = new Date();

    const whereClause: any = {
      isActive: true,
      OR: [
        { startDate: null },
        { startDate: { lte: now } }
      ],
      AND: [
        {
          OR: [
            { endDate: null },
            { endDate: { gt: now } }
          ]
        }
      ]
    };

    if (screen && screen !== 'all') {
      whereClause.OR = [
        { targetScreen: screen },
        { targetScreen: 'all' },
        { targetScreen: null }
      ];
    }

    const banners = await prisma.mobileBanner.findMany({
      where: whereClause,
      orderBy: {
        displayOrder: 'asc'
      }
    });

    res.json(banners);
  } catch (error) {
    console.error('Error fetching active banners:', error);
    res.status(500).json({ error: 'Failed to fetch active banners' });
  }
};

// Create banner (Admin)
export const createBanner = async (req: Request, res: Response) => {
  try {
    const { title, imageUrl, linkUrl, description, displayOrder, startDate, endDate, targetScreen } = req.body;

    const banner = await prisma.mobileBanner.create({
      data: {
        title,
        imageUrl,
        linkUrl,
        description,
        displayOrder: displayOrder || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        targetScreen
      }
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ error: 'Failed to create banner' });
  }
};

// Update banner (Admin)
export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, imageUrl, linkUrl, description, displayOrder, startDate, endDate, targetScreen, isActive } = req.body;

    const banner = await prisma.mobileBanner.update({
      where: { id },
      data: {
        title,
        imageUrl,
        linkUrl,
        description,
        displayOrder,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        targetScreen,
        isActive
      }
    });

    res.json(banner);
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ error: 'Failed to update banner' });
  }
};

// Delete banner (Admin)
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.mobileBanner.delete({
      where: { id }
    });

    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
};

// Toggle banner status (Admin)
export const toggleBannerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const banner = await prisma.mobileBanner.findUnique({
      where: { id }
    });

    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    const updatedBanner = await prisma.mobileBanner.update({
      where: { id },
      data: { isActive: !banner.isActive }
    });

    res.json(updatedBanner);
  } catch (error) {
    console.error('Error toggling banner status:', error);
    res.status(500).json({ error: 'Failed to toggle banner status' });
  }
};

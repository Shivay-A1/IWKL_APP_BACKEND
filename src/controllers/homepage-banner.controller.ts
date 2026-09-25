import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const uploadBanner = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, ctaText, ctaLink } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Convert file to base64
    const base64Data = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const imageData = `data:${mimeType};base64,${base64Data}`;

    // Get the highest display order
    const lastBanner = await prisma.homepageBanner.findFirst({
      orderBy: { displayOrder: 'desc' }
    });

    const displayOrder = lastBanner ? lastBanner.displayOrder + 1 : 0;

    const banner = await prisma.homepageBanner.create({
      data: {
        imageUrl: '', // Will be updated after creation
        imageData,
        title: title || null,
        subtitle: subtitle || null,
        ctaText: ctaText || null,
        ctaLink: ctaLink || null,
        displayOrder,
        isActive: true
      }
    });

    // Update imageUrl to use backend endpoint with actual ID
    const backendUrl = 'https://iwklappbackend-production.up.railway.app';
    const imageUrl = `${backendUrl}/api/homepage-banners/${banner.id}/image`;

    await prisma.homepageBanner.update({
      where: { id: banner.id },
      data: { imageUrl }
    });

    banner.imageUrl = imageUrl;

    res.status(201).json(banner);
  } catch (error) {
    console.error('Error uploading banner:', error);
    res.status(500).json({ error: 'Failed to upload banner' });
  }
};

export const uploadBannerLink = async (req: Request, res: Response) => {
  try {
    const { imageUrl, ctaText, ctaLink, title, subtitle, buttonText, buttonUrl, order, isActive } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Get the highest display order
    const lastBanner = await prisma.homepageBanner.findFirst({
      orderBy: { displayOrder: 'desc' }
    });

    const displayOrder = order ? parseInt(order) : (lastBanner ? lastBanner.displayOrder + 1 : 0);

    const banner = await prisma.homepageBanner.create({
      data: {
        imageUrl, // Store the provided URL as-is
        title: title || null,
        subtitle: subtitle || null,
        ctaText: ctaText || buttonText || null,
        ctaLink: ctaLink || buttonUrl || null,
        displayOrder,
        isActive: isActive !== undefined ? isActive === 'true' : true
      }
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error('Error uploading banner link:', error);
    res.status(500).json({ error: 'Failed to upload banner link' });
  }
};

export const getActiveBanners = async (_req: Request, res: Response) => {
  try {
    const banners = await prisma.homepageBanner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    });

    // Normalize image URLs to use backend endpoint
    const backendUrl = 'https://iwklappbackend-production.up.railway.app';
    const normalizedBanners = banners.map(banner => ({
      ...banner,
      imageUrl: `${backendUrl}/api/homepage-banners/${banner.id}/image`
    }));

    res.json(normalizedBanners);
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

    // Normalize image URLs to use backend endpoint
    const backendUrl = 'https://iwklappbackend-production.up.railway.app';
    const normalizedBanners = banners.map(banner => ({
      ...banner,
      imageUrl: `${backendUrl}/api/homepage-banners/${banner.id}/image`
    }));

    res.json(normalizedBanners);
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

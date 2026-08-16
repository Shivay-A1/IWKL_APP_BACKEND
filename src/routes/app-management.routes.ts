import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/app-management/settings - Get app settings (Admin only)
router.get('/settings', authenticate, authorize('admin'), async (req, res) => {
  try {
    // Return app management settings
    const settings = {
      featuredBanner: null,
      mobilePopup: null,
      versionControl: {
        currentVersion: '1.0.0',
        minRequiredVersion: '1.0.0',
        forceUpdate: false,
      },
      homeBannerOrder: [],
      appAnnouncement: null,
      bottomNavigationOrder: ['home', 'matches', 'ott', 'standings', 'more'],
      featuredVideos: [],
      ottBanner: null,
      mobileAds: {
        enabled: false,
        bannerAdId: null,
        interstitialAdId: null,
      },
    };

    res.json(settings);
  } catch (error) {
    console.error('Error fetching app settings:', error);
    res.status(500).json({ error: 'Failed to fetch app settings' });
  }
});

// PUT /api/app-management/settings - Update app settings (Admin only)
router.put('/settings', authenticate, authorize('admin'), async (req, res) => {
  try {
    const settings = req.body;

    // TODO: Store settings in database or config file
    // For now, just return success

    res.json({ message: 'App settings updated successfully', settings });
  } catch (error) {
    console.error('Error updating app settings:', error);
    res.status(500).json({ error: 'Failed to update app settings' });
  }
});

// POST /api/app-management/featured-banner - Set featured banner (Admin only)
router.post('/featured-banner', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { imageUrl, title, subtitle, link, enabled, order } = req.body;

    // TODO: Store featured banner in database

    res.json({
      message: 'Featured banner set successfully',
      banner: { imageUrl, title, subtitle, link, enabled, order },
    });
  } catch (error) {
    console.error('Error setting featured banner:', error);
    res.status(500).json({ error: 'Failed to set featured banner' });
  }
});

// POST /api/app-management/mobile-popup - Create mobile popup (Admin only)
router.post('/mobile-popup', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, message, imageUrl, link, showOnce, enabled, expiryDate } = req.body;

    // TODO: Store mobile popup in database

    res.json({
      message: 'Mobile popup created successfully',
      popup: { title, message, imageUrl, link, showOnce, enabled, expiryDate },
    });
  } catch (error) {
    console.error('Error creating mobile popup:', error);
    res.status(500).json({ error: 'Failed to create mobile popup' });
  }
});

// PUT /api/app-management/version-control - Update version control (Admin only)
router.put('/version-control', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { currentVersion, minRequiredVersion, forceUpdate } = req.body;

    // TODO: Store version control in database

    res.json({
      message: 'Version control updated successfully',
      versionControl: { currentVersion, minRequiredVersion, forceUpdate },
    });
  } catch (error) {
    console.error('Error updating version control:', error);
    res.status(500).json({ error: 'Failed to update version control' });
  }
});

// POST /api/app-management/announcement - Create app announcement (Admin only)
router.post('/announcement', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, message, priority, enabled, expiryDate } = req.body;

    // TODO: Store announcement in database

    res.json({
      message: 'App announcement created successfully',
      announcement: { title, message, priority, enabled, expiryDate },
    });
  } catch (error) {
    console.error('Error creating app announcement:', error);
    res.status(500).json({ error: 'Failed to create app announcement' });
  }
});

// PUT /api/app-management/navigation-order - Update bottom navigation order (Admin only)
router.put('/navigation-order', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { order } = req.body;

    // TODO: Store navigation order in database

    res.json({
      message: 'Navigation order updated successfully',
      order,
    });
  } catch (error) {
    console.error('Error updating navigation order:', error);
    res.status(500).json({ error: 'Failed to update navigation order' });
  }
});

// POST /api/app-management/featured-video - Add featured video (Admin only)
router.post('/featured-video', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { videoId, title, thumbnailUrl, order, enabled } = req.body;

    // TODO: Store featured video in database

    res.json({
      message: 'Featured video added successfully',
      video: { videoId, title, thumbnailUrl, order, enabled },
    });
  } catch (error) {
    console.error('Error adding featured video:', error);
    res.status(500).json({ error: 'Failed to add featured video' });
  }
});

// POST /api/app-management/ott-banner - Set OTT banner (Admin only)
router.post('/ott-banner', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { imageUrl, title, link, enabled } = req.body;

    // TODO: Store OTT banner in database

    res.json({
      message: 'OTT banner set successfully',
      banner: { imageUrl, title, link, enabled },
    });
  } catch (error) {
    console.error('Error setting OTT banner:', error);
    res.status(500).json({ error: 'Failed to set OTT banner' });
  }
});

// PUT /api/app-management/mobile-ads - Update mobile ads settings (Admin only)
router.put('/mobile-ads', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { enabled, bannerAdId, interstitialAdId } = req.body;

    // TODO: Store mobile ads settings in database

    res.json({
      message: 'Mobile ads settings updated successfully',
      mobileAds: { enabled, bannerAdId, interstitialAdId },
    });
  } catch (error) {
    console.error('Error updating mobile ads settings:', error);
    res.status(500).json({ error: 'Failed to update mobile ads settings' });
  }
});

// ==================== STORIES MANAGEMENT ====================

// GET /api/app-management/stories - Get all stories (Admin only)
router.get('/stories', authenticate, authorize('admin'), async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { order: 'asc' },
    });

    res.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// POST /api/app-management/stories - Create new story (Admin only)
router.post('/stories', authenticate, authorize('admin'), async (req, res) => {
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
      enabled,
      order,
    } = req.body;

    const story = await prisma.story.create({
      data: {
        title: title ?? caption,
        imageUrl,
        videoUrl,
        isVideo: isVideo ?? false,
        caption,
        link,
        username,
        userImage,
        expiryTime: expiryTime ? new Date(expiryTime) : null,
        enabled: enabled ?? true,
        order: order ?? 0,
      },
    });

    res.json({
      message: 'Story created successfully',
      story,
    });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

// PUT /api/app-management/stories/:id - Update story (Admin only)
router.put('/stories/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
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
      enabled,
      order,
    } = req.body;

    const story = await prisma.story.update({
      where: { id },
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
        ...(enabled !== undefined && { enabled }),
        ...(order !== undefined && { order }),
      },
    });

    res.json({
      message: 'Story updated successfully',
      story,
    });
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ error: 'Failed to update story' });
  }
});

// DELETE /api/app-management/stories/:id - Delete story (Admin only)
router.delete('/stories/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.story.delete({
      where: { id },
    });

    res.json({
      message: 'Story deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

// PATCH /api/app-management/stories/:id/toggle - Toggle story enabled status (Admin only)
router.patch('/stories/:id/toggle', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const updatedStory = await prisma.story.update({
      where: { id },
      data: { enabled: !story.enabled },
    });

    res.json({
      message: 'Story status toggled successfully',
      story: updatedStory,
    });
  } catch (error) {
    console.error('Error toggling story status:', error);
    res.status(500).json({ error: 'Failed to toggle story status' });
  }
});

export default router;

import { Request, Response } from 'express';
import { prisma } from '../config';

// Get all settings (Admin)
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.appSetting.findMany({
      orderBy: {
        category: 'asc'
      }
    });

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Get setting by key (Admin)
export const getSettingByKey = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const setting = await prisma.appSetting.findUnique({
      where: { key }
    });

    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json(setting);
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
};

// Get public settings for mobile app
export const getPublicSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.appSetting.findMany({
      where: {
        category: {
          in: ['general', 'features', 'ui']
        }
      }
    });

    // Convert to key-value object
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ error: 'Failed to fetch public settings' });
  }
};

// Create setting (Admin)
export const createSetting = async (req: Request, res: Response) => {
  try {
    const { key, value, description, category } = req.body;

    const setting = await prisma.appSetting.create({
      data: {
        key,
        value,
        description,
        category
      }
    });

    res.status(201).json(setting);
  } catch (error) {
    console.error('Error creating setting:', error);
    res.status(500).json({ error: 'Failed to create setting' });
  }
};

// Update setting (Admin)
export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value, description, category } = req.body;

    const setting = await prisma.appSetting.update({
      where: { key },
      data: {
        value,
        description,
        category
      }
    });

    res.json(setting);
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

// Delete setting (Admin)
export const deleteSetting = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    await prisma.appSetting.delete({
      where: { key }
    });

    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
};

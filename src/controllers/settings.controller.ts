import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

interface AuthRequest extends Request {
  user?: any;
}

export const getSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    let settings = await prisma.userSettings.findUnique({
      where: { userId: req.user.id },
    });

    // Create settings if not exists
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: { userId: req.user.id },
      });
    }

    res.json({ settings });
  } catch (error: any) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const {
      enableNotifications,
      enableMatchAlerts,
      enableNewsAlerts,
      language,
      theme,
    } = req.body;

    const updateData: any = {};

    if (typeof enableNotifications === 'boolean') {
      updateData.enableNotifications = enableNotifications;
    }
    if (typeof enableMatchAlerts === 'boolean') {
      updateData.enableMatchAlerts = enableMatchAlerts;
    }
    if (typeof enableNewsAlerts === 'boolean') {
      updateData.enableNewsAlerts = enableNewsAlerts;
    }
    if (language) {
      updateData.language = language;
    }
    if (theme) {
      updateData.theme = theme;
    }

    const settings = await prisma.userSettings.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        ...updateData,
      },
      update: updateData,
    });

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error: any) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

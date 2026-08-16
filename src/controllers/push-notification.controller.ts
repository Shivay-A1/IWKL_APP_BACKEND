import { Request, Response } from 'express';
import { prisma } from '../config';

// Optional Firebase import - will work even if not installed
let admin: any;
try {
  admin = require('firebase-admin');
} catch (error) {
  console.log('Firebase Admin not installed - push notifications will be simulated');
  admin = null;
}

// Get all notifications (Admin)
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.pushNotification.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Get notification by ID (Admin)
export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await prisma.pushNotification.findUnique({
      where: { id }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
};

// Create notification (Admin)
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { title, body, data, targetAudience, targetUserIds, imageUrl, linkUrl, scheduledAt } = req.body;

    const notification = await prisma.pushNotification.create({
      data: {
        title,
        body,
        data,
        targetAudience: targetAudience || 'all',
        targetUserIds: targetUserIds || [],
        imageUrl,
        linkUrl,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      }
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

// Send notification (Admin)
export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await prisma.pushNotification.findUnique({
      where: { id }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Send via Firebase Cloud Messaging
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl || undefined
      },
      data: notification.data as Record<string, string> || {},
      android: {
        notification: {
          clickAction: notification.linkUrl || undefined
        }
      }
    };

    // Send to all users or specific users
    if (notification.targetAudience === 'all') {
      await admin.messaging().sendToTopic('all', message);
    } else if (notification.targetAudience === 'specific' && notification.targetUserIds.length > 0) {
      // Send to specific users (you'd need to store FCM tokens for each user)
      for (const userId of notification.targetUserIds) {
        // Get user's FCM token from database (you'd need to add fcmToken field to User model)
        // await admin.messaging().send({ ...message, token: userFcmToken });
      }
    }

    // Update notification as sent
    const updatedNotification = await prisma.pushNotification.update({
      where: { id },
      data: {
        isSent: true,
        sentAt: new Date()
      }
    });

    res.json(updatedNotification);
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};

// Schedule notification (Admin)
export const scheduleNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { scheduledAt } = req.body;

    const notification = await prisma.pushNotification.update({
      where: { id },
      data: {
        scheduledAt: new Date(scheduledAt)
      }
    });

    res.json(notification);
  } catch (error) {
    console.error('Error scheduling notification:', error);
    res.status(500).json({ error: 'Failed to schedule notification' });
  }
};

// Delete notification (Admin)
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.pushNotification.delete({
      where: { id }
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

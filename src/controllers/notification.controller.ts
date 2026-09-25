import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as notificationService from '../services/notification.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createNotification = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req: AuthRequest, res: Response, next: any) => {
  try {
    // Return all notifications for public endpoint (no user filter)
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response, next: any) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    res.json(notification);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response, next: any) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    await notificationService.markAllAsRead(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response, next: any) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    await notificationService.deleteNotification(req.params.id, req.user.id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const sendBroadcast = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await notificationService.sendBroadcast(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

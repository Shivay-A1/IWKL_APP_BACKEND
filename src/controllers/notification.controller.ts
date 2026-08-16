import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as notificationService from '../services/notification.service';

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
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const notifications = await notificationService.getNotifications(req.user.id, req.query);
    res.json(notifications);
  } catch (error) {
    next(error);
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

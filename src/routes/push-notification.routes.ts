import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import { AuthRequest } from '../types/express';

const router = Router();
const prisma = new PrismaClient();

// POST /api/push-notifications/send - Send push notification to all users (Admin only)
router.post('/send', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      data,
      targetUsers, // Optional: Array of user IDs to target specific users
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    // Create notification records for all users or specific users
    const users = targetUsers
      ? await prisma.user.findMany({
          where: { id: { in: targetUsers } },
        })
      : await prisma.user.findMany();

    if (users.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }

    const notifications = await Promise.all(
      users.map((user) =>
        prisma.notification.create({
          data: {
            userId: user.id,
            type: type || 'ADMIN_BROADCAST',
            title,
            message,
            data: data || {},
          },
        })
      )
    );

    // TODO: Integrate with Firebase Cloud Messaging (FCM) for actual push notifications
    // This would require FCM device tokens to be stored in the database

    res.json({
      message: 'Notifications created successfully',
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
    res.status(500).json({ error: 'Failed to send push notification', details: error.message });
  }
});

// POST /api/push-notifications/send-to-user - Send notification to specific user (Admin only)
router.post('/send-to-user', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), async (req, res) => {
  try {
    const { userId, title, message, type, data } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type: type || 'ADMIN_BROADCAST',
        title,
        message,
        data: data || {},
      },
    });

    // TODO: Send FCM push notification to user's device

    res.json(notification);
  } catch (error) {
    console.error('Error sending notification to user:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// GET /api/push-notifications - Get all notifications (Admin only)
router.get('/', authenticate, authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// GET /api/push-notifications/my - Get current user's notifications
router.get('/my', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PATCH /api/push-notifications/:id/read - Mark notification as read
router.patch('/:id/read', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });

    res.json(updatedNotification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// PATCH /api/push-notifications/read-all - Mark all notifications as read for current user
router.patch('/read-all', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// DELETE /api/push-notifications/:id - Delete notification (Admin only or own notification)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Only admin or notification owner can delete
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'LEAGUE_ADMIN' && notification.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.notification.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// POST /api/push-notifications/register-device - Register FCM device token for user
router.post('/register-device', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { deviceToken, platform } = req.body; // platform: 'android', 'ios'

    if (!deviceToken) {
      return res.status(400).json({ error: 'Device token is required' });
    }

    // TODO: Create a DeviceToken model in Prisma schema to store FCM tokens
    // For now, we'll store it in user metadata or create a new model

    res.json({ message: 'Device registered successfully' });
  } catch (error) {
    console.error('Error registering device:', error);
    res.status(500).json({ error: 'Failed to register device' });
  }
});

export default router;

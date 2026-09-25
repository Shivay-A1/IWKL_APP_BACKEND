import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { getPaginationParams, calculatePagination } from '../utils';
import { getIO } from '../config/socket';

export const createNotification = async (data: any) => {
  const notification = await prisma.notification.create({
    data,
  });

  // Emit notification to user via Socket.io
  try {
    const io = getIO();
    io.emit('new-notification', notification);
  } catch (error) {
    console.log('Socket.io not available for notification emission');
  }

  return notification;
};

export const getNotifications = async (userId: string, query: any) => {
  const { page, limit, sortBy, sortOrder } = getPaginationParams(query);
  const { isRead, type } = query;

  const where: any = { userId };
  if (isRead !== undefined) where.isRead = isRead === 'true';
  if (type) where.type = type;

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  return {
    data: notifications,
    pagination: calculatePagination(page, limit, total),
    unreadCount,
  };
};

export const markAsRead = async (id: string, userId: string) => {
  const notification = await prisma.notification.findFirst({
    where: { id, userId },
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  return updated;
};

export const markAllAsRead = async (userId: string) => {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

export const deleteNotification = async (id: string, userId: string) => {
  const notification = await prisma.notification.findFirst({
    where: { id, userId },
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  await prisma.notification.delete({ where: { id } });
};

export const sendBroadcast = async (data: any) => {
  const { title, message, type = 'ADMIN_BROADCAST' } = data;

  // Get all users (not just verified ones for testing)
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  console.log(`Sending broadcast to ${users.length} users`);

  const notifications = await prisma.notification.createMany({
    data: users.map((user) => ({
      userId: user.id,
      type,
      title,
      message,
    })),
  });

  // Emit broadcast notification to all connected clients
  try {
    const io = getIO();
    io.emit('new-notification', {
      type,
      title,
      message,
      count: notifications.count,
    });
    console.log('Broadcast notification emitted via Socket.io');
  } catch (error) {
    console.log('Socket.io not available for broadcast emission');
  }

  return { message: 'Broadcast sent successfully', count: notifications.count };
};

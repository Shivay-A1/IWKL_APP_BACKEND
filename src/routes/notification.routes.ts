import { Router } from 'express';
import { body } from 'express-validator';
import * as notificationController from '../controllers/notification.controller';
import { authenticate, authorize, validate, apiLimiter } from '../middleware';

const router = Router();

// Public broadcast route for admin panel (no auth required for now)
router.post('/broadcast', apiLimiter, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
], validate, notificationController.sendBroadcast);

// Authenticated routes
router.use(authenticate);

router.post('/', authorize('SUPER_ADMIN', 'LEAGUE_ADMIN'), apiLimiter, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
], validate, notificationController.createNotification);

router.get('/', notificationController.getNotifications);

router.patch('/:id/read', notificationController.markAsRead);

router.patch('/read-all', notificationController.markAllAsRead);

router.delete('/:id', notificationController.deleteNotification);

export default router;

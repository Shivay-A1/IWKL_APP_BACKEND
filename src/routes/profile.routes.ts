import { Router } from 'express';
import { body } from 'express-validator';
import * as profileController from '../controllers/profile.controller';
import { authenticate, validate, apiLimiter } from '../middleware';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

router.get('/', profileController.getProfile);

router.patch('/', [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('mobile').optional().trim().notEmpty().withMessage('Mobile number cannot be empty'),
  body('otp').optional().trim().notEmpty().withMessage('OTP cannot be empty'),
], validate, profileController.updateProfile);

router.patch('/change-password', apiLimiter, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], validate, profileController.changePassword);

router.delete('/account', [
  body('password').notEmpty().withMessage('Password is required'),
], validate, profileController.deleteAccount);

export default router;

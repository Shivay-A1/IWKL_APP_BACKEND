import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller';
import { validate, apiLimiter } from '../middleware';

const router = Router();

// Public routes (no authentication required)
router.post('/send-otp', apiLimiter, [
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
], validate, authController.sendOTP);

router.post('/verify-otp', apiLimiter, [
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('otp').trim().notEmpty().withMessage('OTP is required'),
], validate, authController.verifyOTP);

router.post('/signup', apiLimiter, [
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, authController.signup);

router.post('/signin', apiLimiter, [
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, authController.signin);

router.post('/forgot-password', apiLimiter, [
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
], validate, authController.forgotPassword);

router.post('/reset-password', apiLimiter, [
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('otp').trim().notEmpty().withMessage('OTP is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, authController.resetPassword);

export default router;

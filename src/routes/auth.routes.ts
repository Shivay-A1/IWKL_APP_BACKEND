import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller';
import { authenticate, validate, authLimiter } from '../middleware';

const router = Router();

router.post('/register', authLimiter, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('mobile').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit Indian mobile number is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('mobileVerified').optional().isBoolean(),
], validate, authController.register);

router.post('/check-mobile', [
  body('mobile').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit Indian mobile number is required'),
], validate, authController.checkMobile);

router.post('/login', authLimiter, [
  body('mobile').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit Indian mobile number is required'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, authController.login);

router.post('/admin/login', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, authController.adminLogin);

router.post('/admin-login', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, authController.adminLogin);

router.post('/refresh', authController.refreshToken);

router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required'),
], validate, authController.forgotPassword);

router.post('/verify-otp', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('type').optional().isIn(['email', 'password']).withMessage('Type must be email or password'),
], validate, authController.verifyOTP);

router.post('/resend-otp', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('type').isIn(['email', 'password']).withMessage('Type must be email or password'),
], validate, authController.resendOTP);

router.post('/reset-password', [
  body('mobile').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit Indian mobile number is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], validate, authController.resetPassword);

router.post('/change-password', authenticate, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
], validate, authController.changePassword);

router.post('/logout', authenticate, authController.logout);

router.get('/profile', authenticate, authController.getProfile);

router.put('/profile', authenticate, [
  body('name').optional().trim().notEmpty(),
  body('password').optional().isLength({ min: 8 }),
], validate, authController.updateProfile);

export default router;

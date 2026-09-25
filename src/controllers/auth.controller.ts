import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import SMSService from '../services/sms.service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '7d';

interface AuthRequest extends Request {
  user?: any;
}

export const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Format phone number
    const formattedPhone = phone.replace(/\s/g, '');

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { mobile: formattedPhone },
    });

    // Generate OTP
    const otp = SMSService.generateOTP();
    const otpExpiry = SMSService.getOTPExpiry();

    // Send OTP via SMS
    const smsResult = await SMSService.sendOTP(formattedPhone, otp);

    if (!smsResult.success) {
      return res.status(500).json({ error: smsResult.message });
    }

    // Store OTP in database (create or update user)
    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          phoneOtp: otp,
          phoneOtpExpiry: otpExpiry,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          mobile: formattedPhone,
          firstName: '',
          password: '', // Will be set during signup
          phoneOtp: otp,
          phoneOtpExpiry: otpExpiry,
        },
      });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
      requestId: smsResult.requestId,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    const formattedPhone = phone.replace(/\s/g, '');

    // Find user by phone
    const user = await prisma.user.findUnique({
      where: { mobile: formattedPhone },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify OTP
    if (!user.phoneOtp || !user.phoneOtpExpiry) {
      return res.status(400).json({ error: 'No OTP found for this phone number' });
    }

    const isValid = SMSService.verifyOTP(user.phoneOtp, otp, user.phoneOtpExpiry);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Clear OTP after successful verification
    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneOtp: null,
        phoneOtpExpiry: null,
        isPhoneVerified: true,
      },
    });

    res.json({
      success: true,
      message: 'OTP verified successfully',
      userId: user.id,
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, otp, firstName, password } = req.body;

    if (!phone || !firstName || !password) {
      return res.status(400).json({ error: 'Phone, firstName, and password are required' });
    }

    const formattedPhone = phone.replace(/\s/g, '');

    // Find user by phone
    const user = await prisma.user.findUnique({
      where: { mobile: formattedPhone },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found. Please send OTP first.' });
    }

    // Only verify OTP if it's still in the database (not yet verified)
    if (user.phoneOtp && user.phoneOtpExpiry) {
      if (!otp) {
        return res.status(400).json({ error: 'OTP is required' });
      }

      const isValid = SMSService.verifyOTP(user.phoneOtp, otp, user.phoneOtpExpiry);

      if (!isValid) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with signup details
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        password: hashedPassword,
        phoneOtp: null,
        phoneOtpExpiry: null,
        isPhoneVerified: true,
        lastLogin: new Date(),
      },
    });

    // Create user settings
    await prisma.userSettings.create({
      data: {
        userId: updatedUser.id,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: updatedUser.id, mobile: updatedUser.mobile, role: updatedUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      success: true,
      message: 'Signup successful',
      token,
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to signup' });
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required' });
    }

    const formattedPhone = phone.replace(/\s/g, '');

    // Find user by phone
    const user = await prisma.user.findUnique({
      where: { mobile: formattedPhone },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if password is set (user completed signup)
    if (!user.password) {
      return res.status(400).json({ error: 'Please complete signup first' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, mobile: user.mobile, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      success: true,
      message: 'Signin successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Failed to signin' });
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const formattedPhone = phone.replace(/\s/g, '');

    // Find user by phone
    const user = await prisma.user.findUnique({
      where: { mobile: formattedPhone },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate OTP
    const otp = SMSService.generateOTP();
    const otpExpiry = SMSService.getOTPExpiry();

    // Send OTP via SMS
    const smsResult = await SMSService.sendOTP(formattedPhone, otp);

    if (!smsResult.success) {
      return res.status(500).json({ error: smsResult.message });
    }

    // Store OTP in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneOtp: otp,
        phoneOtpExpiry: otpExpiry,
      },
    });

    res.json({
      success: true,
      message: 'OTP sent for password reset',
      requestId: smsResult.requestId,
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const formattedPhone = phone.replace(/\s/g, '');

    // Find user by phone
    const user = await prisma.user.findUnique({
      where: { mobile: formattedPhone },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify OTP
    if (!user.phoneOtp || !user.phoneOtpExpiry) {
      return res.status(400).json({ error: 'No OTP found. Please request OTP first.' });
    }

    const isValid = SMSService.verifyOTP(user.phoneOtp, otp, user.phoneOtpExpiry);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        phoneOtp: null,
        phoneOtpExpiry: null,
      },
    });

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

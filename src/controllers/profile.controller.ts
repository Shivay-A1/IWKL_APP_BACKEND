import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import SMSService from '../services/sms.service';

interface AuthRequest extends Request {
  user?: any;
}

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        mobile: true,
        email: true,
        avatar: true,
        role: true,
        isPhoneVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { firstName, mobile, otp } = req.body;

    const updateData: any = {};

    // Update first name
    if (firstName) {
      updateData.firstName = firstName;
    }

    // Update mobile number with OTP verification
    if (mobile) {
      const formattedMobile = mobile.replace(/\s/g, '');

      // Check if mobile already exists
      const existingUser = await prisma.user.findUnique({
        where: { mobile: formattedMobile },
      });

      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ error: 'Mobile number already in use' });
      }

      // Verify OTP if changing mobile
      if (otp) {
        const currentUser = await prisma.user.findUnique({
          where: { id: req.user.id },
        });

        if (!currentUser || !currentUser.phoneOtp || !currentUser.phoneOtpExpiry) {
          return res.status(400).json({ error: 'No OTP found. Please send OTP first.' });
        }

        const isValid = SMSService.verifyOTP(currentUser.phoneOtp, otp, currentUser.phoneOtpExpiry);

        if (!isValid) {
          return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        updateData.mobile = formattedMobile;
        updateData.phoneOtp = null;
        updateData.phoneOtpExpiry = null;
        updateData.isPhoneVerified = true;
      } else {
        return res.status(400).json({ error: 'OTP is required to change mobile number' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        mobile: true,
        email: true,
        avatar: true,
        role: true,
        isPhoneVerified: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required to delete account' });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Delete user (cascade will delete related records)
    await prisma.user.delete({
      where: { id: user.id },
    });

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

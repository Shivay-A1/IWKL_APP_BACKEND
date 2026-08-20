import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as authService from '../services/auth.service';
import { AppError } from '../middleware/error';

export const register = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { name, mobile, password, mobileVerified } = req.body;
    const result = await authService.register(name, mobile, password, mobileVerified);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { mobile, password } = req.body;
    const result = await authService.login(mobile, password, res);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new AppError('Refresh token required', 401);
    }
    const result = await authService.refreshToken(refreshToken, res);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await authService.logout(res);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response, next: any) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }
    const profile = await authService.getProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: any) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }
    const profile = await authService.updateProfile(req.user.id, req.body);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: any) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { email, otp, type } = req.body;
    const result = await authService.verifyOTP(email, otp, type);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { mobile, newPassword } = req.body;
    const result = await authService.resetPassword(mobile, newPassword);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const resendOTP = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { email, type } = req.body;
    const result = await authService.resendOTP(email, type);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const checkMobile = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { mobile } = req.body;
    const result = await authService.checkMobile(mobile);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { email, password } = req.body;
    // Disable Prisma admin login - let server.ts handle fallback
    throw new Error('Use fallback admin login in server.ts');
  } catch (error) {
    next(error);
  }
};

import { Response } from 'express';
import { prisma } from '../config';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../utils';
import { AppError } from '../middleware/error';
import { authConfig } from '../config/auth';
import { sendVerificationOTPEmail, sendPasswordResetOTPEmail, sendWelcomeEmail } from './email.service';

export const register = async (name: string, mobile: string, password: string, mobileVerified: boolean = false) => {
  const existingUser = await safePrisma().user.findUnique({ where: { mobile } });
  if (existingUser) {
    throw new AppError('This mobile number is already registered', 409);
  }

  const hashedPassword = await hashPassword(password);

  // Create user with mobile verification status
  const user = await safePrisma().user.create({
    data: {
      name,
      mobile,
      password: hashedPassword,
      isVerified: mobileVerified,
    },
    select: {
      id: true,
      name: true,
      mobile: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
  });

  console.log('=== USER REGISTERED ===');
  console.log('Mobile:', mobile);
  console.log('Name:', name);
  console.log('Mobile Verified:', mobileVerified);
  console.log('=======================================');

  return { 
    user,
    message: 'Registration successful! You can now login.'
  };
};

export const login = async (mobile: string, password: string, res: Response) => {
  console.log('=== LOGIN SERVICE START ===');
  console.log('Mobile:', mobile);
  console.log('Password length:', password.length);
  
  const user = await safePrisma().user.findUnique({ where: { mobile } });
  console.log('User found:', !!user);
  
  if (!user) {
    console.log('User not found');
    throw new AppError('Invalid credentials', 401);
  }

  console.log('User isVerified:', user.isVerified);
  console.log('Stored password hash length:', user.password.length);

  const isPasswordValid = await comparePassword(password, user.password);
  console.log('Password valid:', isPasswordValid);
  
  if (!isPasswordValid) {
    console.log('Invalid password - Please use Forgot Password to reset');
    throw new AppError('Invalid credentials', 401);
  }

  // Update last login
  await safePrisma().user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  // Generate tokens
  const tokenPayload = {
    id: user.id,
    mobile: user.mobile,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);
  
  console.log('Tokens generated');

  // Set cookies
  res.cookie(authConfig.cookie.accessTokenName, accessToken, {
    httpOnly: authConfig.cookie.httpOnly,
    secure: authConfig.cookie.secure,
    sameSite: authConfig.cookie.sameSite,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie(authConfig.cookie.refreshTokenName, refreshToken, {
    httpOnly: authConfig.cookie.httpOnly,
    secure: authConfig.cookie.secure,
    sameSite: authConfig.cookie.sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
      avatar: user.avatar,
    },
    accessToken,
  };
};

export const refreshToken = async (refreshToken: string, res: Response) => {
  try {
    const { verifyRefreshToken, generateAccessToken } = await import('../utils');
    const decoded = verifyRefreshToken(refreshToken);

    const user = await safePrisma().user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        mobile: true,
        role: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const tokenPayload = {
      id: user.id,
      mobile: user.mobile,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);

    res.cookie(authConfig.cookie.accessTokenName, newAccessToken, {
      httpOnly: authConfig.cookie.httpOnly,
      secure: authConfig.cookie.secure,
      sameSite: authConfig.cookie.sameSite,
      maxAge: 15 * 60 * 1000,
    });

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
};

export const logout = async (res: Response) => {
  res.clearCookie(authConfig.cookie.accessTokenName);
  res.clearCookie(authConfig.cookie.refreshTokenName);
};

export const getProfile = async (userId: string) => {
  const user = await safePrisma().user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      isVerified: true,
      lastLogin: true,
      createdAt: true,
      favoriteTeams: {
        include: {
          team: {
            include: {
              season: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

export const updateProfile = async (userId: string, data: any) => {
  const { password, ...updateData } = data;

  if (password) {
    updateData.password = await hashPassword(password);
  }

  const user = await safePrisma().user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      isVerified: true,
      lastLogin: true,
      createdAt: true,
    },
  });

  return user;
};

export const forgotPassword = async (email: string) => {
  console.log('=== FORGOT PASSWORD START ===');
  console.log('Email:', email);
  
  const user = await safePrisma().user.findUnique({ where: { email } });
  
  if (!user) {
    console.log('User not found');
    // For security, don't reveal if email exists or not
    return { message: 'If an account exists with this email, an OTP will be sent' };
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  console.log('Generated OTP:', otp);

  // Update user with OTP
  await safePrisma().user.update({
    where: { id: user.id },
    data: {
      otp,
      otpExpiry,
    },
  });

  // Send OTP via email
  await sendPasswordResetOTPEmail(email, otp);

  console.log('=== FORGOT PASSWORD END ===');
  return { message: 'OTP sent successfully to your email (check backend console logs)' };
};

export const verifyOTP = async (email: string, otp: string, type: 'email' | 'password' = 'email') => {
  const user = await safePrisma().user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!user.otp || !user.otpExpiry) {
    throw new AppError('No OTP generated for this user', 400);
  }

  if (user.otp !== otp) {
    throw new AppError('Invalid OTP', 400);
  }

  if (new Date() > user.otpExpiry) {
    throw new AppError('OTP has expired', 400);
  }

  // OTP is valid, clear it
  await safePrisma().user.update({
    where: { id: user.id },
    data: {
      otp: null,
      otpExpiry: null,
      ...(type === 'email' ? { isVerified: true } : {}),
    },
  });

  // Send welcome email if email verification
  if (type === 'email') {
    await sendWelcomeEmail(email, user.name);
  }

  return { message: type === 'email' ? 'Email verified successfully' : 'OTP verified successfully' };
};

export const resendOTP = async (email: string, type: 'email' | 'password' = 'email') => {
  const user = await safePrisma().user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if last OTP was sent less than 60 seconds ago
  if (user.otpExpiry && new Date() > new Date(user.otpExpiry.getTime() - 9 * 60 * 1000)) {
    throw new AppError('Please wait 60 seconds before requesting a new OTP', 429);
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await safePrisma().user.update({
    where: { id: user.id },
    data: {
      otp,
      otpExpiry,
    },
  });

  // Send OTP via email
  if (type === 'email') {
    await sendVerificationOTPEmail(email, otp, user.name);
  } else {
    await sendPasswordResetOTPEmail(email, otp);
  }

  return { message: 'New OTP sent successfully to your email' };
};

export const resetPassword = async (mobile: string, newPassword: string) => {
  const user = await safePrisma().user.findUnique({ where: { mobile } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const hashedPassword = await hashPassword(newPassword);

  await safePrisma().user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  return { message: 'Password reset successfully' };
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await safePrisma().user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  const hashedPassword = await hashPassword(newPassword);

  await safePrisma().user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });

  return { message: 'Password changed successfully' };
};

// Helper function to safely access prisma
const safePrisma = () => {
  if (!prisma) {
    throw new AppError('Database not available', 503);
  }
  return prisma;
};

export const checkMobile = async (mobile: string) => {
  if (!prisma) {
    return { exists: false };
  }
  const existingUser = await safePrisma().user.findUnique({ where: { mobile } });
  return { exists: !!existingUser };
};

export const adminLogin = async (email: string, password: string, res: Response) => {
  console.log('=== ADMIN LOGIN SERVICE START ===');
  console.log('Email:', email);
  console.log('Password length:', password.length);
  
  // Disable Prisma admin login - use fallback in server.ts instead
  console.log('Using fallback admin login (Prisma tables not available)');
  throw new AppError('Use fallback admin login in server.ts', 501);
};

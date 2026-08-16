import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { v4 as uuidv4 } from 'uuid';
import { sendRegistrationConfirmationEmail, sendApprovalEmail, sendRejectionEmail } from './email.service';
import { serializeSocialMediaPartnerBigInt } from '../utils/serializeBigInt';
import { socialMediaPartnerLogger } from '../utils/logger';

// Generate unique registration number
const generateRegistrationNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await prisma.socialMediaPartnerRegistration.count({
    where: {
      createdAt: {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      },
    },
  });
  const sequence = String(count + 1).padStart(6, '0');
  return `IWKL-SMP-${year}-${sequence}`;
};

// Calculate age from date of birth
const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const registerSocialMediaPartner = async (data: {
  userId?: string;
  fullName: string;
  dob: string;
  gender: string;
  city: string;
  state: string;
  mobile: string;
  email: string;
  instagramUsername?: string;
  instagramFollowers?: number | string;
  youtubeChannel?: string;
  youtubeSubscribers?: number | string;
  facebookUsername?: string;
  facebookFollowers?: number | string;
  twitterUsername?: string;
  twitterFollowers?: number | string;
  linkedin?: string;
  contentCategory?: string;
  primaryAudienceLocation?: string;
  averageMonthlyReach?: number | string;
  averageEngagementRate?: number | string;
  previousSportsExperience?: string;
  reasonToJoin?: string;
  willAttendPressConference?: boolean;
  preferredCity?: string;
  declaration?: boolean;
}) => {
  socialMediaPartnerLogger.info('=== SERVICE REGISTER SOCIAL MEDIA PARTNER START ===', { userId: data.userId });
  socialMediaPartnerLogger.debug('Input data keys', Object.keys(data));
  socialMediaPartnerLogger.debug('Input data', data);
  
  // Normalize mobile: remove spaces, +91, leading 0, leading 91
  const normalizedMobile = data.mobile
    .replace(/\s+/g, '')
    .replace(/^\+91/, '')
    .replace(/^91/, '')
    .replace(/^0/, '');
  
  const normalizedEmail = data.email.trim().toLowerCase();
  
  socialMediaPartnerLogger.debug('=== NORMALIZED INPUTS ===', {
    mobileOriginal: data.mobile,
    mobileNormalized: normalizedMobile,
    emailOriginal: data.email,
    emailNormalized: normalizedEmail,
    userId: data.userId
  });
  
  // Validate and convert numeric fields to BigInt
  const validateBigInt = (value: any, fieldName: string): bigint | null => {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) {
      throw new AppError(`${fieldName} must be a valid positive number`, 400);
    }
    
    // Check if value is too large for BigInt (safe limit is 2^63-1)
    const maxSafeBigInt = BigInt(Number.MAX_SAFE_INTEGER);
    const bigIntValue = BigInt(Math.floor(numValue));
    
    if (bigIntValue > maxSafeBigInt) {
      throw new AppError(`${fieldName} value is too large`, 400);
    }
    
    return bigIntValue;
  };

  const instagramFollowers = validateBigInt(data.instagramFollowers, 'Instagram followers');
  const youtubeSubscribers = validateBigInt(data.youtubeSubscribers, 'YouTube subscribers');
  const facebookFollowers = validateBigInt(data.facebookFollowers, 'Facebook followers');
  const twitterFollowers = validateBigInt(data.twitterFollowers, 'Twitter followers');
  const averageMonthlyReach = validateBigInt(data.averageMonthlyReach, 'Average monthly reach');

  // Validate engagement rate (should be between 0 and 100)
  let averageEngagementRate: number | null = null;
  if (data.averageEngagementRate != null) {
    const engagementRate = Number(data.averageEngagementRate);
    if (isNaN(engagementRate) || engagementRate < 0 || engagementRate > 100) {
      throw new AppError('Average engagement rate must be between 0 and 100', 400);
    }
    averageEngagementRate = engagementRate;
  }

  socialMediaPartnerLogger.debug('Numeric fields validated', {
    instagramFollowers,
    youtubeSubscribers,
    facebookFollowers,
    twitterFollowers,
    averageMonthlyReach,
    averageEngagementRate,
  });
  
  // Validate normalized mobile number (must be exactly 10 digits)
  if (!/^\d{10}$/.test(normalizedMobile)) {
    socialMediaPartnerLogger.warn('Mobile validation failed', { normalizedMobile });
    throw new AppError('Mobile number must be 10 digits after removing country code', 400);
  }
  socialMediaPartnerLogger.debug('Mobile validation passed', { normalizedMobile });
  
  // Check if user already has a registration
  let existingUserRegistration = null;
  if (data.userId) {
    existingUserRegistration = await prisma.socialMediaPartnerRegistration.findFirst({
      where: { userId: data.userId },
    });
    socialMediaPartnerLogger.debug('Existing user registration check', { 
      found: !!existingUserRegistration, 
      registrationNumber: existingUserRegistration?.registrationNumber 
    });
  }
  
  // Check for duplicate registration by mobile or email
  socialMediaPartnerLogger.info('=== DUPLICATE CHECK START ===');
  
  const existingByMobile = await prisma.socialMediaPartnerRegistration.findFirst({
    where: {
      mobile: {
        equals: normalizedMobile,
        mode: 'insensitive',
      },
    },
  });
  socialMediaPartnerLogger.debug('Mobile check result', { 
    found: !!existingByMobile, 
    registrationNumber: existingByMobile?.registrationNumber 
  });
  
  if (existingByMobile) {
    if (!data.userId || String(existingByMobile.userId) !== String(data.userId)) {
      socialMediaPartnerLogger.warn('=== DUPLICATE FOUND: MOBILE (DIFFERENT USER) ===', { registrationNumber: existingByMobile.registrationNumber });
      throw new AppError('Mobile number already registered by another user', 409);
    }
    socialMediaPartnerLogger.info('Mobile belongs to same user, allowing update');
  }
  
  const existingByEmail = await prisma.socialMediaPartnerRegistration.findFirst({
    where: {
      email: {
        equals: normalizedEmail,
        mode: 'insensitive',
      },
    },
  });
  socialMediaPartnerLogger.debug('Email check result', { 
    found: !!existingByEmail, 
    registrationNumber: existingByEmail?.registrationNumber 
  });
  
  if (existingByEmail) {
    if (!existingByEmail.userId && data.userId) {
      socialMediaPartnerLogger.info('Email is unclaimed, allowing user to claim it', { userId: data.userId });
      await prisma.socialMediaPartnerRegistration.update({
        where: { id: existingByEmail.id },
        data: { userId: data.userId },
      });
      socialMediaPartnerLogger.info('Updated registration with userId', { userId: data.userId });
      existingUserRegistration = existingByEmail;
    }
    else if (!data.userId || String(existingByEmail.userId) !== String(data.userId)) {
      socialMediaPartnerLogger.warn('=== DUPLICATE FOUND: EMAIL (DIFFERENT USER) ===', { registrationNumber: existingByEmail.registrationNumber });
      throw new AppError('Email already registered by another user', 409);
    } else {
      socialMediaPartnerLogger.info('Email belongs to same user, allowing update');
    }
  }
  
  socialMediaPartnerLogger.info('=== DUPLICATE CHECK END: NO DUPLICATES FOUND ===');
  
  // Find or create User in database
  let validUserId = data.userId;
  socialMediaPartnerLogger.info('=== USER LOOKUP START ===', { userId: data.userId });
  
  if (data.userId) {
    // First try to find by Firebase UID (this is the primary identifier for Firebase users)
    let existingUser = await prisma.user.findUnique({
      where: { id: data.userId },
    });
    socialMediaPartnerLogger.debug('User found by Firebase UID', { found: !!existingUser });
    
    if (existingUser) {
      socialMediaPartnerLogger.info('=== EXISTING USER FOUND BY FIREBASE UID ===', {
        userId: existingUser.id,
        email: existingUser.email,
        mobile: existingUser.mobile
      });
      validUserId = existingUser.id;
      
      // Update user info if needed
      if (existingUser.email !== normalizedEmail || existingUser.mobile !== normalizedMobile) {
        socialMediaPartnerLogger.info('Updating user email/mobile');
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            email: normalizedEmail,
            mobile: normalizedMobile,
            name: data.fullName,
          },
        });
      }
    } else {
      socialMediaPartnerLogger.info('=== USER NOT FOUND BY FIREBASE UID ===');
      socialMediaPartnerLogger.info('Creating new user with Firebase UID as ID');
      
      // Create User record with Firebase UID as the database ID
      // This ensures frontend Firebase UID matches backend User ID
      try {
        const newUser = await prisma.user.create({
          data: {
            id: data.userId, // Use Firebase UID as database ID
            name: data.fullName,
            email: normalizedEmail,
            mobile: normalizedMobile,
            password: 'FIREBASE_AUTH', // Placeholder for Firebase users
            role: 'USER',
            isVerified: true, // Firebase users are considered verified
          },
        });
        socialMediaPartnerLogger.info('User created successfully with Firebase UID', { userId: newUser.id });
        validUserId = newUser.id;
      } catch (userCreateError: any) {
        socialMediaPartnerLogger.error('Failed to create user', userCreateError);
        
        // Handle unique constraint violations
        if (userCreateError.code === 'P2002') {
          const field = userCreateError.meta?.target?.[0];
          socialMediaPartnerLogger.debug('P2002 error on field', { field });
          
          if (field === 'email') {
            // Email already exists - this means there's a user with this email but different ID
            // We should NOT reuse this user because it would break the Firebase UID mapping
            throw new AppError('Email already registered with a different account. Please use a different email or login with the existing account.', 409);
          } else if (field === 'mobile') {
            // Mobile already exists - similar issue
            throw new AppError('Mobile number already registered with a different account. Please use a different mobile number or login with the existing account.', 409);
          } else {
            throw new AppError('User account already exists. Please login.', 409);
          }
        } else {
          throw new AppError('Failed to create user account. Please try again.', 500);
        }
      }
    }
  } else {
    socialMediaPartnerLogger.info('No userId provided, creating unlinked registration');
  }
  
  socialMediaPartnerLogger.info('=== USER LOOKUP END ===', { 
    validUserId, 
    matchesFirebaseUid: validUserId === data.userId 
  });
  
  // If user already has a registration, update it instead of creating new
  if (existingUserRegistration) {
    socialMediaPartnerLogger.info('=== UPDATING EXISTING REGISTRATION ===', { 
      registrationId: existingUserRegistration.id,
      registrationNumber: existingUserRegistration.registrationNumber
    });
    
    const updatedRegistration = await prisma.socialMediaPartnerRegistration.update({
      where: { id: existingUserRegistration.id },
      data: {
        fullName: data.fullName,
        dob: new Date(data.dob),
        age: calculateAge(data.dob),
        gender: data.gender,
        city: data.city,
        state: data.state,
        mobile: normalizedMobile,
        email: normalizedEmail,
        instagramUsername: data.instagramUsername,
        instagramFollowers: instagramFollowers,
        youtubeChannel: data.youtubeChannel,
        youtubeSubscribers: youtubeSubscribers,
        facebookUsername: data.facebookUsername,
        facebookFollowers: facebookFollowers,
        twitterUsername: data.twitterUsername,
        twitterFollowers: twitterFollowers,
        linkedin: data.linkedin,
        contentCategory: data.contentCategory,
        primaryAudienceLocation: data.primaryAudienceLocation,
        averageMonthlyReach: averageMonthlyReach,
        averageEngagementRate: averageEngagementRate,
        previousSportsExperience: data.previousSportsExperience,
        reasonToJoin: data.reasonToJoin,
        willAttendPressConference: data.willAttendPressConference,
        preferredCity: data.preferredCity,
        declaration: data.declaration,
        status: 'PENDING',
      },
    });
    
    socialMediaPartnerLogger.info('Registration updated successfully', { registrationNumber: updatedRegistration.registrationNumber });
    socialMediaPartnerLogger.info('=== SERVICE REGISTER SOCIAL MEDIA PARTNER END (UPDATE) ===');
    return updatedRegistration;
  }

  // Calculate age
  const age = calculateAge(data.dob);
  socialMediaPartnerLogger.debug('Calculated age', { age });

  // Validate age (should be between 18 and 65 for social media partners)
  if (age < 18 || age > 65) {
    throw new AppError('Age must be between 18 and 65 years', 400);
  }

  // Generate registration number
  socialMediaPartnerLogger.info('Generating registration number');
  const registrationNumber = await generateRegistrationNumber();
  socialMediaPartnerLogger.info('Registration number generated', { registrationNumber });

  // Prepare data for Prisma
  const prismaData = {
    registrationNumber,
    userId: validUserId,
    fullName: data.fullName,
    dob: new Date(data.dob),
    age,
    gender: data.gender,
    city: data.city,
    state: data.state,
    mobile: normalizedMobile,
    email: normalizedEmail,
    instagramUsername: data.instagramUsername,
    instagramFollowers: instagramFollowers,
    youtubeChannel: data.youtubeChannel,
    youtubeSubscribers: youtubeSubscribers,
    facebookUsername: data.facebookUsername,
    facebookFollowers: facebookFollowers,
    twitterUsername: data.twitterUsername,
    twitterFollowers: twitterFollowers,
    linkedin: data.linkedin,
    contentCategory: data.contentCategory,
    primaryAudienceLocation: data.primaryAudienceLocation,
    averageMonthlyReach: averageMonthlyReach,
    averageEngagementRate: averageEngagementRate,
    previousSportsExperience: data.previousSportsExperience,
    reasonToJoin: data.reasonToJoin,
    willAttendPressConference: data.willAttendPressConference || false,
    preferredCity: data.preferredCity,
    declaration: data.declaration || false,
    status: 'PENDING' as const,
  };
  
  socialMediaPartnerLogger.debug('Prisma data prepared', prismaData);

  // Create registration and status history in a transaction
  socialMediaPartnerLogger.info('Creating registration in database with transaction');
  const result = await prisma.$transaction(async (tx) => {
    const registration = await tx.socialMediaPartnerRegistration.create({
      data: prismaData,
    });
    socialMediaPartnerLogger.info('=== REGISTRATION CREATED SUCCESSFULLY ===', {
      registrationId: registration.id,
      registrationNumber: registration.registrationNumber,
      userId: registration.userId,
      fullName: registration.fullName,
      email: registration.email,
      mobile: registration.mobile,
      status: registration.status
    });

    // Create initial status history entry
    socialMediaPartnerLogger.debug('Creating status history entry');
    await tx.socialMediaPartnerStatusHistory.create({
      data: {
        registrationId: registration.id,
        status: 'PENDING',
        remarks: 'Registration submitted successfully',
      },
    });
    socialMediaPartnerLogger.debug('Status history created');

    return registration;
  });

  const registration = result;

  // Send registration confirmation email (non-blocking)
  socialMediaPartnerLogger.info('Sending confirmation email');
  try {
    await sendRegistrationConfirmationEmail(data.email, data.fullName, registrationNumber);
    socialMediaPartnerLogger.info('Email sent successfully', { email: normalizedEmail });
  } catch (emailError) {
    socialMediaPartnerLogger.error('Email sending failed (non-blocking)', emailError);
  }

  socialMediaPartnerLogger.info('=== SERVICE REGISTER SOCIAL MEDIA PARTNER END (CREATE) ===');
  socialMediaPartnerLogger.info('=== REGISTRATION FLOW COMPLETE ===', {
    userId: validUserId,
    registrationId: registration.id,
    registrationNumber: registration.registrationNumber
  });
  
  return registration;
};

export const getAllRegistrations = async (params: {
  search?: string;
  state?: string;
  status?: string;
  page: number;
  limit: number;
}) => {
  socialMediaPartnerLogger.info('=== GET ALL SOCIAL MEDIA PARTNER REGISTRATIONS START ===', params);
  const { search, state, status, page, limit } = params;
  socialMediaPartnerLogger.debug('Query params', { search, state, status, page, limit });

  const where: any = {};

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' as const } },
      { registrationNumber: { contains: search, mode: 'insensitive' as const } },
      { mobile: { contains: search, mode: 'insensitive' as const } },
      { email: { contains: search, mode: 'insensitive' as const } },
    ];
  }

  if (state) {
    where.state = state;
  }

  if (status) {
    where.status = status;
  }

  socialMediaPartnerLogger.debug('Where clause', where);

  const [registrations, total] = await Promise.all([
    prisma.socialMediaPartnerRegistration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.socialMediaPartnerRegistration.count({ where }),
  ]);

  socialMediaPartnerLogger.info('Registrations found', { count: registrations.length, total });
  socialMediaPartnerLogger.debug('Registration numbers', registrations.map(r => r.registrationNumber));
  socialMediaPartnerLogger.info('=== GET ALL SOCIAL MEDIA PARTNER REGISTRATIONS END ===');

  // Convert BigInt values to strings for JSON serialization
  const serializedRegistrations = registrations.map(serializeSocialMediaPartnerBigInt);

  return {
    registrations: serializedRegistrations,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getRegistrationById = async (id: string) => {
  const registration = await prisma.socialMediaPartnerRegistration.findUnique({
    where: { id },
  });

  if (!registration) {
    throw new AppError('Registration not found', 404);
  }

  // Convert BigInt values to strings for JSON serialization
  return serializeSocialMediaPartnerBigInt(registration);
};

export const getRegistrationByUserId = async (userId: string) => {
  socialMediaPartnerLogger.info('=== GET REGISTRATION BY USER ID START ===', { userId });
  
  const registration = await prisma.socialMediaPartnerRegistration.findFirst({
    where: { userId },
  });

  socialMediaPartnerLogger.debug('Registration found', { found: !!registration });
  if (registration) {
    socialMediaPartnerLogger.debug('Registration details', { 
      registrationNumber: registration.registrationNumber,
      registrationId: registration.id
    });
  }
  socialMediaPartnerLogger.info('=== GET REGISTRATION BY USER ID END ===');

  // Return null instead of throwing 404 - this is used to check if user has registration
  if (!registration) return null;

  // Convert BigInt values to strings for JSON serialization
  return serializeSocialMediaPartnerBigInt(registration);
};

export const getRegistrationStatusHistory = async (registrationId: string) => {
  const history = await prisma.socialMediaPartnerStatusHistory.findMany({
    where: { registrationId },
    orderBy: { changedAt: 'asc' },
  });

  return history;
};

export const updateRegistration = async (id: string, data: any, requestingUserId?: string, isAdmin: boolean = false) => {
  socialMediaPartnerLogger.info('=== UPDATE REGISTRATION START ===', { id, requestingUserId, isAdmin });
  
  const existing = await prisma.socialMediaPartnerRegistration.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError('Registration not found', 404);
  }

  socialMediaPartnerLogger.debug('Existing registration found', { registrationNumber: existing.registrationNumber, currentStatus: existing.status });

  // Security check - skip for admin users
  if (!isAdmin && requestingUserId && existing.userId) {
    if (String(existing.userId) !== String(requestingUserId)) {
      throw new AppError('You do not have permission to update this registration', 403);
    }
    if (existing.status !== 'INFO_REQUESTED' && existing.status !== 'PENDING') {
      throw new AppError('Registration can only be updated when status is PENDING or INFO_REQUESTED', 403);
    }
  }

  let updateData: any = { ...data };
  delete updateData.userId;

  // Recalculate age if DOB changed
  if (data.dob) {
    updateData.age = calculateAge(data.dob);
    updateData.dob = new Date(data.dob);
  }

  socialMediaPartnerLogger.debug('Update data', updateData);

  const registration = await prisma.socialMediaPartnerRegistration.update({
    where: { id },
    data: updateData,
  });

  socialMediaPartnerLogger.info('Registration updated successfully', { registrationNumber: registration.registrationNumber });
  socialMediaPartnerLogger.info('=== UPDATE REGISTRATION END ===');
  
  return serializeSocialMediaPartnerBigInt(registration);
};

export const updateStatus = async (id: string, status: string, adminRemarks?: string, notifyPartner: boolean = true, interviewDate?: string, interviewVenue?: string, interviewTime?: string, changedBy?: string, changedByName?: string) => {
  socialMediaPartnerLogger.info('=== UPDATE STATUS START ===', { id, status, changedBy });
  
  const existing = await prisma.socialMediaPartnerRegistration.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError('Registration not found', 404);
  }

  socialMediaPartnerLogger.debug('Existing registration found', { registrationNumber: existing.registrationNumber, currentStatus: existing.status });

  const updateData: any = {
    status: status as any,
    adminRemarks,
  };

  if (interviewDate) updateData.interviewDate = new Date(interviewDate);
  if (interviewVenue) updateData.interviewVenue = interviewVenue;
  if (interviewTime) updateData.interviewTime = interviewTime;

  socialMediaPartnerLogger.debug('Update data', updateData);

  const registration = await prisma.socialMediaPartnerRegistration.update({
    where: { id },
    data: updateData,
  });

  socialMediaPartnerLogger.info('Registration status updated', { registrationNumber: registration.registrationNumber, newStatus: registration.status });

  // Create status history entry
  await prisma.socialMediaPartnerStatusHistory.create({
    data: {
      registrationId: id,
      status: status as any,
      changedBy: changedBy || null,
      changedByName: changedByName || null,
      remarks: adminRemarks || null,
    },
  });

  socialMediaPartnerLogger.debug('Status history entry created');

  // Send email notification if requested and status changed
  if (notifyPartner && existing.status !== status) {
    socialMediaPartnerLogger.info('Sending email notification', { email: existing.email, status });
    try {
      if (status === 'APPROVED') {
        await sendApprovalEmail(
          existing.email,
          existing.fullName,
          existing.registrationNumber,
          interviewDate || (existing.interviewDate ? existing.interviewDate.toISOString().split('T')[0] : undefined),
          interviewVenue || existing.interviewVenue,
          interviewTime || existing.interviewTime
        );
        socialMediaPartnerLogger.info('Approval email sent successfully');
      } else if (status === 'REJECTED') {
        await sendRejectionEmail(
          existing.email,
          existing.fullName,
          existing.registrationNumber,
          adminRemarks
        );
        socialMediaPartnerLogger.info('Rejection email sent successfully');
      }
    } catch (emailError) {
      socialMediaPartnerLogger.error('Email sending failed (non-blocking)', emailError);
    }
  }

  socialMediaPartnerLogger.info('=== UPDATE STATUS END ===');
  return serializeSocialMediaPartnerBigInt(registration);
};

export const deleteRegistration = async (id: string) => {
  const existing = await prisma.socialMediaPartnerRegistration.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError('Registration not found', 404);
  }

  await prisma.socialMediaPartnerRegistration.delete({
    where: { id },
  });
};

export const exportExcel = async () => {
  const registrations = await prisma.socialMediaPartnerRegistration.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const headers = [
    'Registration No',
    'Full Name',
    'Mobile',
    'Email',
    'City',
    'State',
    'Instagram',
    'Instagram Followers',
    'YouTube',
    'YouTube Subscribers',
    'Facebook',
    'Facebook Followers',
    'Twitter',
    'Twitter Followers',
    'Content Category',
    'Average Monthly Reach',
    'Engagement Rate',
    'Status',
    'Registration Date',
  ];

  const rows = registrations.map((r) => [
    r.registrationNumber,
    r.fullName,
    r.mobile,
    r.email,
    r.city,
    r.state,
    r.instagramUsername || '',
    r.instagramFollowers || 0,
    r.youtubeChannel || '',
    r.youtubeSubscribers || 0,
    r.facebookUsername || '',
    r.facebookFollowers || 0,
    r.twitterUsername || '',
    r.twitterFollowers || 0,
    r.contentCategory || '',
    r.averageMonthlyReach || 0,
    r.averageEngagementRate || 0,
    r.status,
    r.createdAt.toISOString(),
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  return csv;
};

export const exportPDF = async () => {
  const PDFDocument = require('pdfkit');
  const fs = require('fs');
  const path = require('path');
  const bwipjs = require('bwip-js');
  
  const registrations = await prisma.socialMediaPartnerRegistration.findMany({
    orderBy: { createdAt: 'desc' },
  });

  if (registrations.length === 0) {
    throw new AppError('No registrations found', 404);
  }

  // Create PDF for first registration
  const registration = registrations[0];
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'portrait',
    margins: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  // Date formatting function
  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // BACKGROUND IMAGE - Full page (optional)
  try {
    const backgroundPath = path.join(__dirname, '../../public/certificate-background.png');
    console.log('Loading background image from:', backgroundPath);
    console.log('Image exists:', fs.existsSync(backgroundPath));
    
    if (fs.existsSync(backgroundPath)) {
      doc.image(backgroundPath, 0, 0, {
        width: 595.28,
        height: 841.89,
        fit: [595.28, 841.89]
      });
      console.log('Background image loaded successfully');
    } else {
      console.warn('Background image not found, using white background');
      // Use white background if image is missing
      doc.rect(0, 0, 595.28, 841.89).fill('#FFFFFF');
    }
  } catch (bgError) {
    console.error('Error loading background image:', bgError);
    // Fallback to white background
    doc.rect(0, 0, 595.28, 841.89).fill('#FFFFFF');
  }

  // REGISTRATION NUMBER (Top Right, smaller size, moved down)
  doc.fontSize(10)
    .fillColor('#4F1B78')
    .font('Helvetica-Bold')
    .text(registration.registrationNumber, 440, 110, { align: 'center' });

  // SIMPLE DETAILS LAYOUT - Split Left and Right
  const leftColumnX = 80;
  const rightColumnX = 350;
  const startY = 280; // Moved down significantly to reduce white space at top
  const lineHeight = 16; // Reduced from 20 to 16 for tighter spacing
  const labelFont = 'Helvetica-Bold';
  const valueFont = 'Helvetica';

  const drawField = (label: string, value: string, xPos: number, yPos: number) => {
    // Label - Purple Bold, 10px
    doc.fontSize(10)
      .font(labelFont)
      .fillColor('#4F1B78')
      .text(label, xPos, yPos);
    
    // Value - Dark Gray, 9px with word wrapping to prevent overlap
    // Draw value below the label (8px down instead of 12px)
    doc.fontSize(9)
      .font(valueFont)
      .fillColor('#404040');
    
    const textOptions = doc.text(value, xPos + 90, yPos + 8, {
      width: 180,
      ellipsis: false,
      lineGap: 0 // Reduced line gap for tighter spacing
    });
    
    const textHeight = textOptions.height || 14;
    // Calculate the total height needed for this field (label + value)
    const totalHeight = 8 + Math.max(lineHeight, textHeight + 2); // Reduced spacing
    
    // Return new Y position - ensure next field starts below this one
    return yPos + totalHeight;
  };

  let leftY = startY;
  let rightY = startY;

  // LEFT COLUMN - Personal Information + Additional Info
  leftY = drawField('Full Name:', registration.fullName, leftColumnX, leftY);
  leftY = drawField('Gender:', registration.gender, leftColumnX, leftY);
  leftY = drawField('Date of Birth:', formatDate(registration.dob), leftColumnX, leftY);
  leftY = drawField('Age:', calculateAge(String(registration.dob)).toString(), leftColumnX, leftY);
  leftY = drawField('Mobile Number:', registration.mobile, leftColumnX, leftY);
  leftY = drawField('Email:', registration.email, leftColumnX, leftY);
  leftY = drawField('City:', registration.city, leftColumnX, leftY);
  leftY = drawField('State:', registration.state, leftColumnX, leftY);
  leftY = drawField('Preferred City:', registration.preferredCity || 'N/A', leftColumnX, leftY);
  leftY = drawField('Previous Sports Experience:', registration.previousSportsExperience || 'N/A', leftColumnX, leftY);
  leftY = drawField('Reason to Join:', registration.reasonToJoin || 'N/A', leftColumnX, leftY);
  leftY = drawField('Will Attend Press Conference:', registration.willAttendPressConference ? 'Yes' : 'No', leftColumnX, leftY);
  leftY = drawField('Registration Date:', formatDate(registration.createdAt), leftColumnX, leftY);
  leftY = drawField('Status:', registration.status.replace(/_/g, ' '), leftColumnX, leftY);

  // RIGHT COLUMN - Social Media & Reach Info
  rightY = drawField('Content Category:', registration.contentCategory || 'N/A', rightColumnX, rightY);
  rightY = drawField('Primary Audience Location:', registration.primaryAudienceLocation || 'N/A', rightColumnX, rightY);
  rightY = drawField('Average Monthly Reach:', (registration.averageMonthlyReach || 0).toString(), rightColumnX, rightY);
  rightY = drawField('Average Engagement Rate:', `${registration.averageEngagementRate || 0}%`, rightColumnX, rightY);
  rightY = drawField('Instagram Username:', registration.instagramUsername || 'N/A', rightColumnX, rightY);
  rightY = drawField('Instagram Followers:', (registration.instagramFollowers || 0).toString(), rightColumnX, rightY);
  rightY = drawField('YouTube Channel:', registration.youtubeChannel || 'N/A', rightColumnX, rightY);
  rightY = drawField('YouTube Subscribers:', (registration.youtubeSubscribers || 0).toString(), rightColumnX, rightY);
  rightY = drawField('Facebook Username:', registration.facebookUsername || 'N/A', rightColumnX, rightY);
  rightY = drawField('Facebook Followers:', (registration.facebookFollowers || 0).toString(), rightColumnX, rightY);
  rightY = drawField('Twitter Username:', registration.twitterUsername || 'N/A', rightColumnX, rightY);
  rightY = drawField('Twitter Followers:', (registration.twitterFollowers || 0).toString(), rightColumnX, rightY);
  rightY = drawField('LinkedIn:', registration.linkedin || 'N/A', rightColumnX, rightY);

  // Generate PDF buffer
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(pdfBuffer);
    });
  });
};

export const exportPDFById = async (id: string) => {
  const PDFDocument = require('pdfkit');
  const fs = require('fs');
  const path = require('path');
  const bwipjs = require('bwip-js');
  
  const registration = await prisma.socialMediaPartnerRegistration.findUnique({
    where: { id }
  });

  if (!registration) {
    throw new AppError('Registration not found', 404);
  }

  const doc = new PDFDocument({
    size: 'A4',
    layout: 'portrait',
    margins: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  // Date formatting function
  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // BACKGROUND IMAGE - Full page (optional)
  try {
    const backgroundPath = path.join(__dirname, '../../public/certificate-background.png');
    console.log('Loading background image from:', backgroundPath);
    console.log('Image exists:', fs.existsSync(backgroundPath));
    
    if (fs.existsSync(backgroundPath)) {
      doc.image(backgroundPath, 0, 0, {
        width: 595.28,
        height: 841.89,
        fit: [595.28, 841.89]
      });
      console.log('Background image loaded successfully');
    } else {
      console.warn('Background image not found, using white background');
      // Use white background if image is missing
      doc.rect(0, 0, 595.28, 841.89).fill('#FFFFFF');
    }
  } catch (bgError) {
    console.error('Error loading background image:', bgError);
    // Fallback to white background
    doc.rect(0, 0, 595.28, 841.89).fill('#FFFFFF');
  }

  // REGISTRATION NUMBER (Top Right, smaller size, moved down)
  doc.fontSize(10)
    .fillColor('#4F1B78')
    .font('Helvetica-Bold')
    .text(registration.registrationNumber, 440, 110, { align: 'center' });

  // SIMPLE DETAILS LAYOUT - Split Left and Right
  const leftColumnX = 80;
  const rightColumnX = 350;
  const startY = 280; // Moved down significantly to reduce white space at top
  const lineHeight = 16; // Reduced from 20 to 16 for tighter spacing
  const labelFont = 'Helvetica-Bold';
  const valueFont = 'Helvetica';

  const drawField = (label: string, value: string, xPos: number, yPos: number) => {
    // Label - Purple Bold, 10px
    doc.fontSize(10)
      .font(labelFont)
      .fillColor('#4F1B78')
      .text(label, xPos, yPos);
    
    // Value - Dark Gray, 9px with word wrapping to prevent overlap
    // Draw value below the label (8px down instead of 12px)
    doc.fontSize(9)
      .font(valueFont)
      .fillColor('#404040');
    
    const textOptions = doc.text(value, xPos + 90, yPos + 8, {
      width: 180,
      ellipsis: false,
      lineGap: 0 // Reduced line gap for tighter spacing
    });
    
    const textHeight = textOptions.height || 14;
    // Calculate the total height needed for this field (label + value)
    const totalHeight = 8 + Math.max(lineHeight, textHeight + 2); // Reduced spacing
    
    // Return new Y position - ensure next field starts below this one
    return yPos + totalHeight;
  };

  let leftY = startY;
  let rightY = startY;

  // LEFT COLUMN - Personal Information + Additional Info
  leftY = drawField('Full Name:', registration.fullName, leftColumnX, leftY);
  leftY = drawField('Gender:', registration.gender, leftColumnX, leftY);
  leftY = drawField('Date of Birth:', formatDate(registration.dob), leftColumnX, leftY);
  leftY = drawField('Age:', calculateAge(String(registration.dob)).toString(), leftColumnX, leftY);
  leftY = drawField('Mobile Number:', registration.mobile, leftColumnX, leftY);
  leftY = drawField('Email:', registration.email, leftColumnX, leftY);
  leftY = drawField('City:', registration.city, leftColumnX, leftY);
  leftY = drawField('State:', registration.state, leftColumnX, leftY);
  leftY = drawField('Preferred City:', registration.preferredCity || 'N/A', leftColumnX, leftY);
  leftY = drawField('Previous Sports Experience:', registration.previousSportsExperience || 'N/A', leftColumnX, leftY);
  leftY = drawField('Reason to Join:', registration.reasonToJoin || 'N/A', leftColumnX, leftY);
  leftY = drawField('Will Attend Press Conference:', registration.willAttendPressConference ? 'Yes' : 'No', leftColumnX, leftY);
  leftY = drawField('Registration Date:', formatDate(registration.createdAt), leftColumnX, leftY);
  leftY = drawField('Status:', registration.status.replace(/_/g, ' '), leftColumnX, leftY);

  // RIGHT COLUMN - Social Media & Reach Info
  rightY = drawField('Content Category:', registration.contentCategory || 'N/A', rightColumnX, rightY);
  rightY = drawField('Primary Audience Location:', registration.primaryAudienceLocation || 'N/A', rightColumnX, rightY);
  rightY = drawField('Average Monthly Reach:', (registration.averageMonthlyReach || 0).toString(), rightColumnX, rightY);
  rightY = drawField('Average Engagement Rate:', `${registration.averageEngagementRate || 0}%`, rightColumnX, rightY);
  rightY = drawField('Instagram Username:', registration.instagramUsername || 'N/A', rightColumnX, rightY);
  rightY = drawField('Instagram Followers:', (registration.instagramFollowers || 0).toString(), rightColumnX, rightY);
  rightY = drawField('YouTube Channel:', registration.youtubeChannel || 'N/A', rightColumnX, rightY);
  rightY = drawField('YouTube Subscribers:', (registration.youtubeSubscribers || 0).toString(), rightColumnX, rightY);
  rightY = drawField('Facebook Username:', registration.facebookUsername || 'N/A', rightColumnX, rightY);
  rightY = drawField('Facebook Followers:', (registration.facebookFollowers || 0).toString(), rightColumnX, rightY);
  rightY = drawField('Twitter Username:', registration.twitterUsername || 'N/A', rightColumnX, rightY);
  rightY = drawField('Twitter Followers:', (registration.twitterFollowers || 0).toString(), rightColumnX, rightY);
  rightY = drawField('LinkedIn:', registration.linkedin || 'N/A', rightColumnX, rightY);

  // Generate PDF buffer
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(pdfBuffer);
    });
  });
};

import { prisma } from '../config';
import { AppError } from '../middleware/error';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { sendRegistrationConfirmationEmail, sendApprovalEmail, sendRejectionEmail } from './email.service';

// Generate unique registration number
const generateRegistrationNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await prisma.playerRegistration.count({
    where: {
      createdAt: {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      },
    },
  });
  const sequence = String(count + 1).padStart(6, '0');
  return `IWKL-${year}-${sequence}`;
};

// Save uploaded file
const saveFile = async (file: Express.Multer.File, folder: string): Promise<string> => {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  
  // Create directory if it doesn't exist
  await fs.mkdir(uploadDir, { recursive: true });
  
  // Generate unique filename
  const ext = path.extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;
  const filepath = path.join(uploadDir, filename);
  
  // Save file
  await fs.writeFile(filepath, file.buffer);
  
  return `/uploads/${folder}/${filename}`;
};

// Delete file
const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    await fs.unlink(fullPath);
  } catch (error) {
    // Ignore file not found errors
    console.error('Error deleting file:', error);
  }
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

export const registerPlayer = async (data: {
  userId?: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: string;
  bloodGroup?: string;
  aadhaar: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  district?: string;
  state: string;
  country?: string;
  pinCode: string;
  playingPosition: string;
  strongHand: string;
  strongLeg: string;
  height?: string;
  weight?: string;
  stateTeam?: boolean;
  nationalTeam?: boolean;
  university?: string;
  club?: string;
  experience?: number;
  coach?: string;
  currentAcademy?: string;
  playingSince?: string;
  achievements?: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyMobile: string;
  emergencyAddress?: string;
  files?: { [fieldname: string]: Express.Multer.File[] };
  photo?: string;
  aadhaarCard?: string;
  ageProof?: string;
  sportsCertificate?: string;
  medicalCertificate?: string;
  stateAssociationCertificate?: string;
  signature?: string;
}) => {
  console.log('=== SERVICE REGISTER PLAYER START ===');
  console.log('Input data keys:', Object.keys(data));
  console.log('Input data:', JSON.stringify(data, null, 2));
  
  // Normalize and trim inputs
  const normalizedMobile = data.mobile.replace(/\s+/g, '').replace(/^\+91/, '');
  const normalizedEmail = data.email.trim().toLowerCase();
  const normalizedAadhaar = data.aadhaar.replace(/\s+/g, '');
  
  console.log('=== NORMALIZED INPUTS ===');
  console.log('Mobile (normalized):', normalizedMobile);
  console.log('Email (normalized):', normalizedEmail);
  console.log('Aadhaar (normalized):', normalizedAadhaar);
  console.log('UserId:', data.userId);
  
  // Check if user already has a registration
  let existingUserRegistration = null;
  if (data.userId) {
    existingUserRegistration = await prisma.playerRegistration.findFirst({
      where: { userId: data.userId },
    });
    console.log('Existing user registration:', existingUserRegistration ? existingUserRegistration.registrationNumber : 'None');
  }
  
  // Check for duplicate registration by mobile, aadhaar, or email individually
  console.log('=== DUPLICATE CHECK START ===');
  
  // Check mobile (only allow if it's the same user's own registration)
  const existingByMobile = await prisma.playerRegistration.findFirst({
    where: {
      mobile: {
        equals: normalizedMobile,
        mode: 'insensitive',
      },
    },
  });
  console.log('Mobile check result:', existingByMobile ? `Found: ${existingByMobile.registrationNumber}` : 'Not found');
  console.log('Mobile userId:', existingByMobile?.userId);
  console.log('Input userId:', data.userId);
  
  if (existingByMobile) {
    // Only allow if it's the same user's own registration
    if (!data.userId || String(existingByMobile.userId) !== String(data.userId)) {
      console.log('=== DUPLICATE FOUND: MOBILE (DIFFERENT USER) ===');
      console.log('Existing registration:', existingByMobile.registrationNumber);
      console.log('Existing mobile:', existingByMobile.mobile);
      console.log('Existing userId:', existingByMobile.userId);
      console.log('Input userId:', data.userId);
      throw new AppError('Mobile number already registered by another user', 409);
    }
    console.log('Mobile belongs to same user, allowing update');
  }
  
  // Check Aadhaar (only allow if it's the same user's own registration)
  const existingByAadhaar = await prisma.playerRegistration.findFirst({
    where: {
      aadhaar: {
        equals: normalizedAadhaar,
        mode: 'insensitive',
      },
    },
  });
  console.log('Aadhaar check result:', existingByAadhaar ? `Found: ${existingByAadhaar.registrationNumber}` : 'Not found');
  console.log('Aadhaar userId:', existingByAadhaar?.userId);
  console.log('Input userId:', data.userId);
  
  if (existingByAadhaar) {
    // Only allow if it's the same user's own registration
    if (!data.userId || String(existingByAadhaar.userId) !== String(data.userId)) {
      console.log('=== DUPLICATE FOUND: AADHAAR (DIFFERENT USER) ===');
      console.log('Existing registration:', existingByAadhaar.registrationNumber);
      console.log('Existing Aadhaar:', existingByAadhaar.aadhaar);
      console.log('Existing userId:', existingByAadhaar.userId);
      console.log('Input userId:', data.userId);
      throw new AppError('Aadhaar number already registered by another user', 409);
    }
    console.log('Aadhaar belongs to same user, allowing update');
  }
  
  // Check email (only allow if it's the same user's own registration or if it's unclaimed)
  const existingByEmail = await prisma.playerRegistration.findFirst({
    where: {
      email: {
        equals: normalizedEmail,
        mode: 'insensitive',
      },
    },
  });
  console.log('Email check result:', existingByEmail ? `Found: ${existingByEmail.registrationNumber}` : 'Not found');
  console.log('Email userId:', existingByEmail?.userId);
  console.log('Email userId type:', typeof existingByEmail?.userId);
  console.log('Input userId:', data.userId);
  console.log('Input userId type:', typeof data.userId);
  
  if (existingByEmail) {
    // If email is registered without a userId, allow logged-in user to claim it
    if (!existingByEmail.userId && data.userId) {
      console.log('Email is unclaimed, allowing user to claim it');
      // Update the existing registration with the userId
      await prisma.playerRegistration.update({
        where: { id: existingByEmail.id },
        data: { userId: data.userId },
      });
      console.log('Updated registration with userId:', data.userId);
      existingUserRegistration = existingByEmail;
    }
    // Only allow if it's the same user's own registration
    else if (!data.userId || String(existingByEmail.userId) !== String(data.userId)) {
      console.log('=== DUPLICATE FOUND: EMAIL (DIFFERENT USER) ===');
      console.log('Existing registration:', existingByEmail.registrationNumber);
      console.log('Existing email:', existingByEmail.email);
      console.log('Existing userId:', existingByEmail.userId);
      console.log('Existing userId type:', typeof existingByEmail.userId);
      console.log('Input userId:', data.userId);
      console.log('Input userId type:', typeof data.userId);
      console.log('Comparison result:', String(existingByEmail.userId) === String(data.userId));
      throw new AppError('Email already registered by another user', 409);
    } else {
      console.log('Email belongs to same user, allowing update');
    }
  }
  
  console.log('=== DUPLICATE CHECK END: NO DUPLICATES FOUND ===');
  
  // If user already has a registration, update it instead of creating new
  if (existingUserRegistration) {
    console.log('=== UPDATING EXISTING REGISTRATION ===');
    console.log('Existing registration ID:', existingUserRegistration.id);
    
    // Handle file uploads for update
    let photoPath = existingUserRegistration.photoPath;
    let aadhaarPath = existingUserRegistration.aadhaarPath;
    let ageProofPath = existingUserRegistration.ageProofPath;
    let sportsCertificatePath = existingUserRegistration.sportsCertificatePath;
    let medicalCertificatePath = existingUserRegistration.medicalCertificatePath;
    let stateAssociationCertificatePath = existingUserRegistration.stateAssociationCertificatePath;
    let additionalCertificatePath = existingUserRegistration.additionalCertificatePath;
    let videoHighlightsPath = existingUserRegistration.videoHighlightsPath;
    let signaturePath = existingUserRegistration.signaturePath;
    
    if (data.files) {
      console.log('Files received for update:', Object.keys(data.files));
      try {
        if (data.files.photo) {
          photoPath = await saveFile(data.files.photo[0], 'player-registration/photos');
          console.log('Photo updated:', photoPath);
        }
        if (data.files.aadhaar) {
          aadhaarPath = await saveFile(data.files.aadhaar[0], 'player-registration/documents');
          console.log('Aadhaar updated:', aadhaarPath);
        }
        if (data.files.ageProof) {
          ageProofPath = await saveFile(data.files.ageProof[0], 'player-registration/documents');
          console.log('Age proof updated:', ageProofPath);
        }
        if (data.files.sportsCertificate) {
          sportsCertificatePath = await saveFile(data.files.sportsCertificate[0], 'player-registration/documents');
          console.log('Sports certificate updated:', sportsCertificatePath);
        }
        if (data.files.medicalCertificate) {
          medicalCertificatePath = await saveFile(data.files.medicalCertificate[0], 'player-registration/documents');
          console.log('Medical certificate updated:', medicalCertificatePath);
        }
        if (data.files.stateAssociationCertificate) {
          stateAssociationCertificatePath = await saveFile(data.files.stateAssociationCertificate[0], 'player-registration/documents');
          console.log('State association certificate updated:', stateAssociationCertificatePath);
        }
        if (data.files.additionalCertificate) {
          additionalCertificatePath = await saveFile(data.files.additionalCertificate[0], 'player-registration/documents');
          console.log('Additional certificate updated:', additionalCertificatePath);
        }
        if (data.files.videoHighlights) {
          videoHighlightsPath = await saveFile(data.files.videoHighlights[0], 'player-registration/videos');
          console.log('Video highlights updated:', videoHighlightsPath);
        }
        if (data.files.signature) {
          signaturePath = await saveFile(data.files.signature[0], 'player-registration/signatures');
          console.log('Signature updated:', signaturePath);
        }
      } catch (fileError) {
        console.error('Error saving files:', fileError);
        throw new AppError('Failed to save uploaded files', 500);
      }
    }
    
    // Update existing registration
    const updatedRegistration = await prisma.playerRegistration.update({
      where: { id: existingUserRegistration.id },
      data: {
        fullName: data.fullName,
        fatherName: data.fatherName,
        motherName: data.motherName,
        dob: new Date(data.dob),
        age: calculateAge(data.dob),
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        aadhaar: normalizedAadhaar,
        mobile: normalizedMobile,
        whatsapp: data.whatsapp,
        email: normalizedEmail,
        address: data.address,
        city: data.city,
        district: data.district,
        state: data.state,
        country: data.country,
        pinCode: data.pinCode,
        playingPosition: data.playingPosition,
        strongHand: data.strongHand,
        strongLeg: data.strongLeg,
        height: data.height,
        weight: data.weight,
        stateTeam: data.stateTeam === true || (typeof data.stateTeam === 'string' && data.stateTeam === 'true'),
        nationalTeam: data.nationalTeam === true || (typeof data.nationalTeam === 'string' && data.nationalTeam === 'true'),
        university: data.university,
        club: data.club,
        experience: typeof data.experience === 'string' ? parseInt(data.experience, 10) : (data.experience || 0),
        coach: data.coach,
        currentAcademy: data.currentAcademy,
        playingSince: data.playingSince ? new Date(data.playingSince) : undefined,
        achievements: data.achievements,
        emergencyName: data.emergencyName,
        emergencyRelation: data.emergencyRelation,
        emergencyMobile: data.emergencyMobile,
        emergencyAddress: data.emergencyAddress,
        photoPath,
        aadhaarPath,
        ageProofPath,
        sportsCertificatePath,
        medicalCertificatePath,
        stateAssociationCertificatePath,
        additionalCertificatePath,
        videoHighlightsPath,
        signaturePath,
        status: 'PENDING', // Reset to pending when updated
      },
    });
    
    console.log('Registration updated successfully:', updatedRegistration.registrationNumber);
    console.log('=== SERVICE REGISTER PLAYER END ===');
    return updatedRegistration;
  }

  // Calculate age
  const age = calculateAge(data.dob);
  console.log('Calculated age:', age);

  // Validate age (should be between 10 and 40 for kabaddi players)
  if (age < 10 || age > 40) {
    throw new AppError('Age must be between 10 and 40 years', 400);
  }

  // Generate registration number
  console.log('Generating registration number...');
  const registrationNumber = await generateRegistrationNumber();
  console.log('Registration number:', registrationNumber);

  // Handle file uploads
  console.log('Handling file uploads...');
  let photoPath: string | undefined;
  let aadhaarPath: string | undefined;
  let ageProofPath: string | undefined;
  let sportsCertificatePath: string | undefined;
  let medicalCertificatePath: string | undefined;
  let stateAssociationCertificatePath: string | undefined;
  let additionalCertificatePath: string | undefined;
  let videoHighlightsPath: string | undefined;
  let signaturePath: string | undefined;

  // Use Firebase URLs if provided, otherwise handle file uploads
  if (data.photo) {
    photoPath = data.photo;
    console.log('Photo URL from Firebase:', photoPath);
  }
  if (data.aadhaarCard) {
    aadhaarPath = data.aadhaarCard;
    console.log('Aadhaar URL from Firebase:', aadhaarPath);
  }
  if (data.ageProof) {
    ageProofPath = data.ageProof;
    console.log('Age proof URL from Firebase:', ageProofPath);
  }
  if (data.sportsCertificate) {
    sportsCertificatePath = data.sportsCertificate;
    console.log('Sports certificate URL from Firebase:', sportsCertificatePath);
  }
  if (data.medicalCertificate) {
    medicalCertificatePath = data.medicalCertificate;
    console.log('Medical certificate URL from Firebase:', medicalCertificatePath);
  }
  if (data.stateAssociationCertificate) {
    stateAssociationCertificatePath = data.stateAssociationCertificate;
    console.log('State association certificate URL from Firebase:', stateAssociationCertificatePath);
  }
  if (data.signature) {
    signaturePath = data.signature;
    console.log('Signature URL from Firebase:', signaturePath);
  }

  if (data.files) {
    console.log('Files received:', Object.keys(data.files));
    try {
      if (data.files.photo && !photoPath) {
        photoPath = await saveFile(data.files.photo[0], 'player-registration/photos');
        console.log('Photo saved:', photoPath);
      }
      if (data.files.aadhaar && !aadhaarPath) {
        aadhaarPath = await saveFile(data.files.aadhaar[0], 'player-registration/documents');
        console.log('Aadhaar saved:', aadhaarPath);
      }
      if (data.files.ageProof && !ageProofPath) {
        ageProofPath = await saveFile(data.files.ageProof[0], 'player-registration/documents');
        console.log('Age proof saved:', ageProofPath);
      }
      if (data.files.sportsCertificate && !sportsCertificatePath) {
        sportsCertificatePath = await saveFile(data.files.sportsCertificate[0], 'player-registration/documents');
        console.log('Sports certificate saved:', sportsCertificatePath);
      }
      if (data.files.medicalCertificate && !medicalCertificatePath) {
        medicalCertificatePath = await saveFile(data.files.medicalCertificate[0], 'player-registration/documents');
        console.log('Medical certificate saved:', medicalCertificatePath);
      }
      if (data.files.stateAssociationCertificate && !stateAssociationCertificatePath) {
        stateAssociationCertificatePath = await saveFile(data.files.stateAssociationCertificate[0], 'player-registration/documents');
        console.log('State association certificate saved:', stateAssociationCertificatePath);
      }
      if (data.files.additionalCertificate) {
        additionalCertificatePath = await saveFile(data.files.additionalCertificate[0], 'player-registration/documents');
        console.log('Additional certificate saved:', additionalCertificatePath);
      }
      if (data.files.videoHighlights) {
        videoHighlightsPath = await saveFile(data.files.videoHighlights[0], 'player-registration/videos');
        console.log('Video highlights saved:', videoHighlightsPath);
      }
      if (data.files.signature) {
        signaturePath = await saveFile(data.files.signature[0], 'player-registration/signatures');
        console.log('Signature saved:', signaturePath);
      }
    } catch (fileError) {
      console.error('Error saving files:', fileError);
      throw new AppError('Failed to save uploaded files', 500);
    }
  } else {
    console.log('No files received');
  }

  // Prepare data for Prisma (use normalized values)
  const prismaData = {
    registrationNumber,
    userId: data.userId,
    fullName: data.fullName,
    fatherName: data.fatherName,
    motherName: data.motherName,
    dob: new Date(data.dob),
    age,
    gender: data.gender,
    bloodGroup: data.bloodGroup,
    aadhaar: normalizedAadhaar,
    mobile: normalizedMobile,
    whatsapp: data.whatsapp,
    email: normalizedEmail,
    address: data.address,
    city: data.city,
    district: data.district,
    state: data.state,
    country: data.country,
    pinCode: data.pinCode,
    playingPosition: data.playingPosition,
    strongHand: data.strongHand,
    strongLeg: data.strongLeg,
    height: data.height,
    weight: data.weight,
    stateTeam: data.stateTeam === true || (typeof data.stateTeam === 'string' && data.stateTeam === 'true'),
    nationalTeam: data.nationalTeam === true || (typeof data.nationalTeam === 'string' && data.nationalTeam === 'true'),
    university: data.university,
    club: data.club,
    experience: typeof data.experience === 'string' ? parseInt(data.experience, 10) : (data.experience || 0),
    coach: data.coach,
    currentAcademy: data.currentAcademy,
    playingSince: data.playingSince ? new Date(data.playingSince) : undefined,
    achievements: data.achievements,
    emergencyName: data.emergencyName,
    emergencyRelation: data.emergencyRelation,
    emergencyMobile: data.emergencyMobile,
    emergencyAddress: data.emergencyAddress,
    photoPath,
    aadhaarPath,
    ageProofPath,
    sportsCertificatePath,
    medicalCertificatePath,
    stateAssociationCertificatePath,
    additionalCertificatePath,
    videoHighlightsPath,
    signaturePath,
    status: 'PENDING' as const,
  };
  
  console.log('Prisma data prepared:', JSON.stringify(prismaData, null, 2));

  // Create registration
  console.log('Creating registration in database...');
  const registration = await prisma.playerRegistration.create({
    data: prismaData,
  });
  console.log('Registration created successfully:', registration.registrationNumber);

  // Create initial status history entry
  await prisma.registrationStatusHistory.create({
    data: {
      registrationId: registration.id,
      status: 'PENDING',
      remarks: 'Registration submitted successfully',
    },
  });

  // Send registration confirmation email (non-blocking)
  console.log('Sending confirmation email...');
  try {
    await sendRegistrationConfirmationEmail(data.email, data.fullName, registrationNumber);
    console.log('Email sent successfully');
  } catch (emailError) {
    console.error('Email sending failed (non-blocking):', emailError);
    // Do not throw error - registration is already saved
  }

  console.log('=== SERVICE REGISTER PLAYER END ===');
  return registration;
};

export const getAllRegistrations = async (params: {
  search?: string;
  state?: string;
  position?: string;
  status?: string;
  page: number;
  limit: number;
}) => {
  const { search, state, position, status, page, limit } = params;

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

  if (position) {
    where.playingPosition = position;
  }

  if (status) {
    where.status = status;
  }

  const [registrations, total] = await Promise.all([
    prisma.playerRegistration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.playerRegistration.count({ where }),
  ]);

  return {
    registrations,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getRegistrationById = async (id: string) => {
  const registration = await prisma.playerRegistration.findUnique({
    where: { id },
  });

  if (!registration) {
    throw new AppError('Registration not found', 404);
  }

  return registration;
};

export const getRegistrationByUserId = async (userId: string) => {
  const registration = await prisma.playerRegistration.findFirst({
    where: { userId },
  });

  if (!registration) {
    throw new AppError('Registration not found', 404);
  }

  return registration;
};

export const getRegistrationStatusHistory = async (registrationId: string) => {
  const history = await prisma.registrationStatusHistory.findMany({
    where: { registrationId },
    orderBy: { changedAt: 'asc' },
  });

  return history;
};

export const updateRegistration = async (id: string, data: any, requestingUserId?: string) => {
  const existing = await prisma.playerRegistration.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError('Registration not found', 404);
  }

  // Security check: Only allow updates if:
  // 1. User is the owner AND status is INFO_REQUESTED (admin requested more info)
  // 2. Or if no userId is provided (admin update)
  if (requestingUserId && existing.userId) {
    if (String(existing.userId) !== String(requestingUserId)) {
      throw new AppError('You do not have permission to update this registration', 403);
    }
    if (existing.status !== 'INFO_REQUESTED' && existing.status !== 'PENDING') {
      throw new AppError('Registration can only be updated when status is PENDING or INFO_REQUESTED', 403);
    }
  }

  // Handle file updates
  let updateData: any = { ...data };

  if (data.files) {
    if (data.files.photo) {
      if (existing.photoPath) {
        await deleteFile(existing.photoPath);
      }
      updateData.photoPath = await saveFile(data.files.photo[0], 'player-registration/photos');
    }
    if (data.files.aadhaar) {
      if (existing.aadhaarPath) {
        await deleteFile(existing.aadhaarPath);
      }
      updateData.aadhaarPath = await saveFile(data.files.aadhaar[0], 'player-registration/documents');
    }
    if (data.files.ageProof) {
      if (existing.ageProofPath) {
        await deleteFile(existing.ageProofPath);
      }
      updateData.ageProofPath = await saveFile(data.files.ageProof[0], 'player-registration/documents');
    }
    if (data.files.sportsCertificate) {
      if (existing.sportsCertificatePath) {
        await deleteFile(existing.sportsCertificatePath);
      }
      updateData.sportsCertificatePath = await saveFile(data.files.sportsCertificate[0], 'player-registration/documents');
    }
    if (data.files.medicalCertificate) {
      if (existing.medicalCertificatePath) {
        await deleteFile(existing.medicalCertificatePath);
      }
      updateData.medicalCertificatePath = await saveFile(data.files.medicalCertificate[0], 'player-registration/documents');
    }
    if (data.files.stateAssociationCertificate) {
      if (existing.stateAssociationCertificatePath) {
        await deleteFile(existing.stateAssociationCertificatePath);
      }
      updateData.stateAssociationCertificatePath = await saveFile(data.files.stateAssociationCertificate[0], 'player-registration/documents');
    }
    if (data.files.additionalCertificate) {
      if (existing.additionalCertificatePath) {
        await deleteFile(existing.additionalCertificatePath);
      }
      updateData.additionalCertificatePath = await saveFile(data.files.additionalCertificate[0], 'player-registration/documents');
    }
    if (data.files.videoHighlights) {
      if (existing.videoHighlightsPath) {
        await deleteFile(existing.videoHighlightsPath);
      }
      updateData.videoHighlightsPath = await saveFile(data.files.videoHighlights[0], 'player-registration/videos');
    }
    if (data.files.signature) {
      if (existing.signaturePath) {
        await deleteFile(existing.signaturePath);
      }
      updateData.signaturePath = await saveFile(data.files.signature[0], 'player-registration/signatures');
    }
  }

  // Remove files from updateData
  delete updateData.files;
  delete updateData.userId;

  // Recalculate age if DOB changed
  if (data.dob) {
    updateData.age = calculateAge(data.dob);
    updateData.dob = new Date(data.dob);
  }

  const registration = await prisma.playerRegistration.update({
    where: { id },
    data: updateData,
  });

  return registration;
};

export const updateStatus = async (id: string, status: string, adminRemarks?: string, notifyPlayer: boolean = true, trialDate?: string, trialVenue?: string, trialTime?: string, changedBy?: string, changedByName?: string) => {
  const existing = await prisma.playerRegistration.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError('Registration not found', 404);
  }

  const updateData: any = {
    status: status as any,
    adminRemarks,
  };

  if (trialDate) updateData.trialDate = new Date(trialDate);
  if (trialVenue) updateData.trialVenue = trialVenue;
  if (trialTime) updateData.trialReportingTime = trialTime;

  const registration = await prisma.playerRegistration.update({
    where: { id },
    data: updateData,
  });

  // Create status history entry
  await prisma.registrationStatusHistory.create({
    data: {
      registrationId: id,
      status: status as any,
      changedBy: changedBy || null,
      changedByName: changedByName || null,
      remarks: adminRemarks || null,
    },
  });

  // Send email notification if requested and status changed
  if (notifyPlayer && existing.status !== status) {
    if (status === 'APPROVED') {
      await sendApprovalEmail(
        existing.email,
        existing.fullName,
        existing.registrationNumber,
        trialDate || (existing.trialDate ? existing.trialDate.toISOString().split('T')[0] : undefined),
        trialVenue || existing.trialVenue,
        trialTime || existing.trialReportingTime
      );
    } else if (status === 'REJECTED') {
      await sendRejectionEmail(
        existing.email,
        existing.fullName,
        existing.registrationNumber,
        adminRemarks
      );
    }
  }

  return registration;
};

export const deleteRegistration = async (id: string) => {
  const existing = await prisma.playerRegistration.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError('Registration not found', 404);
  }

  // Delete all associated files
  if (existing.photoPath) {
    await deleteFile(existing.photoPath);
  }
  if (existing.aadhaarPath) {
    await deleteFile(existing.aadhaarPath);
  }
  if (existing.ageProofPath) {
    await deleteFile(existing.ageProofPath);
  }
  if (existing.sportsCertificatePath) {
    await deleteFile(existing.sportsCertificatePath);
  }
  if (existing.medicalCertificatePath) {
    await deleteFile(existing.medicalCertificatePath);
  }
  if (existing.stateAssociationCertificatePath) {
    await deleteFile(existing.stateAssociationCertificatePath);
  }
  if (existing.additionalCertificatePath) {
    await deleteFile(existing.additionalCertificatePath);
  }
  if (existing.videoHighlightsPath) {
    await deleteFile(existing.videoHighlightsPath);
  }
  if (existing.signaturePath) {
    await deleteFile(existing.signaturePath);
  }

  await prisma.playerRegistration.delete({
    where: { id },
  });
};

export const exportExcel = async () => {
  const registrations = await prisma.playerRegistration.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Simple CSV export for now (can be enhanced with proper Excel library)
  const headers = [
    'Registration No',
    'Full Name',
    'Father Name',
    'Mobile',
    'WhatsApp',
    'Email',
    'State',
    'City',
    'Playing Position',
    'Status',
    'Registration Date',
  ];

  const rows = registrations.map((r) => [
    r.registrationNumber,
    r.fullName,
    r.fatherName,
    r.mobile,
    r.whatsapp,
    r.email,
    r.state,
    r.city,
    r.playingPosition,
    r.status,
    r.createdAt.toISOString(),
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  return csv;
};

export const exportPDF = async () => {
  // For now, return CSV (can be enhanced with PDF library like pdfkit)
  return await exportExcel();
};

import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as fanClubService from '../services/fan-club.service';

export const registerFanClub = async (req: AuthRequest, res: Response, next: any) => {
  try {
    // Handle both field names (mobileNumber from admin, mobile from Flutter)
    const { fullName, mobileNumber, mobile, email, city, state, gender, age, favoriteTeamId, supportedTeam, supportedTeamId } = req.body;
    const documentFile = req.file as Express.Multer.File;

    // Map Flutter field names to backend field names
    const mobileFinal = mobile || mobileNumber;
    const favoriteTeamIdFinal = supportedTeamId || favoriteTeamId;

    let documentSignature: string | undefined;
    if (documentFile) {
      const { uploadToS3, generateS3Key } = await import('../utils');
      const key = generateS3Key('fan-club-documents', documentFile.originalname);
      documentSignature = await uploadToS3(documentFile.buffer, key, documentFile.mimetype);
    }

    const registration = await fanClubService.registerFanClub({
      fullName,
      mobileNumber: mobileFinal,
      email: email || undefined,
      city,
      state,
      gender: gender || 'Other',
      age: age ? parseInt(age) : 18,
      favoriteTeamId: favoriteTeamIdFinal,
      documentSignature,
    });
    res.status(201).json(registration);
  } catch (error) {
    next(error);
  }
};

export const getAllRegistrations = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { search } = req.query;
    const registrations = await fanClubService.getAllRegistrations(search as string);
    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

export const getRegistrationById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { id } = req.params;
    const registration = await fanClubService.getRegistrationById(id);
    res.json(registration);
  } catch (error) {
    next(error);
  }
};

export const exportRegistrations = async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const csv = await fanClubService.exportRegistrations();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=fan-club-registrations.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

export const deleteRegistration = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { id } = req.params;
    await fanClubService.deleteRegistration(id);
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    next(error);
  }
};

import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as playerRegistrationService from '../services/player-registration.service';
import { uploadBase64 } from '../lib/firebase-storage';

export const uploadFile = async (req: AuthRequest, res: Response, next: any) => {
  try {
    console.log('[UPLOAD] Request received')
    console.log('[UPLOAD] req.file:', req.file ? 'File present' : 'No file')
    console.log('[UPLOAD] req.body:', req.body)
    
    if (!req.file) {
      console.log('[UPLOAD] No file uploaded')
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { path } = req.body;
    if (!path) {
      console.log('[UPLOAD] No path provided')
      return res.status(400).json({ error: 'Storage path is required' });
    }

    console.log('[UPLOAD] File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: path
    })

    // Convert file to base64
    const base64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const dataUrl = `data:${mimeType};base64,${base64}`;

    console.log('[UPLOAD] Attempting Firebase upload...')

    // Upload to Firebase Storage
    const url = await uploadBase64(dataUrl, path);

    console.log('[UPLOAD] Upload successful:', url)

    res.json({ success: true, url });
  } catch (error) {
    console.error('[UPLOAD] File upload error:', error);
    console.error('[UPLOAD] Error details:', JSON.stringify(error, null, 2))
    res.status(500).json({ error: 'Failed to upload file', details: (error as Error).message });
  }
};

export const register = async (req: AuthRequest, res: Response, next: any) => {
  try {
    console.log('=== REGISTER CONTROLLER START ===');
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    // Use userId from req.body if available (for logged-in users), otherwise from req.user
    const userId = req.body.userId || req.user?.id;
    
    console.log('req.user:', req.user);
    console.log('userId:', userId);
    console.log('req.body keys:', Object.keys(req.body));
    console.log('req.body:', req.body);
    console.log('req.files:', files);
    
    // Handle playingPosition array from frontend
    const data = { ...req.body };
    if (data.playingPosition && Array.isArray(data.playingPosition)) {
      data.playingPosition = data.playingPosition.join(',');
    }
    
    console.log('Data to send to service:', data);
    
    const registration = await playerRegistrationService.registerPlayer({
      ...data,
      userId,
      files,
    });
    
    console.log('Registration successful:', registration);
    
    res.status(201).json({
      success: true,
      registrationNumber: registration.registrationNumber,
      trackingId: registration.id,
      data: registration
    });
  } catch (error) {
    console.error('=== REGISTER CONTROLLER ERROR ===');
    console.error('Error:', error);
    console.error('Error stack:', (error as Error).stack);
    console.error('Error JSON:', JSON.stringify(error, null, 2));
    console.error('==================================');
    next(error);
  }
};

export const getAllRegistrations = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { search, state, position, status, page = 1, limit = 10 } = req.query;
    const registrations = await playerRegistrationService.getAllRegistrations({
      search: search as string,
      state: state as string,
      position: position as string,
      status: status as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

export const getRegistrationById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { id } = req.params;
    const registration = await playerRegistrationService.getRegistrationById(id);
    res.json(registration);
  } catch (error) {
    next(error);
  }
};

export const getRegistrationByUserId = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { userId } = req.params;
    console.log('=== GET REGISTRATION BY USER ID ===');
    console.log('Requested userId:', userId);
    console.log('Auth user:', req.user?.id);
    
    const registration = await playerRegistrationService.getRegistrationByUserId(userId);
    console.log('Registration found:', registration ? registration.registrationNumber : 'None');
    
    res.json(registration);
  } catch (error) {
    console.error('Error getting registration by userId:', error);
    next(error);
  }
};

export const getRegistrationStatusHistory = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { id } = req.params;
    const history = await playerRegistrationService.getRegistrationStatusHistory(id);
    res.json(history);
  } catch (error) {
    next(error);
  }
};

export const updateRegistration = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { id } = req.params;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const requestingUserId = req.user?.id;
    
    const registration = await playerRegistrationService.updateRegistration(id, {
      ...req.body,
      files,
    }, requestingUserId);
    
    res.json(registration);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks, notifyPlayer, trialDate, trialVenue, trialTime } = req.body;
    const changedBy = req.user?.id;
    const changedByName = req.user?.mobile;
    
    const registration = await playerRegistrationService.updateStatus(
      id, 
      status, 
      adminRemarks, 
      notifyPlayer, 
      trialDate, 
      trialVenue, 
      trialTime,
      changedBy,
      changedByName
    );
    res.json(registration);
  } catch (error) {
    next(error);
  }
};

export const deleteRegistration = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { id } = req.params;
    await playerRegistrationService.deleteRegistration(id);
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const exportExcel = async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const excel = await playerRegistrationService.exportExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=player-registrations.xlsx');
    res.send(excel);
  } catch (error) {
    next(error);
  }
};

export const exportPDF = async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const pdf = await playerRegistrationService.exportPDF();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=player-registrations.pdf');
    res.send(pdf);
  } catch (error) {
    next(error);
  }
};

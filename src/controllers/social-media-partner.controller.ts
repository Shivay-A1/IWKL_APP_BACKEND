import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as socialMediaPartnerService from '../services/social-media-partner.service';
import { serializeSocialMediaPartnerBigInt } from '../utils/serializeBigInt';
import { socialMediaPartnerLogger } from '../utils/logger';
import { prisma } from '../config';

export const register = async (req: AuthRequest, res: Response, next: any) => {
  try {
    socialMediaPartnerLogger.info('=== SOCIAL MEDIA PARTNER REGISTER CONTROLLER START ===');
    const userId = req.body.userId || req.user?.id;
    
    socialMediaPartnerLogger.debug('Request details', {
      user: req.user,
      userId,
      bodyKeys: Object.keys(req.body),
      body: req.body
    });
    
    const registration = await socialMediaPartnerService.registerSocialMediaPartner({
      ...req.body,
      userId,
    });
    
    socialMediaPartnerLogger.info('Registration successful', { registrationNumber: registration.registrationNumber });
    
    // Convert BigInt values to strings for JSON serialization
    const serializedRegistration = serializeSocialMediaPartnerBigInt(registration);
    
    res.status(201).json({
      success: true,
      registrationNumber: registration.registrationNumber,
      trackingId: registration.id,
      data: serializedRegistration
    });
  } catch (error) {
    socialMediaPartnerLogger.error('=== SOCIAL MEDIA PARTNER REGISTER CONTROLLER ERROR ===', error);
    next(error);
  }
};

export const getAllRegistrations = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { search, state, status, page = 1, limit = 10 } = req.query;
    const registrations = await socialMediaPartnerService.getAllRegistrations({
      search: search as string,
      state: state as string,
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
    const registration = await socialMediaPartnerService.getRegistrationById(id);
    res.json(registration);
  } catch (error) {
    next(error);
  }
};

export const getRegistrationByUserId = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { userId } = req.params;
    console.log('=== GET SOCIAL MEDIA PARTNER REGISTRATION BY USER ID ===');
    console.log('Requested userId:', userId);
    console.log('Auth user:', req.user?.id);
    
    const registration = await socialMediaPartnerService.getRegistrationByUserId(userId);
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
    const history = await socialMediaPartnerService.getRegistrationStatusHistory(id);
    res.json(history);
  } catch (error) {
    next(error);
  }
};

export const updateRegistration = async (req: AuthRequest, res: Response, next: any) => {
  try {
    socialMediaPartnerLogger.info('=== UPDATE REGISTRATION CONTROLLER START ===');
    const { id } = req.params;
    const requestingUserId = req.user?.id;
    const isAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'LEAGUE_ADMIN';
    
    socialMediaPartnerLogger.debug('Request details', { id, requestingUserId, isAdmin });
    
    const registration = await socialMediaPartnerService.updateRegistration(id, {
      ...req.body,
    }, requestingUserId, isAdmin);
    
    socialMediaPartnerLogger.info('Registration updated successfully');
    res.json(registration);
  } catch (error) {
    socialMediaPartnerLogger.error('=== UPDATE REGISTRATION CONTROLLER ERROR ===', error);
    next(error);
  }
};

export const updateStatus = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks, notifyPartner, interviewDate, interviewVenue, interviewTime } = req.body;
    const changedBy = req.user?.id;
    const changedByName = req.user?.mobile;
    
    const registration = await socialMediaPartnerService.updateStatus(
      id, 
      status, 
      adminRemarks, 
      notifyPartner, 
      interviewDate, 
      interviewVenue, 
      interviewTime,
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
    await socialMediaPartnerService.deleteRegistration(id);
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const exportExcel = async (_req: AuthRequest, res: Response, next: any) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    
    if (_req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    const excel = await socialMediaPartnerService.exportExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=social-media-partner-registrations.xlsx');
    res.send(excel);
  } catch (error) {
    next(error);
  }
};

export const exportPDF = async (_req: AuthRequest, res: Response, next: any) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    
    if (_req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    const pdf = await socialMediaPartnerService.exportPDF();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=social-media-partner-registrations.pdf');
    res.send(pdf);
  } catch (error) {
    next(error);
  }
};

export const exportPDFById = async (req: any, res: Response, next: any) => {
  try {
    const { id } = req.params;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    const pdf = await socialMediaPartnerService.exportPDFById(id);
    const registration = await prisma.socialMediaPartnerRegistration.findUnique({
      where: { id }
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=IWKL-SMP-Registration-${registration?.registrationNumber || id}.pdf`);
    res.send(pdf);
  } catch (error: any) {
    console.error('PDF generation error:', error);
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
};

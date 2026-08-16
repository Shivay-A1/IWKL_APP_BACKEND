import { Response } from 'express';
import { AuthRequest, FileRequest } from '../types/express';
import * as sponsorService from '../services/sponsor.service';

export const createSponsor = async (req: FileRequest, res: Response, next: any) => {
  try {
    const sponsor = await sponsorService.createSponsor(req.body, req.file);
    res.status(201).json(sponsor);
  } catch (error) {
    next(error);
  }
};

export const getSponsors = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const sponsors = await sponsorService.getSponsors(req.query);
    res.json(sponsors);
  } catch (error) {
    next(error);
  }
};

export const getSponsorById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const sponsor = await sponsorService.getSponsorById(req.params.id);
    res.json(sponsor);
  } catch (error) {
    next(error);
  }
};

export const updateSponsor = async (req: FileRequest, res: Response, next: any) => {
  try {
    const sponsor = await sponsorService.updateSponsor(req.params.id, req.body, req.file);
    res.json(sponsor);
  } catch (error) {
    next(error);
  }
};

export const deleteSponsor = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await sponsorService.deleteSponsor(req.params.id);
    res.json({ message: 'Sponsor deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getSponsorsByCategory = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const sponsors = await sponsorService.getSponsorsByCategory(req.params.category);
    res.json(sponsors);
  } catch (error) {
    next(error);
  }
};

export const getActiveSponsors = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const sponsors = await sponsorService.getActiveSponsors();
    res.json(sponsors);
  } catch (error) {
    next(error);
  }
};

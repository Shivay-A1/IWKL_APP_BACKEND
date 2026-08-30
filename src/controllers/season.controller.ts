import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as seasonService from '../services/season.service';

export const createSampleSeason = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const season = await seasonService.createSampleSeason();
    res.status(201).json(season);
  } catch (error) {
    next(error);
  }
};

export const createSeason = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const season = await seasonService.createSeason(req.body);
    res.status(201).json(season);
  } catch (error) {
    next(error);
  }
};

export const getSeasons = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const seasons = await seasonService.getSeasons(req.query);
    res.json(seasons);
  } catch (error) {
    next(error);
  }
};

export const getSeasonById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const season = await seasonService.getSeasonById(req.params.id);
    res.json(season);
  } catch (error) {
    next(error);
  }
};

export const updateSeason = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const season = await seasonService.updateSeason(req.params.id, req.body);
    res.json(season);
  } catch (error) {
    next(error);
  }
};

export const deleteSeason = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await seasonService.deleteSeason(req.params.id);
    res.json({ message: 'Season deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const setActiveSeason = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const season = await seasonService.setActiveSeason(req.params.id);
    res.json(season);
  } catch (error) {
    next(error);
  }
};

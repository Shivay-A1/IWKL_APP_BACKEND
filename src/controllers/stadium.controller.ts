import { Response } from 'express';
import { AuthRequest, FileRequest } from '../types/express';
import * as stadiumService from '../services/stadium.service';

export const createStadium = async (req: FileRequest, res: Response, next: any) => {
  try {
    const stadium = await stadiumService.createStadium(req.body, req.file);
    res.status(201).json(stadium);
  } catch (error) {
    next(error);
  }
};

export const getStadiums = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const stadiums = await stadiumService.getStadiums(req.query);
    res.json(stadiums);
  } catch (error) {
    next(error);
  }
};

export const getStadiumById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const stadium = await stadiumService.getStadiumById(req.params.id);
    res.json(stadium);
  } catch (error) {
    next(error);
  }
};

export const updateStadium = async (req: FileRequest, res: Response, next: any) => {
  try {
    const stadium = await stadiumService.updateStadium(req.params.id, req.body, req.file);
    res.json(stadium);
  } catch (error) {
    next(error);
  }
};

export const deleteStadium = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await stadiumService.deleteStadium(req.params.id);
    res.json({ message: 'Stadium deleted successfully' });
  } catch (error) {
    next(error);
  }
};

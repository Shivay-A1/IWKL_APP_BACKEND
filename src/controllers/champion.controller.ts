import { Response } from 'express';
import { AuthRequest, FileRequest } from '../types/express';
import * as championService from '../services/champion.service';

export const createChampion = async (req: FileRequest, res: Response, next: any) => {
  try {
    const champion = await championService.createChampion(req.body, req.file);
    res.status(201).json(champion);
  } catch (error) {
    next(error);
  }
};

export const getChampions = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const champions = await championService.getChampions(req.query);
    res.json(champions);
  } catch (error) {
    next(error);
  }
};

export const getChampionBySeason = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const champion = await championService.getChampionBySeason(req.params.seasonId);
    res.json(champion);
  } catch (error) {
    next(error);
  }
};

export const updateChampion = async (req: FileRequest, res: Response, next: any) => {
  try {
    const champion = await championService.updateChampion(req.params.id, req.body, req.file);
    res.json(champion);
  } catch (error) {
    next(error);
  }
};

export const deleteChampion = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await championService.deleteChampion(req.params.id);
    res.json({ message: 'Champion deleted successfully' });
  } catch (error) {
    next(error);
  }
};

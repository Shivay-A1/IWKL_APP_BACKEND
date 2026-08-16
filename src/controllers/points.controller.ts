import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as pointsService from '../services/points.service';

export const getPointsTable = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const pointsTable = await pointsService.getPointsTable(req.query);
    res.json(pointsTable);
  } catch (error) {
    next(error);
  }
};

export const getPointsTableBySeason = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const pointsTable = await pointsService.getPointsTableBySeason(req.params.seasonId);
    res.json(pointsTable);
  } catch (error) {
    next(error);
  }
};

export const updatePointsTable = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const entry = await pointsService.updatePointsTable(req.params.id, req.body);
    res.json(entry);
  } catch (error) {
    next(error);
  }
};

export const recalculatePointsTable = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await pointsService.recalculatePointsTable(req.params.seasonId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as pointsTableService from '../services/pointsTable.service';

export const getPointsTable = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const pointsTable = await pointsTableService.getPointsTable(req.query);
    res.json(pointsTable);
  } catch (error) {
    next(error);
  }
};

export const getPointsTableBySeason = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const pointsTable = await pointsTableService.getPointsTableBySeason(req.params.seasonId);
    res.json(pointsTable);
  } catch (error) {
    next(error);
  }
};

export const updatePointsTableEntry = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const entry = await pointsTableService.updatePointsTableEntry(req.params.id, req.body);
    res.json(entry);
  } catch (error) {
    next(error);
  }
};

export const createPointsTableEntry = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const entry = await pointsTableService.createPointsTableEntry(req.body);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

export const deletePointsTableEntry = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await pointsTableService.deletePointsTableEntry(req.params.id);
    res.json({ message: 'Points table entry deleted successfully' });
  } catch (error) {
    next(error);
  }
};

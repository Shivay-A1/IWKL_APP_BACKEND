import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as leadershipService from '../services/leadership.service';
import { AppError } from '../middleware/error';

export const getAllLeadership = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const leadership = await leadershipService.getAllLeadership();
    res.json(leadership);
  } catch (error) {
    next(error);
  }
};

export const getLeadershipById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { id } = req.params;
    const leadership = await leadershipService.getLeadershipById(id);
    res.json(leadership);
  } catch (error) {
    next(error);
  }
};

export const createLeadership = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { name, designation, description, photo, order } = req.body;
    const leadership = await leadershipService.createLeadership({
      name,
      designation,
      description,
      photo,
      order: order || 0,
    });
    res.status(201).json(leadership);
  } catch (error) {
    next(error);
  }
};

export const updateLeadership = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { id } = req.params;
    const { name, designation, description, photo, order, isActive } = req.body;
    const leadership = await leadershipService.updateLeadership(id, {
      name,
      designation,
      description,
      photo,
      order,
      isActive,
    });
    res.json(leadership);
  } catch (error) {
    next(error);
  }
};

export const deleteLeadership = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { id } = req.params;
    await leadershipService.deleteLeadership(id);
    res.json({ message: 'Leadership member deleted successfully' });
  } catch (error) {
    next(error);
  }
};

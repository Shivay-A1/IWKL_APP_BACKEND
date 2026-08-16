import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as userService from '../services/user.service';

export const getUsers = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const users = await userService.getUsers(req.query);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body.role);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const addFavoriteTeam = async (req: AuthRequest, res: Response, next: any) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const favorite = await userService.addFavoriteTeam(req.user.id, req.body.teamId);
    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

export const removeFavoriteTeam = async (req: AuthRequest, res: Response, next: any) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    await userService.removeFavoriteTeam(req.user.id, req.params.teamId);
    res.json({ message: 'Favorite team removed' });
  } catch (error) {
    next(error);
  }
};

export const getFavoriteTeams = async (req: AuthRequest, res: Response, next: any) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const teams = await userService.getFavoriteTeams(req.user.id);
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const stats = await userService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

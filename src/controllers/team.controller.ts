import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as teamService from '../services/team.service';

export const createTeam = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const logoFile = files?.logo?.[0];
    const bannerFile = files?.banner?.[0];
    const team = await teamService.createTeam(req.body, logoFile, bannerFile);
    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
};

export const createTeamWithLogoUrl = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const team = await teamService.createTeamWithLogoUrl(req.body);
    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
};

export const createTeamSimple = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const team = await teamService.createTeamSimple(req.body);
    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
};

export const getTeams = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const teams = await teamService.getTeams(req.query);
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    res.json(team);
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const logoFile = files?.logo?.[0];
    const bannerFile = files?.banner?.[0];
    const team = await teamService.updateTeam(req.params.id, req.body, logoFile, bannerFile);
    res.json(team);
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await teamService.deleteTeam(req.params.id);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTeamStats = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const stats = await teamService.getTeamStats(req.params.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

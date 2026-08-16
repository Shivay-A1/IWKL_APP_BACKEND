import { Response } from 'express';
import { AuthRequest, FileRequest } from '../types/express';
import * as playerService from '../services/player.service';

export const createPlayer = async (req: FileRequest, res: Response, next: any) => {
  try {
    const player = await playerService.createPlayer(req.body, req.file);
    res.status(201).json(player);
  } catch (error) {
    next(error);
  }
};

export const getPlayers = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const players = await playerService.getPlayers(req.query);
    res.json(players);
  } catch (error) {
    next(error);
  }
};

export const getPlayerById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const player = await playerService.getPlayerById(req.params.id);
    res.json(player);
  } catch (error) {
    next(error);
  }
};

export const updatePlayer = async (req: FileRequest, res: Response, next: any) => {
  try {
    const player = await playerService.updatePlayer(req.params.id, req.body, req.file);
    res.json(player);
  } catch (error) {
    next(error);
  }
};

export const deletePlayer = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await playerService.deletePlayer(req.params.id);
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getPlayersByTeam = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const players = await playerService.getPlayersByTeam(req.params.teamId);
    res.json(players);
  } catch (error) {
    next(error);
  }
};

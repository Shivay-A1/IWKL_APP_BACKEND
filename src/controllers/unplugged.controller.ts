import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as unpluggedService from '../services/unplugged.service';

export const createCategory = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const category = await unpluggedService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const categories = await unpluggedService.getCategories(req.query);
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const category = await unpluggedService.getCategoryById(req.params.id);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const category = await unpluggedService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await unpluggedService.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const createVideo = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const video = await unpluggedService.createVideo(req.body);
    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
};

export const getVideos = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const videos = await unpluggedService.getVideos(req.query);
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

export const getVideoById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const video = await unpluggedService.getVideoById(req.params.id);
    res.json(video);
  } catch (error) {
    next(error);
  }
};

export const getVideosByCategory = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const videos = await unpluggedService.getVideosByCategory(req.params.id);
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const video = await unpluggedService.updateVideo(req.params.id, req.body);
    res.json(video);
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await unpluggedService.deleteVideo(req.params.id);
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    next(error);
  }
};

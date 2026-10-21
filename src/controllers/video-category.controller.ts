import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as videoCategoryService from '../services/video-category.service';

export const createVideoCategory = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const category = await videoCategoryService.createVideoCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const getVideoCategories = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const categories = await videoCategoryService.getVideoCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const getVideoCategoryById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const category = await videoCategoryService.getVideoCategoryById(req.params.id);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const updateVideoCategory = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const category = await videoCategoryService.updateVideoCategory(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteVideoCategory = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await videoCategoryService.deleteVideoCategory(req.params.id);
    res.json({ message: 'Video category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

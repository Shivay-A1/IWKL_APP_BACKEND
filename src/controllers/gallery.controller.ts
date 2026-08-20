import { Response } from 'express';
import { AuthRequest, FileRequest } from '../types/express';
import * as galleryService from '../services/gallery.service';

export const createGalleryItem = async (req: FileRequest, res: Response, next: any) => {
  try {
    console.log('Create gallery request:', {
      body: req.body,
      files: req.files,
      hasFiles: !!req.files,
      fileCount: req.files?.length
    });
    const item = await galleryService.createGalleryItem(req.body, req.files);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error in createGalleryItem controller:', error);
    next(error);
  }
};

export const getGalleryItems = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const items = await galleryService.getGalleryItems(req.query);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getGalleryItemById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const item = await galleryService.getGalleryItemById(req.params.id);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateGalleryItem = async (req: FileRequest, res: Response, next: any) => {
  try {
    const item = await galleryService.updateGalleryItem(req.params.id, req.body, req.files);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await galleryService.deleteGalleryItem(req.params.id);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getGalleryByCategory = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const items = await galleryService.getGalleryByCategory(req.params.category);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getGalleryByAlbum = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const items = await galleryService.getGalleryByAlbum(req.params.album);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

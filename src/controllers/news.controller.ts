import { Response } from 'express';
import { AuthRequest, FileRequest } from '../types/express';
import * as newsService from '../services/news.service';

export const createNews = async (req: FileRequest, res: Response, next: any) => {
  try {
    const news = await newsService.createNews(req.body, req.file, req.files);
    res.status(201).json(news);
  } catch (error) {
    next(error);
  }
};

export const getNews = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const news = await newsService.getNews(req.query);
    res.json(news);
  } catch (error) {
    next(error);
  }
};

export const getNewsBySlug = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const news = await newsService.getNewsBySlug(req.params.slug);
    res.json(news);
  } catch (error) {
    next(error);
  }
};

export const updateNews = async (req: FileRequest, res: Response, next: any) => {
  try {
    const news = await newsService.updateNews(req.params.id, req.body, req.file, req.files);
    res.json(news);
  } catch (error) {
    next(error);
  }
};

export const deleteNews = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await newsService.deleteNews(req.params.id);
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedNews = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const news = await newsService.getFeaturedNews();
    res.json(news);
  } catch (error) {
    next(error);
  }
};

export const incrementViewCount = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await newsService.incrementViewCount(req.params.id);
    res.json({ message: 'View count incremented' });
  } catch (error) {
    next(error);
  }
};

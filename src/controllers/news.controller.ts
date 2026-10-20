// ============================================================================
// ⚠️  NEWS FUNCTIONALITY LOCKED - DO NOT MODIFY WITHOUT APPROVAL ⚠️
// ============================================================================
// This file contains the news controller functionality.
// Any changes to this file must be approved by the project owner.
//
// BEFORE MAKING CHANGES:
// 1. Get explicit approval from project owner
// 2. Document changes in project documentation
// 3. Test thoroughly in development environment
//
// LOCKED BY: Project Owner
// LOCKED DATE: 2026-10-21
// STATUS: 🔒 LOCKED
// ============================================================================

import { Response } from 'express';
import { AuthRequest, FileRequest } from '../types/express';
import * as newsService from '../services/news.service';

export const createNews = async (req: FileRequest, res: Response, next: any) => {
  try {
    // Convert string booleans to actual booleans from FormData
    const data = {
      ...req.body,
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
    };
    const news = await newsService.createNews(data, req.file, req.files);
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
    // Convert string booleans to actual booleans from FormData
    const data = {
      ...req.body,
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
    };
    const news = await newsService.updateNews(req.params.id, data, req.file, req.files);
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

export const deleteAllNews = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await newsService.deleteAllNews();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

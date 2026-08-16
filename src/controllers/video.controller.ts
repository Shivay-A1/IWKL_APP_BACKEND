import { Response } from 'express';
import { AuthRequest, FileRequest } from '../types/express';
import * as videoService from '../services/video.service';

export const createVideo = async (req: FileRequest, res: Response, next: any) => {
  try {
    const video = await videoService.createVideo(req.body, req.files);
    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
};

export const getVideos = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const videos = await videoService.getVideos(req.query);
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

export const getVideoById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const video = await videoService.getVideoById(req.params.id);
    res.json(video);
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (req: FileRequest, res: Response, next: any) => {
  try {
    const video = await videoService.updateVideo(req.params.id, req.body, req.files);
    res.json(video);
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await videoService.deleteVideo(req.params.id);
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedVideos = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const videos = await videoService.getFeaturedVideos();
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

export const getHomepageVideos = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const data = await videoService.getHomepageVideos();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

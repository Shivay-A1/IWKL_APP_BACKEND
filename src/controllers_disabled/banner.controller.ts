import { Response } from 'express';
import { AuthRequest, FileRequest } from '../types/express';
import * as bannerService from '../services/banner.service';

export const createBanner = async (req: FileRequest, res: Response, next: any) => {
  try {
    const banner = await bannerService.createBanner(req.body, req.file);
    res.status(201).json(banner);
  } catch (error) {
    next(error);
  }
};

export const getBanners = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const banners = await bannerService.getBanners();
    res.json(banners);
  } catch (error) {
    next(error);
  }
};

export const getBannerById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const banner = await bannerService.getBannerById(req.params.id);
    res.json(banner);
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req: FileRequest, res: Response, next: any) => {
  try {
    const banner = await bannerService.updateBanner(req.params.id, req.body, req.file);
    res.json(banner);
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req: AuthRequest, res: Response, next: any) => {
  try {
    await bannerService.deleteBanner(req.params.id);
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getActiveBanners = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const banners = await bannerService.getActiveBanners();
    res.json(banners);
  } catch (error) {
    next(error);
  }
};

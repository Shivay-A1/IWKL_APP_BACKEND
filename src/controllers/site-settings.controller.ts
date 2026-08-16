import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as siteSettingsService from '../services/site-settings.service';

export const getSiteSettings = async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const settings = await siteSettingsService.getSiteSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateSiteSettings = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { siteName, siteTagline, siteLogo, favicon, seoTitle, seoDescription, seoKeywords, contactEmail, contactPhone, socialMedia, maintenanceMode } = req.body;
    const settings = await siteSettingsService.updateSiteSettings({
      siteName,
      siteTagline,
      siteLogo,
      favicon,
      seoTitle,
      seoDescription,
      seoKeywords,
      contactEmail,
      contactPhone,
      socialMedia,
      maintenanceMode,
    });
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

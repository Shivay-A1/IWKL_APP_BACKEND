import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as footerService from '../services/footer.service';

export const getFooter = async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const footer = await footerService.getFooter();
    res.json(footer);
  } catch (error) {
    next(error);
  }
};

export const updateFooter = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { logo, quickLinks, resources, contactInfo, socialLinks, copyright } = req.body;
    const footer = await footerService.updateFooter({
      logo,
      quickLinks,
      resources,
      contactInfo,
      socialLinks,
      copyright,
    });
    res.json(footer);
  } catch (error) {
    next(error);
  }
};

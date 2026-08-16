import { Request, Response } from 'express';
import * as homepageService from '../services/homepage.service';

export const getHomepageData = async (req: Request, res: Response) => {
  try {
    const data = await homepageService.getHomepageData();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch homepage data'
    });
  }
};

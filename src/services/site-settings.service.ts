import { prisma } from '../config';

export const getSiteSettings = async () => {
  let settings = await prisma.siteSettings.findFirst();
  
  if (!settings) {
    // Create default settings if none exists
    settings = await prisma.siteSettings.create({
      data: {
        siteName: 'IWKL',
        siteTagline: 'Indian Women Kabaddi League',
        siteLogo: '/logo_image.png',
        favicon: '/favicon.ico',
        seoTitle: 'IWKL - Indian Women Kabaddi League',
        seoDescription: 'Official website of the Indian Women Kabaddi League',
        seoKeywords: 'kabaddi, women kabaddi, sports, league, IWKL',
        contactEmail: 'contact@iwkl.com',
        contactPhone: '+91 1234567890',
        socialMedia: {},
        maintenanceMode: false,
      },
    });
  }
  
  return settings;
};

export const updateSiteSettings = async (data: {
  siteName?: string;
  siteTagline?: string;
  siteLogo?: string;
  favicon?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialMedia?: any;
  maintenanceMode?: boolean;
}) => {
  const existing = await prisma.siteSettings.findFirst();
  
  if (!existing) {
    return await prisma.siteSettings.create({
      data: {
        siteName: data.siteName || 'IWKL',
        siteTagline: data.siteTagline || 'Indian Women Kabaddi League',
        siteLogo: data.siteLogo || '/logo_image.png',
        favicon: data.favicon || '/favicon.ico',
        seoTitle: data.seoTitle || 'IWKL - Indian Women Kabaddi League',
        seoDescription: data.seoDescription || 'Official website of the Indian Women Kabaddi League',
        seoKeywords: data.seoKeywords || 'kabaddi, women kabaddi, sports, league, IWKL',
        contactEmail: data.contactEmail || 'contact@iwkl.com',
        contactPhone: data.contactPhone || '+91 1234567890',
        socialMedia: data.socialMedia || {},
        maintenanceMode: data.maintenanceMode ?? false,
      },
    });
  }
  
  return await prisma.siteSettings.update({
    where: { id: existing.id },
    data,
  });
};

import { prisma } from '../config';

export const getFooter = async () => {
  let footer = await prisma.footer.findFirst();
  
  if (!footer) {
    // Create default footer if none exists
    footer = await prisma.footer.create({
      data: {
        logo: '/logo_image.png',
        quickLinks: [],
        resources: [],
        contactInfo: {},
        socialLinks: {},
        copyright: `© ${new Date().getFullYear()} IWKL. All rights reserved.`,
      },
    });
  }
  
  return footer;
};

export const updateFooter = async (data: {
  logo?: string;
  quickLinks?: any;
  resources?: any;
  contactInfo?: any;
  socialLinks?: any;
  copyright?: string;
}) => {
  const existing = await prisma.footer.findFirst();
  
  if (!existing) {
    return await prisma.footer.create({
      data: {
        logo: data.logo || '/logo_image.png',
        quickLinks: data.quickLinks || [],
        resources: data.resources || [],
        contactInfo: data.contactInfo || {},
        socialLinks: data.socialLinks || {},
        copyright: data.copyright || `© ${new Date().getFullYear()} IWKL. All rights reserved.`,
      },
    });
  }
  
  return await prisma.footer.update({
    where: { id: existing.id },
    data,
  });
};

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateBannerUrls() {
  try {
    const backendUrl = 'https://iwklappbackend-production.up.railway.app';

    // Find banners with old file path URLs
    const banners = await prisma.homepageBanner.findMany({
      where: {
        OR: [
          { imageUrl: { startsWith: '/app/uploads/' } },
          { imageUrl: null },
        ],
      },
    });

    console.log(`Found ${banners.length} banners to update`);

    for (const banner of banners) {
      const newImageUrl = `${backendUrl}/api/homepage-banners/${banner.id}/image`;
      await prisma.homepageBanner.update({
        where: { id: banner.id },
        data: { imageUrl: newImageUrl },
      });
      console.log(`Updated banner ${banner.id}: ${banner.imageUrl} -> ${newImageUrl}`);
    }

    console.log('Banner URLs updated successfully');
  } catch (error) {
    console.error('Error updating banner URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBannerUrls();

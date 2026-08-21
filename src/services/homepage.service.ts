import { prisma } from '../config';

export async function getHomepageData() {
  try {
    if (!prisma) {
      console.warn('⚠️ Database not available, returning empty data');
      return {
        banners: [],
        pointsTable: [],
        videos: [],
        news: [],
        gallery: [],
        teams: [],
        matches: []
      };
    }

    // Fetch all data in parallel for better performance
    const [
      banners,
      pointsTable,
      videos,
      news,
      gallery,
      teams,
      matches
    ] = await Promise.all([
      // Hero Banners
      prisma.homepageBanner?.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' }
      }) || [],
      
      // Points Table
      prisma.pointsTableEntry.findMany({
        where: {
          season: {
            isActive: true
          }
        },
        include: {
          team: {
            select: {
              id: true,
              name: true,
              shortName: true,
              logo: true,
              city: true
            }
          },
          season: {
            select: {
              id: true,
              name: true,
              year: true
            }
          }
        },
        orderBy: { position: 'asc' }
      }),
      
      // Videos
      prisma.video.findMany({
        where: { isActive: true },
        include: {
          category: {
            select: {
              name: true
            }
          }
        },
        orderBy: { displayOrder: 'asc' }
      }),
      
      // News
      prisma.news.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        take: 10
      }),
      
      // Gallery
      prisma.galleryItem.findMany({
        orderBy: { order: 'asc' },
        take: 10
      }),
      
      // Teams
      prisma.team.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      }),
      
      // Matches
      prisma.match.findMany({
        where: {
          season: {
            isActive: true
          }
        },
        include: {
          homeTeam: {
            select: {
              id: true,
              name: true,
              shortName: true,
              logo: true
            }
          },
          awayTeam: {
            select: {
              id: true,
              name: true,
              shortName: true,
              logo: true
            }
          }
        },
        orderBy: { matchDate: 'asc' },
        take: 10
      })
    ]);

    return {
      banners,
      pointsTable,
      videos,
      news,
      gallery,
      teams,
      matches
    };
  } catch (error) {
    console.error('Error in homepage service:', error);
    throw error;
  }
}

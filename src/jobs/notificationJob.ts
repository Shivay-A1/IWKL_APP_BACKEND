import { prisma } from '../config/database'

// Helper function to check if prisma is available
const isPrismaAvailable = () => prisma !== null;

// Clean up old notifications (older than 30 days)
export async function cleanupOldNotifications() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const deleted = await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    })

    console.log(`Deleted ${deleted.count} old notifications`)
  } catch (error) {
    console.error('Error cleaning up notifications:', error)
  }
}

// Send weekly digest to users
export async function sendWeeklyDigest() {
  try {
    const users = await prisma.user.findMany({
      where: { isVerified: true },
    })

    for (const user of users) {
      const favoriteTeamIds = (
        await prisma.favoriteTeam.findMany({
          where: { userId: user.id },
          select: { teamId: true },
        })
      ).map((ft) => ft.teamId)

      const upcomingMatches = await prisma.match.findMany({
        where: {
          status: 'SCHEDULED',
          matchDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          OR: [
            { homeTeamId: { in: favoriteTeamIds } },
            { awayTeamId: { in: favoriteTeamIds } },
          ],
        },
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      })

      if (upcomingMatches.length > 0) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: 'Weekly Digest',
            message: `Your favorite teams have ${upcomingMatches.length} matches this week!`,
            type: 'WEEKLY_DIGEST',
            isRead: false,
          },
        })
      }
    }

    console.log('Weekly digest sent successfully')
  } catch (error) {
    console.error('Error sending weekly digest:', error)
  }
}

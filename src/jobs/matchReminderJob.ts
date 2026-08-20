import prisma from '../config/database'
import { apiService } from '../services'

// Helper function to check if prisma is available
const isPrismaAvailable = () => prisma !== null;

// Send match reminders to users who follow the teams
export async function sendMatchReminders() {
  try {
    if (!prisma) {
      console.warn('Database not available for match reminders');
      return;
    }
    
    const upcomingMatches = await prisma.match.findMany({
      where: {
        status: 'SCHEDULED',
        matchDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next 24 hours
        },
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    })

    for (const match of upcomingMatches) {
      const favoriteTeams = await prisma.favoriteTeam.findMany({
        where: {
          OR: [
            { teamId: match.homeTeamId },
            { teamId: match.awayTeamId },
          ],
        },
        include: {
          user: true,
        },
      })

      for (const favorite of favoriteTeams) {
        await prisma.notification.create({
          data: {
            userId: favorite.userId,
            title: 'Match Reminder',
            message: `${match.homeTeam.name} vs ${match.awayTeam.name} starts in 24 hours!`,
            type: 'MATCH_REMINDER',
            isRead: false,
          },
        })
      }
    }

    console.log(`Sent match reminders for ${upcomingMatches.length} matches`)
  } catch (error) {
    console.error('Error sending match reminders:', error)
  }
}

// Update match status to LIVE when match starts
export async function updateLiveMatches() {
  try {
    const scheduledMatches = await prisma.match.findMany({
      where: {
        status: 'SCHEDULED',
        matchDate: {
          lte: new Date(),
        },
      },
    })

    for (const match of scheduledMatches) {
      await prisma.match.update({
        where: { id: match.id },
        data: { status: 'LIVE' },
      })
    }

    console.log(`Updated ${scheduledMatches.length} matches to LIVE`)
  } catch (error) {
    console.error('Error updating live matches:', error)
  }
}

// Auto-complete matches that have ended
export async function completeMatches() {
  try {
    const liveMatches = await prisma.match.findMany({
      where: {
        status: 'LIVE',
        matchDate: {
          lte: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        },
      },
    })

    for (const match of liveMatches) {
      await prisma.match.update({
        where: { id: match.id },
        data: { status: 'COMPLETED' },
      })
    }

    console.log(`Completed ${liveMatches.length} matches`)
  } catch (error) {
    console.error('Error completing matches:', error)
  }
}

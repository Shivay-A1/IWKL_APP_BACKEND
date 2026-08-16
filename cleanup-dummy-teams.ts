import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDummyTeams() {
  console.log('Starting cleanup of dummy teams...')

  const dummyTeamNames = [
    'Lucknow Tigers',
    'Mumbai Queens',
    'Punjab Panthers',
    'Jaipur Royals',
    'Bengaluru Stars',
    'Hyderabad Hawks',
    'Kolkata Champions'
  ]

  try {
    // Get dummy team IDs
    const dummyTeams = await prisma.team.findMany({
      where: {
        name: {
          in: dummyTeamNames
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    console.log('Found dummy teams:', dummyTeams)

    const dummyTeamIds = dummyTeams.map(t => t.id)
    console.log('Dummy team IDs:', dummyTeamIds)

    // Delete points table entries for dummy teams
    const deletedPointsEntries = await prisma.pointsTableEntry.deleteMany({
      where: {
        teamId: {
          in: dummyTeamIds
        }
      }
    })
    console.log('Deleted points table entries:', deletedPointsEntries.count)

    // Delete match results for matches involving dummy teams
    const matchesToDelete = await prisma.match.findMany({
      where: {
        OR: [
          { homeTeamId: { in: dummyTeamIds } },
          { awayTeamId: { in: dummyTeamIds } }
        ]
      },
      select: {
        id: true
      }
    })

    const matchIds = matchesToDelete.map(m => m.id)
    
    if (matchIds.length > 0) {
      const deletedMatchResults = await prisma.matchResult.deleteMany({
        where: {
          matchId: {
            in: matchIds
          }
        }
      })
      console.log('Deleted match results:', deletedMatchResults.count)
    }

    // Delete matches involving dummy teams
    const deletedMatches = await prisma.match.deleteMany({
      where: {
        OR: [
          { homeTeamId: { in: dummyTeamIds } },
          { awayTeamId: { in: dummyTeamIds } }
        ]
      }
    })
    console.log('Deleted matches:', deletedMatches.count)

    // Delete dummy teams
    const deletedTeams = await prisma.team.deleteMany({
      where: {
        name: {
          in: dummyTeamNames
        }
      }
    })
    console.log('Deleted dummy teams:', deletedTeams.count)

    // Verify remaining teams
    const remainingTeams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        shortName: true,
        city: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    console.log('\n=== Remaining Teams ===')
    console.log(`Total: ${remainingTeams.length}`)
    remainingTeams.forEach(team => {
      console.log(`- ${team.name} (${team.shortName})`)
    })

    console.log('\n✅ Cleanup completed successfully!')

  } catch (error) {
    console.error('Error during cleanup:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanupDummyTeams()

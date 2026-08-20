import prisma from '../config/database'

// Recalculate points table for active season
export async function recalculatePointsTable() {
  try {
    if (!prisma) {
      console.warn('⚠️ Database not available, skipping points recalculation');
      return;
    }

    const activeSeason = await prisma.season.findFirst({
      where: { isActive: true },
    })

    if (!activeSeason) {
      console.log('No active season found')
      return
    }

    const teams = await prisma.team.findMany({
      where: { seasonId: activeSeason.id },
    })

    for (const team of teams) {
      const matches = await prisma.match.findMany({
        where: {
          seasonId: activeSeason.id,
          OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
          status: 'COMPLETED',
        },
        include: {
          result: true,
        },
      })

      let wins = 0
      let losses = 0
      let scoreFor = 0
      let scoreAgainst = 0
      let points = 0

      for (const match of matches) {
        if (!match.result) continue

        const isHome = match.homeTeamId === team.id
        const teamScore = isHome ? match.result.homeScore : match.result.awayScore
        const opponentScore = isHome ? match.result.awayScore : match.result.homeScore

        scoreFor += teamScore
        scoreAgainst += opponentScore

        if (teamScore > opponentScore) {
          wins++
          points += 2
        } else {
          losses++
        }
      }

      const scoreDifference = scoreFor - scoreAgainst
      const matchesPlayed = matches.length

      await prisma.pointsTableEntry.upsert({
        where: {
          teamId_seasonId: {
            teamId: team.id,
            seasonId: activeSeason.id,
          },
        },
        update: {
          matchesPlayed,
          wins,
          losses,
          points,
          scoreFor,
          scoreAgainst,
          scoreDifference,
        },
        create: {
          teamId: team.id,
          seasonId: activeSeason.id,
          matchesPlayed,
          wins,
          losses,
          points,
          scoreFor,
          scoreAgainst,
          scoreDifference,
        },
      })
    }

    // Update ranks
    const pointsEntries = await prisma.pointsTableEntry.findMany({
      where: { seasonId: activeSeason.id },
      orderBy: [{ points: 'desc' }, { scoreDifference: 'desc' }],
    })

    for (let i = 0; i < pointsEntries.length; i++) {
      await prisma.pointsTableEntry.update({
        where: { id: pointsEntries[i].id },
        data: { rank: i + 1 },
      })
    }

    console.log('Points table recalculated successfully')
  } catch (error) {
    console.error('Error recalculating points table:', error)
  }
}

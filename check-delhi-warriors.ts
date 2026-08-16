import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDelhiWarriors() {
  console.log('=== Checking Delhi Warriors Record ===\n')

  try {
    // Find Delhi Warriors by name
    const delhiWarriors = await prisma.team.findFirst({
      where: { 
        name: 'Delhi Warriors'
      },
      include: {
        season: true,
        pointsTable: true,
      }
    })

    if (!delhiWarriors) {
      console.log('❌ Delhi Warriors NOT FOUND in database')
      return
    }

    console.log('✓ Delhi Warriors FOUND in database')
    console.log('\n--- Team Details ---')
    console.log('ID:', delhiWarriors.id)
    console.log('Name:', delhiWarriors.name)
    console.log('Short Name:', delhiWarriors.shortName)
    console.log('Logo:', delhiWarriors.logo)
    console.log('City:', delhiWarriors.city)
    console.log('isActive:', delhiWarriors.isActive)
    console.log('Season:', delhiWarriors.season?.name)
    console.log('Season ID:', delhiWarriors.seasonId)
    console.log('Created At:', delhiWarriors.createdAt)
    console.log('Updated At:', delhiWarriors.updatedAt)

    console.log('\n--- Points Table Entry ---')
    if (delhiWarriors.pointsTable && delhiWarriors.pointsTable.length > 0) {
      delhiWarriors.pointsTable.forEach(entry => {
        console.log('Position:', entry.position)
        console.log('Points:', entry.points)
        console.log('Matches Played:', entry.matchesPlayed)
        console.log('Wins:', entry.wins)
        console.log('Losses:', entry.losses)
      })
    } else {
      console.log('No points table entry found')
    }

    console.log('\n--- Active Status Check ---')
    if (delhiWarriors.isActive === false) {
      console.log('❌ ISSUE FOUND: Delhi Warriors has isActive = false')
      console.log('This is why it does not appear in the API response when filtering by isActive=true')
    } else if (delhiWarriors.isActive === true) {
      console.log('✓ Delhi Warriors has isActive = true')
      console.log('This should appear in API responses')
    } else {
      console.log('⚠️  Delhi Warriors has isActive = null or undefined')
    }

    // Check all teams with their isActive status
    console.log('\n--- All Teams with isActive Status ---')
    const allTeams = await prisma.team.findMany({
      where: { seasonId: delhiWarriors.seasonId },
      select: {
        id: true,
        name: true,
        shortName: true,
        isActive: true,
      },
      orderBy: { name: 'asc' }
    })

    allTeams.forEach(team => {
      const status = team.isActive ? '✓' : '❌'
      console.log(`${status} ${team.name} (${team.shortName}) - isActive: ${team.isActive}`)
    })

    // Count active vs inactive teams
    const activeCount = allTeams.filter(t => t.isActive).length
    const inactiveCount = allTeams.filter(t => !t.isActive).length
    console.log(`\n--- Summary ---`)
    console.log(`Total Teams: ${allTeams.length}`)
    console.log(`Active Teams: ${activeCount}`)
    console.log(`Inactive Teams: ${inactiveCount}`)

  } catch (error) {
    console.error('Error checking Delhi Warriors:', error)
  }
}

checkDelhiWarriors()
  .catch((e) => {
    console.error('Check failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

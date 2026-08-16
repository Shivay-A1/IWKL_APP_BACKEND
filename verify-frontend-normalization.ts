import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyFrontendNormalization() {
  console.log('=== Verifying Frontend TeamMaster Normalization ===\n')

  try {
    // Get the active season
    const season = await prisma.season.findFirst({
      where: { isActive: true }
    })

    if (!season) {
      console.log('❌ No active season found')
      return
    }

    // Get all teams from database (same as API would return)
    const dbTeams = await prisma.team.findMany({
      where: {
        seasonId: season.id,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        shortName: true,
        logo: true,
        city: true,
      }
    })

    console.log(`--- Database Teams (${dbTeams.length}) ---`)
    dbTeams.forEach((team, index) => {
      console.log(`${index + 1}. ${team.name} (${team.shortName})`)
    })

    // Simulate TeamMaster normalization (from frontend/lib/TeamMaster.ts)
    console.log('\n--- TeamMaster Configuration ---')
    
    // Official teams from TeamMaster
    const officialTeams = [
      'Ayodhya Shakti',
      'Delhi Warriors',
      'Gujrat Gems',
      'Haryanvi Fighters',
      'Kashmiri Queens',
      'Kolkata Rangers',
      'Mumbai Strikers',
      'Namma Bengaluru',
      'Punjab Wings',
    ]

    console.log('Official teams in TeamMaster:', officialTeams.length)
    officialTeams.forEach(team => console.log(`  - ${team}`))

    // Check which database teams match official teams
    console.log('\n--- Normalization Check ---')
    const matchingTeams = dbTeams.filter(dbTeam => 
      officialTeams.includes(dbTeam.name)
    )

    console.log(`Database teams that match official teams: ${matchingTeams.length}`)
    matchingTeams.forEach(team => {
      console.log(`  ✓ ${team.name} (${team.shortName})`)
    })

    // Check Delhi Warriors specifically
    const delhiWarriors = dbTeams.find(t => t.name === 'Delhi Warriors')
    console.log('\n--- Delhi Warriors Status ---')
    if (delhiWarriors) {
      console.log('✓ Delhi Warriors exists in database')
      console.log('✓ Delhi Warriors is in official TeamMaster list')
      console.log('✓ Delhi Warriors should appear in frontend after normalization')
    } else {
      console.log('❌ Delhi Warriors not found in database')
    }

    // Check for non-official teams that might be filtered out
    const nonOfficialTeams = dbTeams.filter(dbTeam => 
      !officialTeams.includes(dbTeam.name)
    )

    console.log('\n--- Non-Official Teams (will be filtered by TeamMaster) ---')
    if (nonOfficialTeams.length > 0) {
      nonOfficialTeams.forEach(team => {
        console.log(`  - ${team.name} (${team.shortName})`)
      })
      console.log(`\n⚠️  ${nonOfficialTeams.length} teams will be filtered out by TeamMaster normalization`)
    } else {
      console.log('  None')
    }

  } catch (error) {
    console.error('Error verifying normalization:', error)
  }
}

verifyFrontendNormalization()
  .catch((e) => {
    console.error('Verification failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

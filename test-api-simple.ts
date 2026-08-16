import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testApiDirectly() {
  console.log('=== Testing API Directly (simulating backend endpoint) ===\n')

  try {
    // Simulate the exact query the backend API would make
    const season = await prisma.season.findFirst({
      where: { isActive: true }
    })

    if (!season) {
      console.log('❌ No active season found')
      return
    }

    console.log('✓ Active Season:', season.name)

    // Simulate the teams API query
    const teams = await prisma.team.findMany({
      where: {
        seasonId: season.id,
        isActive: true
      },
      include: {
        season: true,
        _count: {
          select: {
            players: true,
          },
        },
      },
    })

    console.log(`\n--- API Response (what frontend receives) ---`)
    console.log(`Total teams: ${teams.length}`)
    
    teams.forEach((team, index) => {
      console.log(`${index + 1}. ${team.name} (${team.shortName})`)
    })

    // Check Delhi Warriors
    const delhiWarriors = teams.find(t => t.name === 'Delhi Warriors')
    console.log('\n--- Delhi Warriors Check ---')
    if (delhiWarriors) {
      console.log('✓ Delhi Warriors IS in database query result')
      console.log('   If frontend is not showing it, the issue is:')
      console.log('   1. Frontend not calling API correctly')
      console.log('   2. Frontend filtering it out after receiving')
      console.log('   3. Frontend using fallback data instead of API')
    } else {
      console.log('❌ Delhi Warriors NOT in database query result')
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

testApiDirectly()
  .catch((e) => {
    console.error('Test failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

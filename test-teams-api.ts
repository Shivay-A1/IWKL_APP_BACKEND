import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testTeamsAPI() {
  console.log('=== Testing Teams API Response ===\n')

  try {
    // Get the active season
    const season = await prisma.season.findFirst({
      where: { isActive: true }
    })

    if (!season) {
      console.log('❌ No active season found')
      return
    }

    console.log('✓ Active Season:', season.name)
    console.log('Season ID:', season.id)

    // Simulate the API call with isActive filter (same as frontend)
    const where: any = {
      seasonId: season.id,
      isActive: true
    }

    console.log('\n--- API Query Parameters ---')
    console.log('where:', JSON.stringify(where, null, 2))

    // Execute the query (same as team.service.ts getTeams)
    const teams = await prisma.team.findMany({
      where,
      include: {
        season: true,
        _count: {
          select: {
            players: true,
          },
        },
      },
    })

    console.log('\n--- API Response ---')
    console.log(`Total teams returned: ${teams.length}`)

    if (teams.length === 0) {
      console.log('❌ NO TEAMS RETURNED - This is the problem!')
      return
    }

    console.log('\n--- Teams in Response ---')
    teams.forEach((team, index) => {
      console.log(`${index + 1}. ${team.name} (${team.shortName})`)
      console.log(`   ID: ${team.id}`)
      console.log(`   isActive: ${team.isActive}`)
      console.log(`   Logo: ${team.logo}`)
    })

    // Check if Delhi Warriors is in the response
    const delhiWarriors = teams.find(t => t.name === 'Delhi Warriors')
    console.log('\n--- Delhi Warriors Check ---')
    if (delhiWarriors) {
      console.log('✓ Delhi Warriors IS in the API response')
      console.log('   This means the issue is in the FRONTEND processing')
    } else {
      console.log('❌ Delhi Warriors is NOT in the API response')
      console.log('   This means the issue is in the BACKEND query')
    }

  } catch (error) {
    console.error('Error testing teams API:', error)
  }
}

testTeamsAPI()
  .catch((e) => {
    console.error('Test failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

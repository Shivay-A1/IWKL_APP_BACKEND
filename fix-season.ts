import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixSeason() {
  console.log('=== Fixing Season isActive Status ===\n')

  try {
    // Update IWKL 2026 to be active
    const season = await prisma.season.update({
      where: { name: 'IWKL 2026' },
      data: { isActive: true }
    })

    console.log('✓ Season Updated Successfully')
    console.log('\n--- Updated Season Details ---')
    console.log('Name:', season.name)
    console.log('Year:', season.year)
    console.log('isActive:', season.isActive)
    console.log('isCompleted:', season.isCompleted)
    console.log('Start Date:', season.startDate)
    console.log('End Date:', season.endDate)

    // Verify teams are now accessible
    console.log('\n--- Verifying Teams Access ---')
    const teams = await prisma.team.findMany({
      where: {
        seasonId: season.id,
        isActive: true
      },
      include: {
        season: true
      }
    })

    console.log(`Total active teams found: ${teams.length}`)
    
    // Check if Delhi Warriors is in the results
    const delhiWarriors = teams.find(t => t.name === 'Delhi Warriors')
    console.log('\n--- Delhi Warriors Status ---')
    if (delhiWarriors) {
      console.log('✓ Delhi Warriors is now accessible via API')
      console.log('   Name:', delhiWarriors.name)
      console.log('   Short Name:', delhiWarriors.shortName)
      console.log('   isActive:', delhiWarriors.isActive)
    } else {
      console.log('❌ Delhi Warriors still not accessible')
    }

    console.log('\n--- All Active Teams ---')
    teams.forEach((team, index) => {
      console.log(`${index + 1}. ${team.name} (${team.shortName})`)
    })

  } catch (error) {
    console.error('Error fixing season:', error)
  }
}

fixSeason()
  .catch((e) => {
    console.error('Fix failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

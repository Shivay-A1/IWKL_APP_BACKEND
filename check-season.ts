import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkSeason() {
  console.log('=== Checking Season Status ===\n')

  try {
    // Get all seasons
    const seasons = await prisma.season.findMany({
      orderBy: { year: 'desc' }
    })

    console.log(`--- All Seasons (${seasons.length}) ---`)
    seasons.forEach(season => {
      console.log(`\nName: ${season.name}`)
      console.log(`Year: ${season.year}`)
      console.log(`isActive: ${season.isActive}`)
      console.log(`isCompleted: ${season.isCompleted}`)
      console.log(`Start Date: ${season.startDate}`)
      console.log(`End Date: ${season.endDate}`)
      console.log(`ID: ${season.id}`)
    })

    // Check if IWKL 2026 exists
    const iwkl2026 = await prisma.season.findUnique({
      where: { name: 'IWKL 2026' }
    })

    console.log('\n--- IWKL 2026 Status ---')
    if (iwkl2026) {
      console.log('✓ IWKL 2026 exists')
      console.log(`isActive: ${iwkl2026.isActive}`)
      console.log(`isCompleted: ${iwkl2026.isCompleted}`)
      
      if (!iwkl2026.isActive) {
        console.log('\n❌ ISSUE FOUND: IWKL 2026 has isActive = false')
        console.log('This is why teams are not appearing - the API filters by active season')
      }
    } else {
      console.log('❌ IWKL 2026 does not exist')
    }

  } catch (error) {
    console.error('Error checking season:', error)
  }
}

checkSeason()
  .catch((e) => {
    console.error('Check failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

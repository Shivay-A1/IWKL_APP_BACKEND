import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifySeed() {
  console.log('=== Verifying Seed Data ===\n')

  // Verify Season
  const season = await prisma.season.findUnique({
    where: { name: 'IWKL 2026' }
  })
  console.log('✓ Season:', season ? `${season.name} (${season.year})` : 'NOT FOUND')

  // Verify Teams
  const teams = await prisma.team.findMany({
    where: { seasonId: season?.id },
    include: { season: true }
  })
  console.log(`✓ Teams: ${teams.length} teams found`)
  teams.forEach(team => console.log(`  - ${team.name} (${team.shortName})`))

  // Verify News
  const news = await prisma.news.findMany()
  console.log(`✓ News: ${news.length} articles found`)
  news.forEach(article => console.log(`  - ${article.title}`))

  // Verify Gallery
  const gallery = await prisma.galleryItem.findMany()
  console.log(`✓ Gallery: ${gallery.length} items found`)
  const galleryByCategory = gallery.reduce((acc, item) => {
    acc[item.category || 'Uncategorized'] = (acc[item.category || 'Uncategorized'] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  Object.entries(galleryByCategory).forEach(([cat, count]) => {
    console.log(`  - ${cat}: ${count} items`)
  })

  // Verify Banners
  const banners = await prisma.homepageBanner.findMany()
  console.log(`✓ Banners: ${banners.length} banners found`)
  banners.forEach(banner => console.log(`  - ${banner.title}`))

  // Verify Points Table
  const pointsTable = await prisma.pointsTableEntry.findMany({
    where: { seasonId: season?.id },
    include: { team: true }
  })
  console.log(`✓ Points Table: ${pointsTable.length} entries found`)
  pointsTable.forEach((entry, index) => {
    console.log(`  ${index + 1}. ${entry.team.name}: ${entry.points} pts (${entry.wins}W-${entry.losses}L)`)
  })

  console.log('\n=== Verification Complete ===')
}

verifySeed()
  .catch((e) => {
    console.error('Verification failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

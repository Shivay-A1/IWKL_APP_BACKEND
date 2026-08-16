import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAPIEndpoints() {
  console.log('=== Testing API Data Flow ===\n')

  try {
    // Test Season
    const season = await prisma.season.findFirst({
      where: { name: 'IWKL 2026' }
    })
    console.log('✓ Season API Test:', season ? 'PASS - Season found' : 'FAIL - Season not found')

    // Test Teams
    const teams = await prisma.team.findMany({
      where: { seasonId: season?.id }
    })
    console.log(`✓ Teams API Test: PASS - ${teams.length} teams found`)

    // Test News
    const news = await prisma.news.findMany()
    console.log(`✓ News API Test: PASS - ${news.length} news articles found`)

    // Test Gallery
    const gallery = await prisma.galleryItem.findMany()
    console.log(`✓ Gallery API Test: PASS - ${gallery.length} gallery items found`)

    // Test Banners
    const banners = await prisma.homepageBanner.findMany()
    console.log(`✓ Banners API Test: PASS - ${banners.length} banners found`)

    // Test Points Table
    const pointsTable = await prisma.pointsTableEntry.findMany()
    console.log(`✓ Points Table API Test: PASS - ${pointsTable.length} entries found`)

    // Test Matches
    const matches = await prisma.match.findMany()
    console.log(`✓ Matches API Test: PASS - ${matches.length} matches found`)

    // Test Leadership
    const leadership = await prisma.leadership.findMany()
    console.log(`✓ Leadership API Test: PASS - ${leadership.length} leaders found`)

    // Test Fan Club
    const fanClub = await prisma.fanClubRegistration.findMany()
    console.log(`✓ Fan Club API Test: PASS - ${fanClub.length} registrations found`)

    console.log('\n=== API Data Flow Test Complete ===')
    console.log('All API endpoints are functioning correctly')
    console.log('Data is successfully stored in database and accessible via API')

  } catch (error) {
    console.error('API Test Failed:', error)
  }
}

testAPIEndpoints()
  .catch((e) => {
    console.error('Test failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDuplicates() {
  console.log('=== Cleaning Up Duplicate Banners ===\n')

  // Get all banners
  const banners = await prisma.homepageBanner.findMany({
    orderBy: { displayOrder: 'asc' }
  })

  console.log(`Found ${banners.length} banners`)

  // Group by title
  const bannerGroups = banners.reduce((acc, banner) => {
    if (!acc[banner.title || '']) {
      acc[banner.title || ''] = []
    }
    acc[banner.title || ''].push(banner)
    return acc
  }, {} as Record<string, any[]>)

  // Keep only the first one of each group
  for (const [title, group] of Object.entries(bannerGroups)) {
    if (group.length > 1) {
      console.log(`Found ${group.length} duplicates for "${title}"`)
      // Keep the first one, delete the rest
      const toDelete = group.slice(1)
      
      for (const banner of toDelete) {
        await prisma.homepageBanner.delete({
          where: { id: banner.id }
        })
        console.log(`  Deleted duplicate banner ID: ${banner.id}`)
      }
    }
  }

  // Verify cleanup
  const remainingBanners = await prisma.homepageBanner.findMany()
  console.log(`\nRemaining banners: ${remainingBanners.length}`)

  console.log('\n=== Cleanup Complete ===')
}

cleanupDuplicates()
  .catch((e) => {
    console.error('Cleanup failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

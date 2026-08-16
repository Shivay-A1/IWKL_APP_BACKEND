import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding OTT data...')

  // Add broadcasters
  const starSports = await prisma.ottBroadcaster.upsert({
    where: { id: 'star-sports-id' },
    update: {},
    create: {
      id: 'star-sports-id',
      name: 'Star Sports',
      logo: '/star_sports.png',
      redirectUrl: 'https://www.starsports.com',
      isActive: true,
      displayOrder: 1,
    },
  })

  const hotstar = await prisma.ottBroadcaster.upsert({
    where: { id: 'hotstar-id' },
    update: {},
    create: {
      id: 'hotstar-id',
      name: 'JioHotstar',
      logo: '/hotstar.png',
      redirectUrl: 'https://www.hotstar.com',
      isActive: true,
      displayOrder: 2,
    },
  })

  console.log('Broadcasters created:', { starSports, hotstar })

  // Add hero CMS
  const hero = await prisma.ottHero.upsert({
    where: { id: 'ott-hero-id' },
    update: {},
    create: {
      id: 'ott-hero-id',
      title: 'IWKL <span class="text-[#BFA253]">OTT</span>',
      subtitle: 'Watch Live Matches • Exclusive Content • Live Highlights • Player Interviews • Press Conferences',
      backgroundImage: '/ott.png',
      isEnabled: true,
    },
  })

  console.log('Hero created:', hero)

  // Add OTT settings
  const settings = await prisma.ottSettings.upsert({
    where: { id: 'ott-settings-id' },
    update: {},
    create: {
      id: 'ott-settings-id',
      starSportsUrl: 'https://www.starsports.com',
      hotstarUrl: 'https://www.hotstar.com',
      defaultStreamUrl: '',
      autoRedirect: false,
    },
  })

  console.log('Settings created:', settings)

  console.log('OTT data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

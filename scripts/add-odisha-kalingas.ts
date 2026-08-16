import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addOdishaKalingas() {
  try {
    console.log('Adding Odisha Kalingas team...')

    // Get the active season (IWKL 2026)
    const season = await prisma.season.findFirst({
      where: { isActive: true }
    })

    if (!season) {
      throw new Error('No active season found. Please create a season first.')
    }

    console.log('Using season:', season.name)

    // Check if team already exists
    const existingTeam = await prisma.team.findUnique({
      where: {
        name_seasonId: {
          name: 'Odisha Kalingas',
          seasonId: season.id,
        }
      }
    })

    if (existingTeam) {
      console.log('Odisha Kalingas team already exists. Skipping creation.')
      return existingTeam
    }

    // Create the team with all specified details
    const team = await prisma.team.create({
      data: {
        name: 'Odisha Kalingas',
        shortName: 'OKL',
        seasonId: season.id,
        logo: '/teams/odisha-kalingas-logo.jpeg',
        city: 'Odisha',
        jerseyColor: '#4B0082', // Royal Purple
        foundedYear: 2024,
        coach: 'TBA',
        description: 'Odisha Kalingas - The pride of Odisha in the Indian Women Kabaddi League. Representing the rich cultural heritage and warrior spirit of Kalinga.',
        socialMedia: {
          twitter: 'https://twitter.com/odishakalingas',
          instagram: 'https://instagram.com/odishakalingas',
          facebook: 'https://facebook.com/odishakalingas',
        },
        isActive: true,
      },
    })

    console.log('Created team:', team.name)

    // Create points table entry
    const pointsEntry = await prisma.pointsTableEntry.create({
      data: {
        seasonId: season.id,
        teamId: team.id,
        position: 0,
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        ties: 0,
        points: 0,
        raidPoints: 0,
        tacklePoints: 0,
        scoreFor: 0,
        scoreAgainst: 0,
        scoreDifference: 0,
      },
    })

    console.log('Created points table entry for Odisha Kalingas')

    console.log('✅ Odisha Kalingas team added successfully!')
    console.log('Team ID:', team.id)
    console.log('Slug: odisha-kalingas')
    console.log('Route: /teams/odisha-kalingas')

    return team
  } catch (error) {
    console.error('Error adding Odisha Kalingas team:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
addOdishaKalingas()

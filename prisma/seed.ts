import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Only run seed if explicitly enabled via environment variable
  if (process.env.RUN_SEED !== 'true') {
    console.log('Seed skipped. Set RUN_SEED=true to run seed.')
    return
  }

  console.log('Starting seed...')

  // Create default admin user (only if doesn't exist)
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@iwkl.com' }
  })

  let admin
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10)
    admin = await prisma.user.create({
      data: {
        email: 'admin@iwkl.com',
        name: 'Super Admin',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isVerified: true,
      },
    })
    console.log('Created admin user:', admin.email)
  } else {
    admin = existingAdmin
    console.log('Admin user already exists, skipping creation')
  }

  console.log('Admin user processed')

  // Create IWKL 2026 Season (only if doesn't exist)
  const existingSeason = await prisma.season.findUnique({
    where: { name: 'IWKL 2026' }
  })

  let season
  if (!existingSeason) {
    season = await prisma.season.create({
      data: {
        name: 'IWKL 2026',
        year: 2026,
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-12-31'),
        isActive: true,
        isCompleted: false,
        description: 'Indian Women Kabaddi League 2026 Season',
      },
    })
    console.log('Created season:', season.name)
  } else {
    season = existingSeason
    console.log('Season already exists, skipping creation')
  }

  // Create 10 Official Teams
  const teamsData = [
    { name: 'Ayodhya Shakti', shortName: 'AYO', city: 'Ayodhya', logo: '/team-logos/Ayodhya_shakti.jpeg' },
    { name: 'Delhi Warriors', shortName: 'DEL', city: 'Delhi', logo: '/team-logos/Delhi_warriors.jpeg' },
    { name: 'Garvi Gujarat', shortName: 'GGU', city: 'Gujarat', logo: '/team-logos/Garvi_Gujarat.jpeg' },
    { name: 'Haryanvi Fighters', shortName: 'HAR', city: 'Haryana', logo: '/team-logos/Haryanvi_fighters.jpeg' },
    { name: 'Kashmiri Queens', shortName: 'KAS', city: 'Kashmir', logo: '/team-logos/Kashmiri_Queens.jpeg' },
    { name: 'Kolkata Rangers', shortName: 'KOL', city: 'Kolkata', logo: '/team-logos/Kolkata_rengers.jpeg' },
    { name: 'Mumbai Strikers', shortName: 'MUM', city: 'Mumbai', logo: '/team-logos/mumbai_strkerrs.jpeg' },
    { name: 'Namma Bengaluru', shortName: 'BEN', city: 'Bengaluru', logo: '/team-logos/Namma_Bengaluru.jpeg' },
    { name: 'Odisha Kalingas', shortName: 'OKL', city: 'Odisha', logo: '/teams/odisha-kalingas-logo.jpeg' },
    { name: 'Punjab Wings', shortName: 'PUN', city: 'Punjab', logo: '/team-logos/Punjab_wiings.jpeg' },
  ]

  const teams = []
  for (const teamData of teamsData) {
    const existingTeam = await prisma.team.findUnique({
      where: { 
        name_seasonId: {
          name: teamData.name,
          seasonId: season.id,
        }
      }
    })

    let team
    if (!existingTeam) {
      team = await prisma.team.create({
        data: {
          name: teamData.name,
          shortName: teamData.shortName,
          seasonId: season.id,
          logo: teamData.logo,
          city: teamData.city,
          jerseyColor: '#FF0000',
          foundedYear: 2024,
          coach: 'TBA',
          description: `${teamData.name} - Indian Women Kabaddi League Team`,
          socialMedia: {
            twitter: `https://twitter.com/${teamData.shortName.toLowerCase()}kabaddi`,
            instagram: `https://instagram.com/${teamData.shortName.toLowerCase()}kabaddi`,
            facebook: `https://facebook.com/${teamData.shortName.toLowerCase()}kabaddi`,
          },
          isActive: true,
        },
      })
      console.log('Created team:', team.name)
    } else {
      team = existingTeam
      console.log('Team already exists, skipping:', team.name)
    }
    teams.push(team)
  }

  // Create Points Table Entries for all teams (only if doesn't exist)
  for (let i = 0; i < teams.length; i++) {
    const existingPointsEntry = await prisma.pointsTableEntry.findUnique({
      where: {
        seasonId_teamId: {
          seasonId: season.id,
          teamId: teams[i].id,
        }
      }
    })

    if (!existingPointsEntry) {
      await prisma.pointsTableEntry.create({
        data: {
          seasonId: season.id,
          teamId: teams[i].id,
          position: i + 1,
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
      console.log('Created points entry for:', teams[i].name)
    } else {
      console.log('Points entry already exists, skipping:', teams[i].name)
    }
  }

  // Create News Articles
  const newsData = [
    {
      title: 'IWKL 2026 Official Season Announcement',
      excerpt: 'The Indian Women Kabaddi League announces its exciting 2026 season with new teams and expanded format.',
      content: 'The Indian Women Kabaddi League (IWKL) is thrilled to announce the official launch of the 2026 season. This year promises to be bigger and better with 8 competitive teams representing major cities across India. The season will run from July 2026 to December 2026, featuring intense matches, talented players, and thrilling kabaddi action.',
      category: 'Announcement',
      isFeatured: true,
      isPublished: true,
    },
    {
      title: 'Team Registration Process Begins',
      excerpt: 'Registration for the IWKL 2026 season is now open for all participating teams.',
      content: 'The registration process for IWKL 2026 has officially begun. All 8 teams are required to complete their player registrations, submit squad details, and finalize their team rosters before the season kickoff. The league has implemented new streamlined processes to ensure smooth operations.',
      category: 'Registration',
      isFeatured: true,
      isPublished: true,
    },
    {
      title: 'Women Kabaddi Talent Development Program',
      excerpt: 'IWKL launches comprehensive talent development program to nurture young kabaddi players.',
      content: 'In a landmark initiative, IWKL has launched a comprehensive talent development program aimed at identifying and nurturing young women kabaddi talent across India. The program includes training camps, mentorship from experienced players, and opportunities to showcase skills at the national level.',
      category: 'Development',
      isFeatured: true,
      isPublished: true,
    },
    {
      title: 'Upcoming Player Trials',
      excerpt: 'IWKL announces player trial dates for the 2026 season across multiple cities.',
      content: 'Player trials for the IWKL 2026 season will be conducted across 8 major cities starting next month. Aspiring kabaddi players between the ages of 18-30 are invited to participate. The trials will be conducted by national-level coaches and selectors, providing a platform for talented players to showcase their skills.',
      category: 'Trials',
      isFeatured: false,
      isPublished: true,
    },
    {
      title: 'League Expansion Plans',
      excerpt: 'IWKL reveals ambitious expansion plans for future seasons including new teams and venues.',
      content: 'The Indian Women Kabaddi League has unveiled ambitious expansion plans for the coming years. The league aims to add 4 more teams by 2028, expand to new venues, and introduce international partnerships. This expansion will provide more opportunities for women athletes and grow the sport of kabaddi across the nation.',
      category: 'Expansion',
      isFeatured: false,
      isPublished: true,
    },
  ]

  for (const newsItem of newsData) {
    const slug = newsItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const existingNews = await prisma.news.findUnique({
      where: { slug }
    })

    if (!existingNews) {
      const news = await prisma.news.create({
        data: {
          title: newsItem.title,
          slug: slug,
          excerpt: newsItem.excerpt,
          content: newsItem.content,
          featuredImage: '/placeholder-news/default-news.jpg',
          category: newsItem.category,
          tags: [newsItem.category, 'IWKL 2026'],
          author: 'IWKL Admin',
          isFeatured: newsItem.isFeatured,
          isPublished: newsItem.isPublished,
          publishedAt: new Date(),
          seoTitle: newsItem.title,
          seoDescription: newsItem.excerpt,
          seoKeywords: 'IWKL, kabaddi, women kabaddi, 2026 season',
        },
      })
      console.log('Created news:', news.title)
    } else {
      console.log('News already exists, skipping:', newsItem.title)
    }
  }

  // Create Gallery Items (only if doesn't exist)
  const galleryCategories = ['Matches', 'Events', 'Team Activities', 'Training Camps']
  const galleryItems = []

  for (const category of galleryCategories) {
    for (let i = 1; i <= 3; i++) {
      const title = `${category} - Image ${i}`
      const existingGalleryItem = await prisma.galleryItem.findFirst({
        where: { title }
      })

      if (!existingGalleryItem) {
        const galleryItem = await prisma.galleryItem.create({
          data: {
            title: title,
            description: `Sample image for ${category} category`,
            mediaUrl: `/placeholder-gallery/${category.toLowerCase().replace(' ', '-')}-${i}.jpg`,
            mediaType: 'IMAGE',
            category: category,
            album: category,
            isFeatured: i === 1,
            order: i,
          },
        })
        galleryItems.push(galleryItem)
        console.log('Created gallery item:', galleryItem.title)
      } else {
        galleryItems.push(existingGalleryItem)
        console.log('Gallery item already exists, skipping:', title)
      }
    }
  }

  // Create Homepage Banners (only if doesn't exist)
  const bannersData = [
    {
      title: 'IWKL 2026 Launch',
      subtitle: 'The Season Begins July 2026',
      ctaText: 'Register Now',
      ctaLink: '/register',
    },
    {
      title: 'Women\'s Kabaddi Promotion',
      subtitle: 'Empowering Women Through Sports',
      ctaText: 'Learn More',
      ctaLink: '/about',
    },
    {
      title: 'Season Registration',
      subtitle: 'Team Registration Open',
      ctaText: 'Sign Up',
      ctaLink: '/teams',
    },
    {
      title: 'League Announcement',
      subtitle: '8 Teams, 1 Champion',
      ctaText: 'View Teams',
      ctaLink: '/teams',
    },
  ]

  for (let i = 0; i < bannersData.length; i++) {
    const existingBanner = await prisma.homepageBanner.findFirst({
      where: { title: bannersData[i].title }
    })

    if (!existingBanner) {
      const banner = await prisma.homepageBanner.create({
        data: {
          imageUrl: `/placeholder-banners/banner-${i + 1}.jpg`,
          title: bannersData[i].title,
          subtitle: bannersData[i].subtitle,
          ctaText: bannersData[i].ctaText,
          ctaLink: bannersData[i].ctaLink,
          displayOrder: i,
          isActive: true,
        },
      })
      console.log('Created homepage banner:', banner.title)
    } else {
      console.log('Homepage banner already exists, skipping:', bannersData[i].title)
    }
  }

  // Skip updating points table with sample standings (preserve admin data)
  console.log('Skipping points table standings update to preserve admin data')

  // Create Dummy Matches (20+ matches) - only if doesn't exist
  const venues = ['Delhi Stadium', 'Mumbai Arena', 'Bangalore Sports Complex', 'Kolkata Ground', 'Hyderabad Stadium']
  const matchDates = []
  const startDate = new Date('2026-07-01')
  for (let i = 0; i < 28; i++) {
    const matchDate = new Date(startDate)
    matchDate.setDate(startDate.getDate() + (i * 3))
    matchDates.push(matchDate)
  }

  let matchIndex = 0
  for (let round = 0; round < 4; round++) {
    for (let i = 0; i < teams.length; i += 2) {
      if (i + 1 < teams.length && matchIndex < matchDates.length) {
        const homeTeam = teams[i]
        const awayTeam = teams[i + 1]

        const existingMatch = await prisma.match.findUnique({
          where: {
            seasonId_matchNumber: {
              seasonId: season.id,
              matchNumber: matchIndex + 1,
            }
          }
        })

        let match
        if (!existingMatch) {
          match = await prisma.match.create({
            data: {
              seasonId: season.id,
              homeTeamId: homeTeam.id,
              awayTeamId: awayTeam.id,
              matchDate: matchDates[matchIndex],
              venue: venues[matchIndex % venues.length],
              status: round === 0 ? 'COMPLETED' : (round === 1 ? 'LIVE' : 'SCHEDULED'),
              matchType: 'LEAGUE_MATCH',
              matchNumber: matchIndex + 1,
              week: Math.floor(matchIndex / 4) + 1,
              homeScore: round === 0 ? Math.floor(Math.random() * 20) + 30 : 0,
              awayScore: round === 0 ? Math.floor(Math.random() * 20) + 30 : 0,
            },
          })
          console.log('Created match:', `${homeTeam.name} vs ${awayTeam.name}`)

          // Create match result for completed matches
          if (round === 0) {
            const winnerId = match.homeScore > match.awayScore ? homeTeam.id : awayTeam.id
            const existingResult = await prisma.matchResult.findUnique({
              where: { matchId: match.id }
            })

            if (!existingResult) {
              await prisma.matchResult.create({
                data: {
                  matchId: match.id,
                  homeScore: match.homeScore,
                  awayScore: match.awayScore,
                  winnerId: winnerId,
                  manOfTheMatch: 'Player ' + (matchIndex + 1),
                },
              })
            }
          }
        } else {
          console.log('Match already exists, skipping:', `${homeTeam.name} vs ${awayTeam.name}`)
        }

        matchIndex++
      }
    }
  }

  // Create Dummy Leadership Data (only if doesn't exist)
  const leadershipData = [
    {
      name: 'Rajesh Kumar',
      designation: 'Founder & Chairman',
      description: 'Visionary leader with 20+ years of experience in sports management. Founded IWKL to promote women\'s kabaddi in India.',
      photo: '/placeholder-leadership/founder.jpg',
      order: 1,
    },
    {
      name: 'Priya Sharma',
      designation: 'League Director',
      description: 'Former national kabaddi player with extensive experience in sports administration. Leading the strategic direction of IWKL.',
      photo: '/placeholder-leadership/director.jpg',
      order: 2,
    },
    {
      name: 'Amit Verma',
      designation: 'Operations Head',
      description: 'Expert in sports event management and operations. Ensures smooth execution of all league activities.',
      photo: '/placeholder-leadership/operations.jpg',
      order: 3,
    },
    {
      name: 'Sneha Patel',
      designation: 'Technical Director',
      description: 'Former international kabaddi referee. Oversees all technical aspects of match management and player development.',
      photo: '/placeholder-leadership/technical.jpg',
      order: 4,
    },
  ]

  for (const leader of leadershipData) {
    const existingLeader = await prisma.leadership.findFirst({
      where: { name: leader.name }
    })

    if (!existingLeader) {
      await prisma.leadership.create({
        data: {
          ...leader,
          isActive: true,
        },
      })
      console.log('Created leadership:', leader.name)
    } else {
      console.log('Leadership already exists, skipping:', leader.name)
    }
  }

  // Create Dummy Fan Club Registrations (20+) - only if doesn't exist
  const fanNames = [
    'Anjali Singh', 'Priya Gupta', 'Riya Mehta', 'Sneha Reddy', 'Kavita Nair',
    'Divya Sharma', 'Pooja Verma', 'Neha Kapoor', 'Rashmi Iyer', 'Meera Joshi',
    'Lakshmi Devi', 'Sunita Rao', 'Anita Desai', 'Kiran Bedi', 'Jaya Prada',
    'Rekha Menon', 'Saroja Devi', 'Padma Lakshmi', 'Shalini Kumar', 'Geeta Singh',
  ]
  const fanCities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Hyderabad', 'Chennai', 'Pune', 'Jaipur']
  const fanStates = ['Delhi', 'Maharashtra', 'Karnataka', 'West Bengal', 'Telangana', 'Tamil Nadu', 'Maharashtra', 'Rajasthan']

  for (let i = 0; i < fanNames.length; i++) {
    const randomTeam = teams[Math.floor(Math.random() * teams.length)]
    const randomCityIndex = Math.floor(Math.random() * fanCities.length)
    const email = fanNames[i].toLowerCase().replace(' ', '.') + '@gmail.com'

    const existingFan = await prisma.fanClubRegistration.findFirst({
      where: { email }
    })

    if (!existingFan) {
      try {
        await prisma.fanClubRegistration.create({
          data: {
            fullName: fanNames[i],
            mobileNumber: '+91-' + Math.floor(Math.random() * 9000000000 + 1000000000),
            email: email,
            city: fanCities[randomCityIndex],
            state: fanStates[randomCityIndex],
            gender: 'Female',
            age: Math.floor(Math.random() * 20) + 18,
            favoriteTeamId: randomTeam.id,
          },
        })
        console.log('Created fan registration:', fanNames[i])
      } catch (error) {
        console.log('Error creating fan registration:', fanNames[i])
      }
    } else {
      console.log('Fan registration already exists, skipping:', fanNames[i])
    }
  }

  // Seed IWKL Unplugged Categories (only if doesn't exist)
  console.log('Seeding IWKL Unplugged categories...')
  const categories = [
    {
      name: 'Unplugged',
      slug: 'unplugged',
      description: 'Exclusive behind-the-scenes content and player stories',
      displayOrder: 0,
    },
    {
      name: 'Player Stories',
      slug: 'player-stories',
      description: 'Inspiring journeys of IWKL players',
      displayOrder: 1,
    },
    {
      name: 'Match Highlights',
      slug: 'match-highlights',
      description: 'Best moments from IWKL matches',
      displayOrder: 2,
    },
    {
      name: 'Best Moments',
      slug: 'best-moments',
      description: 'Most memorable moments in IWKL history',
      displayOrder: 3,
    },
  ]

  const createdCategories: any[] = []
  for (const category of categories) {
    const existingCategory = await prisma.videoCategory.findUnique({
      where: { slug: category.slug }
    })

    if (!existingCategory) {
      try {
        const created = await prisma.videoCategory.create({
          data: category,
        })
        createdCategories.push(created)
        console.log('Created category:', category.name)
      } catch (error) {
        console.log('Error creating category:', category.name)
      }
    } else {
      createdCategories.push(existingCategory)
      console.log('Category already exists, skipping:', category.name)
    }
  }

  // Seed IWKL Unplugged Videos (only if doesn't exist)
  console.log('Seeding IWKL Unplugged videos...')
  const videos = [
    {
      categoryId: createdCategories[0]?.id, // Unplugged
      title: 'IWKL Unplugged - Episode 1',
      description: 'Behind the scenes of IWKL teams preparing for the upcoming season.',
      thumbnailUrl: 'https://img.youtube.com/vi/43mCwBLAM5w/maxresdefault.jpg',
      youtubeUrl: 'https://youtu.be/43mCwBLAM5w',
      youtubeVideoId: '43mCwBLAM5w',
      duration: 180,
      displayOrder: 0,
    },
    {
      categoryId: createdCategories[0]?.id, // Unplugged
      title: 'IWKL Highlights - Quick Reel',
      description: 'Quick highlights from recent IWKL matches.',
      thumbnailUrl: 'https://img.youtube.com/vi/4DKgFwYoIbg/maxresdefault.jpg',
      youtubeUrl: 'https://youtube.com/shorts/4DKgFwYoIbg',
      youtubeVideoId: '4DKgFwYoIbg',
      duration: 60,
      displayOrder: 1,
    },
    {
      categoryId: createdCategories[0]?.id, // Unplugged
      title: 'Player Moments - Short',
      description: 'Exciting player moments from IWKL matches.',
      thumbnailUrl: 'https://img.youtube.com/vi/MBtyOpH_euQ/maxresdefault.jpg',
      youtubeUrl: 'https://youtube.com/shorts/MBtyOpH_euQ',
      youtubeVideoId: 'MBtyOpH_euQ',
      duration: 60,
      displayOrder: 2,
    },
    {
      categoryId: createdCategories[0]?.id, // Unplugged
      title: 'Match Action - Quick Clip',
      description: 'Action-packed moments from the latest IWKL matches.',
      thumbnailUrl: 'https://img.youtube.com/vi/pimjbSKEL-w/maxresdefault.jpg',
      youtubeUrl: 'https://youtube.com/shorts/pimjbSKEL-w',
      youtubeVideoId: 'pimjbSKEL-w',
      duration: 60,
      displayOrder: 3,
    },
    {
      categoryId: createdCategories[1]?.id, // Player Stories
      title: 'Star Player Spotlight',
      description: 'Featuring top players from the IWKL league.',
      thumbnailUrl: 'https://img.youtube.com/vi/-vv4cqeaQOU/maxresdefault.jpg',
      youtubeUrl: 'https://youtube.com/shorts/-vv4cqeaQOU',
      youtubeVideoId: '-vv4cqeaQOU',
      duration: 60,
      displayOrder: 0,
    },
    {
      categoryId: createdCategories[2]?.id, // Match Highlights
      title: 'Match Highlights - Quick',
      description: 'Quick highlights from the latest IWKL match.',
      thumbnailUrl: 'https://img.youtube.com/vi/7pjmIMi-TK0/maxresdefault.jpg',
      youtubeUrl: 'https://youtube.com/shorts/7pjmIMi-TK0',
      youtubeVideoId: '7pjmIMi-TK0',
      duration: 60,
      displayOrder: 0,
    },
    {
      categoryId: createdCategories[3]?.id, // Best Moments
      title: 'Best Moments Compilation',
      description: 'Compilation of the best moments from IWKL matches.',
      thumbnailUrl: 'https://img.youtube.com/vi/ZtgjrqwPMuE/maxresdefault.jpg',
      youtubeUrl: 'https://youtube.com/shorts/ZtgjrqwPMuE',
      youtubeVideoId: 'ZtgjrqwPMuE',
      duration: 60,
      displayOrder: 0,
    },
  ]

  for (const video of videos) {
    const existingVideo = await prisma.video.findFirst({
      where: { title: video.title }
    })

    if (!existingVideo) {
      try {
        await prisma.video.create({
          data: {
            ...video,
            publishedAt: new Date(),
          },
        })
        console.log('Created video:', video.title)
      } catch (error) {
        console.log('Error creating video:', video.title)
      }
    } else {
      console.log('Video already exists, skipping:', video.title)
    }
  }

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyNewData() {
  console.log('=== Verifying New Dummy Data ===\n')

  // Verify Matches
  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true, result: true }
  })
  console.log(`✓ Matches: ${matches.length} matches found`)
  const completedMatches = matches.filter(m => m.status === 'COMPLETED')
  const liveMatches = matches.filter(m => m.status === 'LIVE')
  const scheduledMatches = matches.filter(m => m.status === 'SCHEDULED')
  console.log(`  - Completed: ${completedMatches.length}`)
  console.log(`  - Live: ${liveMatches.length}`)
  console.log(`  - Scheduled: ${scheduledMatches.length}`)

  // Verify Leadership
  const leadership = await prisma.leadership.findMany()
  console.log(`\n✓ Leadership: ${leadership.length} members found`)
  leadership.forEach(leader => console.log(`  - ${leader.name} (${leader.designation})`))

  // Verify Fan Club Registrations
  const fanClub = await prisma.fanClubRegistration.findMany({
    include: { favoriteTeam: true }
  })
  console.log(`\n✓ Fan Club Registrations: ${fanClub.length} registrations found`)
  fanClub.slice(0, 5).forEach(reg => console.log(`  - ${reg.fullName} (${reg.favoriteTeam.name})`))
  if (fanClub.length > 5) console.log(`  ... and ${fanClub.length - 5} more`)

  console.log('\n=== Verification Complete ===')
}

verifyNewData()
  .catch((e) => {
    console.error('Verification failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

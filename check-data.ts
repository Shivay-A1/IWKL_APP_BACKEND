import { PrismaClient } from '@prisma/client'

const RAILWAY_DB_URL = 'postgresql://postgres:OtsJhReNdlCbGQCgKPLcfFnDAazNrHar@sakura.proxy.rlwy.net:12624/railway'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: RAILWAY_DB_URL
    }
  }
})

async function checkData() {
  try {
    await prisma.$connect()
    console.log('Connected to Railway database')
    
    const teamsCount = await prisma.team.count()
    console.log('Teams count:', teamsCount)
    
    const pointsCount = await prisma.pointsTableEntry.count()
    console.log('Points table count:', pointsCount)
    
    if (teamsCount > 0) {
      const teams = await prisma.team.findMany({ take: 5 })
      console.log('Sample teams:', teams.map(t => ({ name: t.name, shortName: t.shortName })))
    }
    
    if (pointsCount > 0) {
      const points = await prisma.pointsTableEntry.findMany({ take: 5, include: { team: true, season: true } })
      console.log('Sample points:', points.map(p => ({ team: p.team?.name, points: p.points })))
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()

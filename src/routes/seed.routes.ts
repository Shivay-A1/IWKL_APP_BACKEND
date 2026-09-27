import { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import { prisma } from '../config';
import bcrypt from 'bcryptjs';

const execAsync = promisify(exec);
const router = Router();

// POST /api/seed - Run database seed script
router.post('/', async (req, res) => {
  try {
    console.log('Starting database seed...');
    
    // Run seed script with correct path for Railway
    const { stdout, stderr } = await execAsync('RUN_SEED=true npx ts-node prisma/seed.ts', {
      cwd: process.cwd()
    });
    
    console.log('Seed output:', stdout);
    
    if (stderr) {
      console.error('Seed errors:', stderr);
    }
    
    res.json({
      success: true,
      message: 'Database seeded successfully',
      output: stdout
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

// POST /api/seed/admin - Create admin user
router.post('/admin', async (req, res) => {
  try {
    console.log('Creating admin user...');
    
    const { email = 'admin@iwkl.com', password = 'Admin@123', name = 'Super Admin' } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingAdmin) {
      return res.json({
        success: true,
        message: 'Admin user already exists',
        email: existingAdmin.email
      });
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        email,
        mobile: '9876543210', // Default mobile for admin
        firstName: name,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isVerified: true,
      },
    });
    
    console.log('Created admin user:', admin.email);
    
    res.json({
      success: true,
      message: 'Admin user created successfully',
      email: admin.email,
      password: password // Return password for reference
    });
  } catch (error: any) {
    console.error('Admin creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin user',
      error: error.message
    });
  }
});

// POST /api/seed/teams - Create sample teams
router.post('/teams', async (req, res) => {
  try {
    console.log('Creating sample teams...');
    
    // First create a season if it doesn't exist
    const season = await prisma.season.upsert({
      where: { name: 'IWKL 2026' },
      update: {},
      create: {
        name: 'IWKL 2026',
        year: 2026,
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-12-31'),
        isActive: true,
        isCompleted: false,
        description: 'Indian Women Kabaddi League 2026 Season',
      },
    });
    
    console.log('Season processed:', season.name);
    
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
    ];
    
    const createdTeams = [];
    for (const teamData of teamsData) {
      const existingTeam = await prisma.team.findUnique({
        where: { 
          name_seasonId: {
            name: teamData.name,
            seasonId: season.id,
          }
        }
      });
      
      if (!existingTeam) {
        const team = await prisma.team.create({
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
        });
        createdTeams.push(team);
        console.log('Created team:', team.name);
      } else {
        createdTeams.push(existingTeam);
        console.log('Team already exists:', existingTeam.name);
      }
    }
    
    res.json({
      success: true,
      message: 'Teams created successfully',
      teams: createdTeams.map(t => ({ id: t.id, name: t.name, shortName: t.shortName, logo: t.logo }))
    });
  } catch (error: any) {
    console.error('Teams creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create teams',
      error: error.message
    });
  }
});

export default router;

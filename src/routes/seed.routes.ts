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
    
    // Run seed script
    const { stdout, stderr } = await execAsync('RUN_SEED=true npx ts-node prisma/seed.ts', {
      cwd: '/app/backend'
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
        name,
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

export default router;

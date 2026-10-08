import { PrismaClient } from '@prisma/client';

// Check DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_PRIVATE_URL;

// Initialize Prisma client if DATABASE_URL is available
let prisma: PrismaClient | null = null;

if (databaseUrl) {
  try {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
    console.log('✅ Prisma client initialized');
    
    // Initialize database schema on startup
    initializeDatabase(prisma);
  } catch (error) {
    console.error('Failed to create Prisma client:', error);
  }
} else {
  console.warn('⚠️ DATABASE_URL not set - Prisma client will be null');
}

// Initialize database and ensure schema is up to date
async function initializeDatabase(prismaInstance: PrismaClient) {
  try {
    // Check if thumbnailUrl is still required and make it optional if needed
    const result = await prismaInstance.$queryRawUnsafe(`
      SELECT column_name, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'Video' 
      AND column_name = 'thumbnailUrl'
    `);
    
    const thumbnailColumn = result as any[];
    if (thumbnailColumn.length > 0 && thumbnailColumn[0].is_nullable === 'NO') {
      console.log('Making thumbnailUrl optional...');
      await prismaInstance.$executeRawUnsafe(`
        ALTER TABLE "Video" ALTER COLUMN "thumbnailUrl" DROP NOT NULL;
      `);
      console.log('✓ thumbnailUrl is now optional');
    }
    
    // Check if categoryId is still required and make it optional if needed
    const categoryResult = await prismaInstance.$queryRawUnsafe(`
      SELECT column_name, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'Video' 
      AND column_name = 'categoryId'
    `);
    
    const categoryColumn = categoryResult as any[];
    if (categoryColumn.length > 0 && categoryColumn[0].is_nullable === 'NO') {
      console.log('Making categoryId optional...');
      await prismaInstance.$executeRawUnsafe(`
        ALTER TABLE "Video" ALTER COLUMN "categoryId" DROP NOT NULL;
      `);
      console.log('✓ categoryId is now optional');
    }
  } catch (error) {
    console.log('Schema check skipped or failed:', error);
  }
}

// Export the prisma instance
export default prisma;

// Graceful shutdown
process.on('beforeExit', async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
});

process.on('SIGINT', async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
  process.exit(0);
});

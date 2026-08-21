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
  } catch (error) {
    console.error('Failed to create Prisma client:', error);
  }
} else {
  console.warn('⚠️ DATABASE_URL not set - Prisma client will be null');
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

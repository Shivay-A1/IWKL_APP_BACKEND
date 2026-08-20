import { PrismaClient } from '@prisma/client';

// Use DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_PRIVATE_URL;

// Lazy initialization - only create Prisma client when needed
let prisma: PrismaClient | null = null;

const getPrismaClient = () => {
  if (!prisma) {
    if (!databaseUrl) {
      console.warn('⚠️ DATABASE_URL not set - returning null Prisma client');
      return null;
    }
    try {
      prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      });
    } catch (error) {
      console.error('Failed to create Prisma client:', error);
      return null;
    }
  }
  return prisma;
};

// Export the function, not the result
export default getPrismaClient;

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

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
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }
  return prisma;
};

// Export a function that returns the Prisma client
export default getPrismaClient();

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

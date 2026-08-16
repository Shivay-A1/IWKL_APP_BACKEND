import { PrismaClient } from '@prisma/client';

// Use Railway DATABASE_PRIVATE_URL or fallback to DATABASE_URL
const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL;

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // Configure connection pooling for production
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export default prisma;

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

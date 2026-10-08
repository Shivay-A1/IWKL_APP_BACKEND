import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function applyMigration() {
  try {
    console.log('Applying migration: Make video category and thumbnail optional');
    
    // Make categoryId optional
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Video" ALTER COLUMN "categoryId" DROP NOT NULL;
    `);
    console.log('✓ Made categoryId optional');
    
    // Make thumbnailUrl optional
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Video" ALTER COLUMN "thumbnailUrl" DROP NOT NULL;
    `);
    console.log('✓ Made thumbnailUrl optional');
    
    console.log('✅ Migration applied successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

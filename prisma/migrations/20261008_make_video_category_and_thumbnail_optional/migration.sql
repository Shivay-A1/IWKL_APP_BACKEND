-- Make categoryId optional in Video table
ALTER TABLE "Video" ALTER COLUMN "categoryId" DROP NOT NULL;

-- Make thumbnailUrl optional in Video table
ALTER TABLE "Video" ALTER COLUMN "thumbnailUrl" DROP NOT NULL;

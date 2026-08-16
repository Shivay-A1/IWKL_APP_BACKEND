/*
  Warnings:

  - You are about to drop the column `stadium` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "matchType" TEXT,
ADD COLUMN     "stadiumId" TEXT,
ALTER COLUMN "venue" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "stadium",
ADD COLUMN     "stadiumId" TEXT;

-- CreateTable
CREATE TABLE "Stadium" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "capacity" INTEGER,
    "image" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stadium_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Stadium_isActive_idx" ON "Stadium"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Stadium_name_city_key" ON "Stadium"("name", "city");

-- CreateIndex
CREATE INDEX "Match_stadiumId_idx" ON "Match"("stadiumId");

-- CreateIndex
CREATE INDEX "Team_stadiumId_idx" ON "Team"("stadiumId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_stadiumId_fkey" FOREIGN KEY ("stadiumId") REFERENCES "Stadium"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_stadiumId_fkey" FOREIGN KEY ("stadiumId") REFERENCES "Stadium"("id") ON DELETE SET NULL ON UPDATE CASCADE;

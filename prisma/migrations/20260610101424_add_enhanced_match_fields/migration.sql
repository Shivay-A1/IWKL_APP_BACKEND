/*
  Warnings:

  - The `matchType` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `draws` on the `PointsTableEntry` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `PointsTableEntry` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('LEAGUE_MATCH', 'ELIMINATOR', 'QUALIFIER_1', 'QUALIFIER_2', 'SEMI_FINAL', 'FINAL');

-- DropIndex
DROP INDEX "PointsTableEntry_rank_idx";

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "awayAllOutCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "awayBonusPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "awayRaidPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "awayScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "awayTacklePoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "broadcaster" TEXT,
ADD COLUMN     "halfTimeStatus" TEXT,
ADD COLUMN     "homeAllOutCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "homeBonusPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "homeRaidPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "homeScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "homeTacklePoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "matchBanner" TEXT,
ADD COLUMN     "matchTimer" TEXT,
ADD COLUMN     "matchTitle" TEXT,
ADD COLUMN     "referee" TEXT,
ADD COLUMN     "toss" TEXT,
DROP COLUMN "matchType",
ADD COLUMN     "matchType" "MatchType" DEFAULT 'LEAGUE_MATCH';

-- AlterTable
ALTER TABLE "PointsTableEntry" DROP COLUMN "draws",
DROP COLUMN "rank",
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "raidPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tacklePoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ties" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Match_matchType_idx" ON "Match"("matchType");

-- CreateIndex
CREATE INDEX "PointsTableEntry_position_idx" ON "PointsTableEntry"("position");

-- DropForeignKey
ALTER TABLE "gameshows" DROP CONSTRAINT "gameshows_creatorId_fkey";

-- AlterTable
ALTER TABLE "gameshows" ADD COLUMN     "isOfficial" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "creatorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "gameshows" ADD CONSTRAINT "gameshows_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "reactionCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "reactionCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "review" ADD COLUMN     "reactionCount" INTEGER NOT NULL DEFAULT 0;

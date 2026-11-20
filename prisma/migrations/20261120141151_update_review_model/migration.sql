/*
  Warnings:

  - Added the required column `type` to the `commentLike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `reviewLike` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContentReactionType" AS ENUM ('LIKE', 'DISLIKE', 'LOVE', 'LAUGH', 'WOW', 'SAD', 'ANGRY');

-- DropIndex
DROP INDEX "commentLike_commentId_idx";

-- DropIndex
DROP INDEX "reviewLike_reviewId_idx";

-- AlterTable
ALTER TABLE "commentLike" ADD COLUMN "type" "ContentReactionType";

-- AlterTable
ALTER TABLE "reviewLike" ADD COLUMN "type" "ContentReactionType";

-- Existing likes are migrated as explicit LIKE reactions; new rows have no default.
UPDATE "commentLike" SET "type" = 'LIKE' WHERE "type" IS NULL;
UPDATE "reviewLike" SET "type" = 'LIKE' WHERE "type" IS NULL;

-- AlterTable
ALTER TABLE "commentLike" ALTER COLUMN "type" SET NOT NULL;

-- AlterTable
ALTER TABLE "reviewLike" ALTER COLUMN "type" SET NOT NULL;

-- CreateIndex
CREATE INDEX "commentLike_commentId_type_idx" ON "commentLike"("commentId", "type");

-- CreateIndex
CREATE INDEX "reviewLike_reviewId_type_idx" ON "reviewLike"("reviewId", "type");

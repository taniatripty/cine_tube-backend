/*
  Warnings:

  - The values [RENT] on the enum `AccessType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentPurpose" AS ENUM ('MEDIA_PURCHASE', 'MEDIA_RENT', 'SUBSCRIPTION');

-- CreateEnum
CREATE TYPE "RentDuration" AS ENUM ('MONTH', 'YEAR');

-- AlterEnum
BEGIN;
CREATE TYPE "AccessType_new" AS ENUM ('PURCHASE', 'RENT_MONTH', 'RENT_YEAR', 'SUBSCRIPTION');
ALTER TABLE "mediaAccess" ALTER COLUMN "type" TYPE "AccessType_new" USING ("type"::text::"AccessType_new");
ALTER TYPE "AccessType" RENAME TO "AccessType_old";
ALTER TYPE "AccessType_new" RENAME TO "AccessType";
DROP TYPE "public"."AccessType_old";
COMMIT;

-- DropIndex
DROP INDEX "mediaAccess_paymentId_key";

-- DropIndex
DROP INDEX "mediaAccess_userId_idx";

-- DropIndex
DROP INDEX "mediaAccess_userId_mediaId_key";

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "monthlyRentPrice" DECIMAL(10,2),
ADD COLUMN     "purchasePrice" DECIMAL(10,2),
ADD COLUMN     "yearlyRentPrice" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "mediaAccess" ALTER COLUMN "paymentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "purpose" "PaymentPurpose" NOT NULL DEFAULT 'MEDIA_PURCHASE',
ADD COLUMN     "rentDuration" "RentDuration";

-- CreateIndex
CREATE INDEX "mediaAccess_userId_mediaId_expiresAt_idx" ON "mediaAccess"("userId", "mediaId", "expiresAt");

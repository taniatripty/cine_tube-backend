/*
  Warnings:

  - You are about to drop the `ReviewLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `content_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `media_access` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReviewLike" DROP CONSTRAINT "ReviewLike_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "ReviewLike" DROP CONSTRAINT "ReviewLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ReviewToTag" DROP CONSTRAINT "_ReviewToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "content_reports" DROP CONSTRAINT "content_reports_commentId_fkey";

-- DropForeignKey
ALTER TABLE "content_reports" DROP CONSTRAINT "content_reports_reporterId_fkey";

-- DropForeignKey
ALTER TABLE "content_reports" DROP CONSTRAINT "content_reports_resolvedBy_fkey";

-- DropForeignKey
ALTER TABLE "content_reports" DROP CONSTRAINT "content_reports_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "media_access" DROP CONSTRAINT "media_access_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "media_access" DROP CONSTRAINT "media_access_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "media_access" DROP CONSTRAINT "media_access_userId_fkey";

-- DropTable
DROP TABLE "ReviewLike";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "content_reports";

-- DropTable
DROP TABLE "media_access";

-- CreateTable
CREATE TABLE "contentReports" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "targetType" "ReportTargetType" NOT NULL,
    "reviewId" TEXT,
    "commentId" TEXT,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contentReports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mediaAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "type" "AccessType" NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mediaAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviewLike" (
    "userId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviewLike_pkey" PRIMARY KEY ("userId","reviewId")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contentReports_reporterId_idx" ON "contentReports"("reporterId");

-- CreateIndex
CREATE INDEX "contentReports_status_idx" ON "contentReports"("status");

-- CreateIndex
CREATE INDEX "contentReports_reviewId_idx" ON "contentReports"("reviewId");

-- CreateIndex
CREATE INDEX "contentReports_commentId_idx" ON "contentReports"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "mediaAccess_paymentId_key" ON "mediaAccess"("paymentId");

-- CreateIndex
CREATE INDEX "mediaAccess_userId_idx" ON "mediaAccess"("userId");

-- CreateIndex
CREATE INDEX "mediaAccess_mediaId_idx" ON "mediaAccess"("mediaId");

-- CreateIndex
CREATE INDEX "mediaAccess_expiresAt_idx" ON "mediaAccess"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "mediaAccess_userId_mediaId_key" ON "mediaAccess"("userId", "mediaId");

-- CreateIndex
CREATE INDEX "reviewLike_reviewId_idx" ON "reviewLike"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE INDEX "tag_name_idx" ON "tag"("name");

-- AddForeignKey
ALTER TABLE "contentReports" ADD CONSTRAINT "contentReports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contentReports" ADD CONSTRAINT "contentReports_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contentReports" ADD CONSTRAINT "contentReports_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contentReports" ADD CONSTRAINT "contentReports_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mediaAccess" ADD CONSTRAINT "mediaAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mediaAccess" ADD CONSTRAINT "mediaAccess_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mediaAccess" ADD CONSTRAINT "mediaAccess_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewLike" ADD CONSTRAINT "reviewLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewLike" ADD CONSTRAINT "reviewLike_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReviewToTag" ADD CONSTRAINT "_ReviewToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

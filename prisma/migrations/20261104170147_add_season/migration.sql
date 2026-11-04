/*
  Warnings:

  - You are about to drop the `MediaAvailability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StreamingPlatform` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MediaAvailability" DROP CONSTRAINT "MediaAvailability_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "MediaAvailability" DROP CONSTRAINT "MediaAvailability_platformId_fkey";

-- DropTable
DROP TABLE "MediaAvailability";

-- DropTable
DROP TABLE "StreamingPlatform";

-- CreateTable
CREATE TABLE "episode" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "synopsis" TEXT,
    "runtime" INTEGER,
    "thumbnail" TEXT,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mediaAvailabilities" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "streamingUrl" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'GLOBAL',
    "availableFrom" TIMESTAMP(3),
    "availableUntil" TIMESTAMP(3),

    CONSTRAINT "mediaAvailabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "season" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "title" TEXT,

    CONSTRAINT "season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streamingPlatforms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "streamingPlatforms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "episode_seasonId_idx" ON "episode"("seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "episode_seasonId_episodeNumber_key" ON "episode"("seasonId", "episodeNumber");

-- CreateIndex
CREATE INDEX "mediaAvailabilities_platformId_idx" ON "mediaAvailabilities"("platformId");

-- CreateIndex
CREATE UNIQUE INDEX "mediaAvailabilities_mediaId_platformId_region_key" ON "mediaAvailabilities"("mediaId", "platformId", "region");

-- CreateIndex
CREATE INDEX "season_mediaId_idx" ON "season"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "season_mediaId_seasonNumber_key" ON "season"("mediaId", "seasonNumber");

-- CreateIndex
CREATE UNIQUE INDEX "streamingPlatforms_name_key" ON "streamingPlatforms"("name");

-- CreateIndex
CREATE INDEX "streamingPlatforms_name_idx" ON "streamingPlatforms"("name");

-- AddForeignKey
ALTER TABLE "episode" ADD CONSTRAINT "episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mediaAvailabilities" ADD CONSTRAINT "mediaAvailabilities_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mediaAvailabilities" ADD CONSTRAINT "mediaAvailabilities_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "streamingPlatforms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "season" ADD CONSTRAINT "season_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "MediaAvailability" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "streamingUrl" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'GLOBAL',
    "availableFrom" TIMESTAMP(3),
    "availableUntil" TIMESTAMP(3),

    CONSTRAINT "MediaAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamingPlatform" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StreamingPlatform_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MediaAvailability_platformId_idx" ON "MediaAvailability"("platformId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaAvailability_mediaId_platformId_region_key" ON "MediaAvailability"("mediaId", "platformId", "region");

-- CreateIndex
CREATE UNIQUE INDEX "StreamingPlatform_name_key" ON "StreamingPlatform"("name");

-- AddForeignKey
ALTER TABLE "MediaAvailability" ADD CONSTRAINT "MediaAvailability_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAvailability" ADD CONSTRAINT "MediaAvailability_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "StreamingPlatform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

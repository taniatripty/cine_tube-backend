/*
  Warnings:

  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CreditRole" AS ENUM ('DIRECTOR', 'WRITER', 'ACTOR', 'PRODUCER', 'CINEMATOGRAPHER');

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "Media";

-- DropTable
DROP TABLE "Person";

-- CreateTable
CREATE TABLE "genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "poster" TEXT,
    "backdrop" TEXT,
    "type" "MediaType" NOT NULL,
    "releaseDate" TIMESTAMP(3),
    "releaseYear" INTEGER,
    "runtime" INTEGER,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "price" DECIMAL(10,2),
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "status" "MediaStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mediaCredits" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "role" "CreditRole" NOT NULL,
    "characterName" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "mediaCredits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "biography" TEXT,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GenreToMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GenreToMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "media_title_idx" ON "media"("title");

-- CreateIndex
CREATE INDEX "media_releaseDate_idx" ON "media"("releaseDate");

-- CreateIndex
CREATE INDEX "mediaCredits_personId_idx" ON "mediaCredits"("personId");

-- CreateIndex
CREATE INDEX "mediaCredits_mediaId_role_idx" ON "mediaCredits"("mediaId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "mediaCredits_mediaId_personId_role_key" ON "mediaCredits"("mediaId", "personId", "role");

-- CreateIndex
CREATE INDEX "people_name_idx" ON "people"("name");

-- CreateIndex
CREATE INDEX "_GenreToMedia_B_index" ON "_GenreToMedia"("B");

-- AddForeignKey
ALTER TABLE "mediaCredits" ADD CONSTRAINT "mediaCredits_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mediaCredits" ADD CONSTRAINT "mediaCredits_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToMedia" ADD CONSTRAINT "_GenreToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToMedia" ADD CONSTRAINT "_GenreToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

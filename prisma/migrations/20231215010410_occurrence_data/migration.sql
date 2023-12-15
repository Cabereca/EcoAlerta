/*
  Warnings:

  - You are about to drop the column `email` on the `Occurrence` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Occurrence` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Occurrence` table. All the data in the column will be lost.
  - Added the required column `dateTime` to the `Occurrence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Occurrence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Occurrence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Occurrence` table without a default value. This is not possible if the table is not empty.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "OccurenceStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');

-- AlterTable
ALTER TABLE "Occurrence" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "location" geography(Point, 4326) NOT NULL,
ADD COLUMN     "status" "OccurenceStatus" NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "location_idx" ON "Occurrence" USING GIST ("location");

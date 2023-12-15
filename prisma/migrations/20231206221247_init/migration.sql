/*
  Warnings:

  - You are about to drop the `Imageoccurrence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `occurrence` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Imageoccurrence" DROP CONSTRAINT "Imageoccurrence_occurrenceId_fkey";

-- DropForeignKey
ALTER TABLE "occurrence" DROP CONSTRAINT "occurrence_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "occurrence" DROP CONSTRAINT "occurrence_userId_fkey";

-- DropTable
DROP TABLE "Imageoccurrence";

-- DropTable
DROP TABLE "occurrence";

-- CreateTable
CREATE TABLE "ImageOccurrence" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "occurrenceId" TEXT NOT NULL,

    CONSTRAINT "ImageOccurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occurrence" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employeeId" TEXT,

    CONSTRAINT "Occurrence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Occurrence_description_key" ON "Occurrence"("description");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ImageOccurrence" ADD CONSTRAINT "ImageOccurrence_occurrenceId_fkey" FOREIGN KEY ("occurrenceId") REFERENCES "Occurrence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

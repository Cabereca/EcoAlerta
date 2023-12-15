/*
  Warnings:

  - You are about to drop the column `date_time` on the `Occurrence` table. All the data in the column will be lost.
  - You are about to drop the column `employee_id` on the `Occurrence` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Occurrence` table. All the data in the column will be lost.
  - Added the required column `dateTime` to the `Occurrence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Occurrence` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Occurrence" DROP CONSTRAINT "Occurrence_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "Occurrence" DROP CONSTRAINT "Occurrence_user_id_fkey";

-- AlterTable
ALTER TABLE "Occurrence" DROP COLUMN "date_time",
DROP COLUMN "employee_id",
DROP COLUMN "user_id",
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "employeeId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

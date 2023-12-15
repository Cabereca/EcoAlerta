/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Occurrence` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Occurrence` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Occurrence` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Occurrence" DROP CONSTRAINT "Occurrence_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Occurrence" DROP CONSTRAINT "Occurrence_userId_fkey";

-- AlterTable
ALTER TABLE "Occurrence" DROP COLUMN "employeeId",
DROP COLUMN "userId",
ADD COLUMN     "employee_id" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

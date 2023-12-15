-- DropForeignKey
ALTER TABLE "ImageOccurrence" DROP CONSTRAINT "ImageOccurrence_occurrenceId_fkey";

-- AddForeignKey
ALTER TABLE "ImageOccurrence" ADD CONSTRAINT "ImageOccurrence_occurrenceId_fkey" FOREIGN KEY ("occurrenceId") REFERENCES "Occurrence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

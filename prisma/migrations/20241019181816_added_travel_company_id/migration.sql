/*
  Warnings:

  - Added the required column `travel_company_id` to the `TourAgent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TourAgent" ADD COLUMN     "travel_company_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TourAgent" ADD CONSTRAINT "TourAgent_travel_company_id_fkey" FOREIGN KEY ("travel_company_id") REFERENCES "TravelCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

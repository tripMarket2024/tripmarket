/*
  Warnings:

  - You are about to drop the column `tour_id` on the `TourAgent` table. All the data in the column will be lost.
  - Added the required column `last_name` to the `TourAgent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TourAgent" DROP CONSTRAINT "TourAgent_tour_id_fkey";

-- AlterTable
ALTER TABLE "TourAgent" DROP COLUMN "tour_id",
ADD COLUMN     "last_name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ToursAgents" (
    "id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tour_id" TEXT NOT NULL,
    "tour_agent_id" TEXT NOT NULL,

    CONSTRAINT "ToursAgents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ToursAgents" ADD CONSTRAINT "ToursAgents_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "Tours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToursAgents" ADD CONSTRAINT "ToursAgents_tour_agent_id_fkey" FOREIGN KEY ("tour_agent_id") REFERENCES "TourAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

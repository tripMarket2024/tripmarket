/*
  Warnings:

  - You are about to drop the column `attendance_tickets` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `bb_breakfast` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `full_meal` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `hand_8kg_luggage` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `includes_hotel` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `luggage_20kg` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `luggage_30kg` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `ro_without_meal` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `tickets_batumi` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `tickets_kutaisi` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `tickets_tbilisi` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `travel_insurance` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `two_way_transfer` on the `Tours` table. All the data in the column will be lost.
  - Added the required column `features` to the `Tours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tours" DROP COLUMN "attendance_tickets",
DROP COLUMN "bb_breakfast",
DROP COLUMN "full_meal",
DROP COLUMN "hand_8kg_luggage",
DROP COLUMN "includes_hotel",
DROP COLUMN "luggage_20kg",
DROP COLUMN "luggage_30kg",
DROP COLUMN "ro_without_meal",
DROP COLUMN "tickets_batumi",
DROP COLUMN "tickets_kutaisi",
DROP COLUMN "tickets_tbilisi",
DROP COLUMN "travel_insurance",
DROP COLUMN "two_way_transfer",
ADD COLUMN     "features" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TourFeatures" (
    "id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name_ka" TEXT NOT NULL,
    "name_eng" TEXT NOT NULL,

    CONSTRAINT "TourFeatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourFeaturesTours" (
    "id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tour_id" TEXT NOT NULL,
    "tour_feature_id" TEXT NOT NULL,

    CONSTRAINT "TourFeaturesTours_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TourFeaturesTours" ADD CONSTRAINT "TourFeaturesTours_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "Tours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourFeaturesTours" ADD CONSTRAINT "TourFeaturesTours_tour_feature_id_fkey" FOREIGN KEY ("tour_feature_id") REFERENCES "TourFeatures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

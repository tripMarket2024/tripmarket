/*
  Warnings:

  - You are about to drop the column `travelCompanyId` on the `Media` table. All the data in the column will be lost.
  - Added the required column `image_name` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tour_id` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_travelCompanyId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "travelCompanyId",
ADD COLUMN     "image_name" TEXT NOT NULL,
ADD COLUMN     "tour_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TravelCompany" ADD COLUMN     "profile_picture" TEXT,
ADD COLUMN     "profile_picture_url" TEXT;

-- CreateTable
CREATE TABLE "Tours" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description_ka" TEXT,
    "description_eng" TEXT,
    "travel_company_id" TEXT NOT NULL,
    "tickets_kutaisi" BOOLEAN NOT NULL DEFAULT false,
    "tickets_tbilisi" BOOLEAN NOT NULL DEFAULT false,
    "tickets_batumi" BOOLEAN NOT NULL DEFAULT false,
    "includes_hotel" BOOLEAN NOT NULL DEFAULT false,
    "ro_without_meal" BOOLEAN NOT NULL DEFAULT false,
    "bb_breakfast" BOOLEAN NOT NULL DEFAULT false,
    "travel_insurance" BOOLEAN NOT NULL DEFAULT false,
    "hand_8kg_luggage" BOOLEAN NOT NULL DEFAULT false,
    "luggage_20kg" BOOLEAN NOT NULL DEFAULT false,
    "luggage_30kg" BOOLEAN NOT NULL DEFAULT false,
    "attendance_tickets" BOOLEAN NOT NULL DEFAULT false,
    "full_meal" BOOLEAN NOT NULL DEFAULT false,
    "two_way_transfer" BOOLEAN NOT NULL DEFAULT false,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourAgent" (
    "id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description_ka" TEXT,
    "description_eng" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "telegram" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,
    "profile_picture" TEXT,
    "profile_picture_url" TEXT,
    "tour_id" TEXT NOT NULL,

    CONSTRAINT "TourAgent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TourAgent_phone_key" ON "TourAgent"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "TourAgent_email_key" ON "TourAgent"("email");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "Tours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tours" ADD CONSTRAINT "Tours_travel_company_id_fkey" FOREIGN KEY ("travel_company_id") REFERENCES "TravelCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourAgent" ADD CONSTRAINT "TourAgent_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "Tours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

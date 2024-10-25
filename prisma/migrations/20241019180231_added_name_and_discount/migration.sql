/*
  Warnings:

  - Added the required column `name` to the `Tours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tours" ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "name" TEXT NOT NULL;

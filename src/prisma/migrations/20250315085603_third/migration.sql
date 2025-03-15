/*
  Warnings:

  - You are about to alter the column `totalProfit` on the `Year` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - A unique constraint covering the columns `[slug]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Year" ALTER COLUMN "totalProfit" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE INDEX "Page_slug_idx" ON "Page"("slug");

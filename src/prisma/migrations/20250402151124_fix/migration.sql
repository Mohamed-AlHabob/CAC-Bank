-- DropForeignKey
ALTER TABLE "AnnualReport" DROP CONSTRAINT "AnnualReport_yearId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_yearId_fkey";

-- AddForeignKey
ALTER TABLE "AnnualReport" ADD CONSTRAINT "AnnualReport_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Year" (
    "id" TEXT NOT NULL,
    "fiscalYear" TEXT NOT NULL,
    "totalProfit" DECIMAL(65,30),
    "ceosMessage" TEXT,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publication" TIMESTAMP(3),

    CONSTRAINT "Year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnnualReport" (
    "id" TEXT NOT NULL,
    "yearId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnnualReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "yearId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT,
    "initialPromotionalImage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentPageId" TEXT,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Year_fiscalYear_key" ON "Year"("fiscalYear");

-- CreateIndex
CREATE INDEX "Year_fiscalYear_idx" ON "Year"("fiscalYear");

-- CreateIndex
CREATE INDEX "AnnualReport_yearId_idx" ON "AnnualReport"("yearId");

-- CreateIndex
CREATE INDEX "AnnualReport_field_idx" ON "AnnualReport"("field");

-- CreateIndex
CREATE INDEX "Page_yearId_idx" ON "Page"("yearId");

-- CreateIndex
CREATE INDEX "Page_title_idx" ON "Page"("title");

-- CreateIndex
CREATE INDEX "Page_parentPageId_idx" ON "Page"("parentPageId");

-- AddForeignKey
ALTER TABLE "AnnualReport" ADD CONSTRAINT "AnnualReport_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_parentPageId_fkey" FOREIGN KEY ("parentPageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

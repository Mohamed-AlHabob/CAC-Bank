import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Year Actions
export const createYear = async (data: Prisma.YearCreateInput) => {
  return prisma.year.create({ data });
};

export const getYearById = async (id: string) => {
  return prisma.year.findUnique({ where: { id } });
};

export const getYearByFiscalYear = async (fiscalYear: string) => {
  return prisma.year.findUnique({ where: { fiscalYear } });
};

export const getAllYears = async () => {
  return prisma.year.findMany({ orderBy: { fiscalYear: 'asc' } });
};

export const updateYear = async (id: string, data: Prisma.YearUpdateInput) => {
  return prisma.year.update({ where: { id }, data });
};

export const deleteYear = async (id: string) => {
  return prisma.year.delete({ where: { id } });
};

// AnnualReport Actions
export const createAnnualReport = async (data: Prisma.AnnualReportCreateInput) => {
  return prisma.annualReport.create({ data });
};

export const getAnnualReportById = async (id: string) => {
  return prisma.annualReport.findUnique({ where: { id } });
};

export const getAnnualReportsByYear = async (yearId: string) => {
  return prisma.annualReport.findMany({ where: { yearId } });
};

export const getAnnualReportsByField = async (field: string) => {
  return prisma.annualReport.findMany({ where: { field } });
};

export const updateAnnualReport = async (id: string, data: Prisma.AnnualReportUpdateInput) => {
  return prisma.annualReport.update({ where: { id }, data });
};

export const deleteAnnualReport = async (id: string) => {
  return prisma.annualReport.delete({ where: { id } });
};

// Page Actions
export const createPage = async (data: Prisma.PageCreateInput) => {
  return prisma.page.create({ data });
};

export const getPageById = async (id: string) => {
  return prisma.page.findUnique({ 
    where: { id },
    include: { childrenPages: true, parentPage: true }
  });
};

export const getPagesByYear = async (yearId: string) => {
  return prisma.page.findMany({ where: { yearId } });
};

export const getPagesByParent = async (parentPageId: string) => {
  return prisma.page.findMany({ where: { parentPageId } });
};

export const getParentPages = async () => {
  return prisma.page.findMany({ where: { parentPageId: null } });
};

export const updatePage = async (id: string, data: Prisma.PageUpdateInput) => {
  return prisma.page.update({ where: { id }, data });
};

export const deletePage = async (id: string) => {
  return prisma.page.delete({ where: { id } });
};

export const archivePage = async (id: string) => {
  return prisma.page.update({
    where: { id },
    data: { isArchived: true }
  });
};

export const publishPage = async (id: string) => {
  return prisma.page.update({
    where: { id },
    data: { isPublished: true }
  });
};

// Utility Functions
export const getFullYearStructure = async (yearId: string) => {
  return prisma.year.findUnique({
    where: { id: yearId },
    include: {
      annualReports: true,
      pages: {
        include: {
          childrenPages: true
        }
      }
    }
  });
};

export default prisma;
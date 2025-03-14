"use server"

import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

type OperationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

async function handleOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string = "Database operation failed"
): Promise<OperationResult<T>> {
  try {
    const data = await operation()
    return { success: true, data }
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : errorMessage 
    }
  }
}

export async function getLatestYearWithPages(): Promise<OperationResult<Year | null>> {
  return handleOperation(async () => {
    return await prisma.year.findFirst({
      orderBy: { dateCreated: "desc" },
      include: { pages: true },
    });
  }, "Failed to fetch the latest year with pages");
}

export async function getAllYearsWithPages(): Promise<OperationResult<Year[]>> {
  return handleOperation(async () => {
    return await prisma.year.findMany({
      orderBy: { dateCreated: "desc" },
      include: { pages: true },
    });
  }, "Failed to fetch all years with pages");
}

// Revalidation helper
function revalidatePaths(paths: string[]) {
  try {
    paths.forEach(path => revalidatePath(path))
  } catch (error) {
    console.error("Revalidation failed:", error)
  }
}

// Year Actions
export async function createYear(data: Prisma.YearCreateInput): Promise<OperationResult<Year>> {
  const result = await handleOperation(async () => {
    const createdYear = await prisma.year.create({ data })
    revalidatePaths(["/years", "/"])
    return createdYear
  }, "Failed to create fiscal year")
  
  return result
}

export async function getYearById(id: string): Promise<OperationResult<Year | null>> {
  return handleOperation(() => 
    prisma.year.findUnique({
      where: { id },
      include: { annualReports: true, pages: true }
    }),
  "Failed to fetch year details"
  )
}


// Year Actions
export async function getAllYears(): Promise<OperationResult<Year[]>> {
  return handleOperation(async () => {
    return await prisma.year.findMany({
      orderBy: { fiscalYear: "desc" },
    });
  }, "Failed to fetch all years");
}

export async function updateYear(
  id: string,
  data: Prisma.YearUpdateInput
): Promise<OperationResult<Year>> {
  return handleOperation(async () => {
    const updatedYear = await prisma.year.update({
      where: { id },
      data,
    });
    revalidatePaths(["/years", `/years/${id}`, "/"]);
    return updatedYear;
  }, "Failed to update year");
}

export async function deleteYear(id: string): Promise<OperationResult<Year>> {
  return handleOperation(async () => {
    const deletedYear = await prisma.year.delete({
      where: { id },
    });
    revalidatePaths(["/years", `/years/${id}`, "/"]);
    return deletedYear;
  }, "Failed to delete year");
}

// Page Actions
export async function updatePage(
  id: string,
  data: Prisma.PageUpdateInput
): Promise<OperationResult<Page>> {
  return handleOperation(async () => {
    const updatedPage = await prisma.page.update({
      where: { id },
      data,
    });
    revalidatePaths([`/years/${updatedPage.yearId}`, `/pages/${id}`, "/"]);
    return updatedPage;
  }, "Failed to update page");
}

export async function getParentPages(): Promise<OperationResult<Page[]>> {
  return handleOperation(async () => {
    return await prisma.page.findMany({
      where: { parentId: null },
      include: { children: true },
    });
  }, "Failed to fetch parent pages");
}

export async function deletePage(id: string): Promise<OperationResult<Page>> {
  return handleOperation(async () => {
    const deletedPage = await prisma.page.delete({
      where: { id },
    });
    revalidatePaths([`/years/${deletedPage.yearId}`, `/pages/${id}`, "/"]);
    return deletedPage;
  }, "Failed to delete page");
}

// Annual Report Actions
export async function createAnnualReport(
  data: Prisma.AnnualReportCreateInput
): Promise<OperationResult<AnnualReport>> {
  return handleOperation(async () => {
    const report = await prisma.annualReport.create({ data })
    revalidatePaths([`/years/${report.yearId}`])
    return report
  }, "Failed to create annual report")
}

// Page Actions
async function generateUniqueSlug(title: string, existingSlug?: string): Promise<string> {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim()

  if (existingSlug === baseSlug) return existingSlug

  let slug = baseSlug
  let counter = 1

  while (true) {
    const existingPage = await prisma.page.findUnique({ where: { slug } })
    if (!existingPage) return slug
    slug = `${baseSlug}-${counter++}`
  }
}

export async function createPage(
  data: Prisma.PageCreateInput
): Promise<OperationResult<Page>> {
  return handleOperation(async () => {
    const slug = await generateUniqueSlug(data.title)
    const pageData = { ...data, slug }
    
    const createdPage = await prisma.page.create({ data: pageData })
    revalidatePaths([`/years/${createdPage.yearId}`, "/"])
    return createdPage
  }, "Failed to create page")
}

// Query Functions
export async function getPaginatedYears(
  page: number = 1,
  pageSize: number = 10
): Promise<OperationResult<Year[]>> {
  return handleOperation(() =>
    prisma.year.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { fiscalYear: "desc" },
      include: { pages: true }
    }),
  "Failed to fetch years"
  )
}

// System Actions
export async function checkDatabaseConnection(): Promise<OperationResult<boolean>> {
  return handleOperation(async () => {
    await prisma.$queryRaw`SELECT 1`
    return true
  }, "Database connection check failed")
}
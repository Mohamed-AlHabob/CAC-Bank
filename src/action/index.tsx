"use server"

import { PrismaClient, type Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

// Create a singleton Prisma client to prevent multiple instances
let prismaClient: PrismaClient

if (process.env.NODE_ENV === "production") {
  prismaClient = new PrismaClient()
} else {
  // In development, use a global variable to prevent multiple instances during hot reloading
  const globalForPrisma = global as unknown as { prisma?: PrismaClient }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ["query", "error", "warn"],
    })
  }

  prismaClient = globalForPrisma.prisma
}

// Utility function to safely execute database operations
async function safeDbOperation<T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  errorMessage = "Database operation failed",
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    // We can't use toast in server actions, but we log the error
    return fallbackValue
  }
}

// Check database connection
export async function checkDatabaseConnection() {
  try {
    // Simple query to check if database is accessible
    await prismaClient.$queryRaw`SELECT 1`
    return { connected: true, message: "Database connection successful" }
  } catch (error) {
    console.error("Database connection error:", error)
    return {
      connected: false,
      message: "Cannot connect to database. Please check your connection settings.",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function getLatestYearWithPages() {
  return await safeDbOperation(
    async () => {
      return await prismaClient.year.findFirst({
        orderBy: { dateCreated: "desc" },
        include: { pages: true },
      })
    },
    null,
    "Failed to fetch the latest year data",
  )
}

export async function getAllYearsWithPages() {
  return await safeDbOperation(
    async () => {
      return await prismaClient.year.findMany({
        orderBy: { dateCreated: "desc" },
        include: { pages: true },
      })
    },
    [],
    "Failed to fetch years data",
  )
}

// Year Actions
export async function createYear(data: Prisma.YearCreateInput) {
  const result = await safeDbOperation(async () => prismaClient.year.create({ data }), null, "Failed to create year")

  // Revalidate paths after successful creation
  if (result) {
    revalidatePath("/years")
    revalidatePath("/")
  }

  return result
}

export async function getYearById(id: string) {
  return await safeDbOperation(
    async () => prismaClient.year.findUnique({ where: { id } }),
    null,
    "Failed to fetch year details",
  )
}

export async function getYearByFiscalYear(fiscalYear: string) {
  return await safeDbOperation(
    async () => prismaClient.year.findUnique({ where: { fiscalYear } }),
    null,
    "Failed to fetch year by fiscal year",
  )
}

export async function getAllYears() {
  return await safeDbOperation(
    async () => prismaClient.year.findMany({ orderBy: { fiscalYear: "asc" } }),
    [],
    "Failed to fetch years",
  )
}

export async function updateYear(id: string, data: Prisma.YearUpdateInput) {
  const result = await safeDbOperation(
    async () => prismaClient.year.update({ where: { id }, data }),
    null,
    "Failed to update year",
  )

  // Revalidate paths after successful update
  if (result) {
    revalidatePath("/years")
    revalidatePath(`/years/${id}`)
    revalidatePath("/")
  }

  return result
}

export async function deleteYear(id: string) {
  const result = await safeDbOperation(
    async () => prismaClient.year.delete({ where: { id } }),
    null,
    "Failed to delete year",
  )

  // Revalidate paths after successful deletion
  if (result) {
    revalidatePath("/years")
    revalidatePath("/")
  }

  return result
}

// AnnualReport Actions
export async function createAnnualReport(data: Prisma.AnnualReportCreateInput) {
  const result = await safeDbOperation(
    async () => prismaClient.annualReport.create({ data }),
    null,
    "Failed to create annual report",
  )

  if (result) {
    revalidatePath(`/years/${result.yearId}`)
  }

  return result
}

export async function getAnnualReportById(id: string) {
  return await safeDbOperation(
    async () => prismaClient.annualReport.findUnique({ where: { id } }),
    null,
    "Failed to fetch annual report",
  )
}

export async function getAnnualReportsByYear(yearId: string) {
  return await safeDbOperation(
    async () => prismaClient.annualReport.findMany({ where: { yearId } }),
    [],
    "Failed to fetch annual reports for this year",
  )
}

export async function getAnnualReportsByField(field: string) {
  return await safeDbOperation(
    async () => prismaClient.annualReport.findMany({ where: { field } }),
    [],
    "Failed to fetch annual reports by field",
  )
}

export async function updateAnnualReport(id: string, data: Prisma.AnnualReportUpdateInput) {
  const result = await safeDbOperation(
    async () => prismaClient.annualReport.update({ where: { id }, data }),
    null,
    "Failed to update annual report",
  )

  if (result) {
    revalidatePath(`/years/${result.yearId}`)
  }

  return result
}

export async function deleteAnnualReport(id: string) {
  const report = await getAnnualReportById(id)
  const yearId = report?.yearId

  const result = await safeDbOperation(
    async () => prismaClient.annualReport.delete({ where: { id } }),
    null,
    "Failed to delete annual report",
  )

  if (result && yearId) {
    revalidatePath(`/years/${yearId}`)
  }

  return result
}

// Page Actions
export async function createPage(data: Prisma.PageCreateInput) {
  const result = await safeDbOperation(async () => prismaClient.page.create({ data }), null, "Failed to create page")

  if (result) {
    revalidatePath(`/years/${result.yearId}`)
    revalidatePath(`/`)
  }

  return result
}

export async function getPageById(id: string) {
  return await safeDbOperation(
    async () =>
      prismaClient.page.findUnique({
        where: { id },
        include: { childrenPages: true, parentPage: true },
      }),
    null,
    "Failed to fetch page details",
  )
}

export async function getPagesByYear(yearId: string) {
  return await safeDbOperation(
    async () => prismaClient.page.findMany({ where: { yearId } }),
    [],
    "Failed to fetch pages for this year",
  )
}

export async function getPagesByParent(parentPageId: string) {
  return await safeDbOperation(
    async () => prismaClient.page.findMany({ where: { parentPageId } }),
    [],
    "Failed to fetch child pages",
  )
}

export async function getParentPages() {
  return await safeDbOperation(
    async () => prismaClient.page.findMany({ where: { parentPageId: null } }),
    [],
    "Failed to fetch parent pages",
  )
}

export async function updatePage(id: string, data: Prisma.PageUpdateInput) {
  const page = await getPageById(id)
  const yearId = page?.yearId

  const result = await safeDbOperation(
    async () => prismaClient.page.update({ where: { id }, data }),
    null,
    "Failed to update page",
  )

  if (result) {
    revalidatePath(`/pages/${id}`)
    if (yearId) revalidatePath(`/years/${yearId}`)
    revalidatePath(`/pages`)
  }

  return result
}

export async function deletePage(id: string) {
  const page = await getPageById(id)
  const yearId = page?.yearId

  const result = await safeDbOperation(
    async () => prismaClient.page.delete({ where: { id } }),
    null,
    "Failed to delete page",
  )

  if (result) {
    if (yearId) revalidatePath(`/years/${yearId}`)
    revalidatePath(`/pages`)
  }

  return result
}

export async function archivePage(id: string) {
  const page = await getPageById(id)
  const yearId = page?.yearId

  const result = await safeDbOperation(
    async () =>
      prismaClient.page.update({
        where: { id },
        data: { isArchived: true },
      }),
    null,
    "Failed to archive page",
  )

  if (result) {
    revalidatePath(`/pages/${id}`)
    if (yearId) revalidatePath(`/years/${yearId}`)
    revalidatePath(`/pages`)
  }

  return result
}

export async function publishPage(id: string) {
  const page = await getPageById(id)
  const yearId = page?.yearId

  const result = await safeDbOperation(
    async () =>
      prismaClient.page.update({
        where: { id },
        data: { isPublished: true },
      }),
    null,
    "Failed to publish page",
  )

  if (result) {
    revalidatePath(`/pages/${id}`)
    if (yearId) revalidatePath(`/years/${yearId}`)
    revalidatePath(`/pages`)
  }

  return result
}

// Utility Functions
export async function getFullYearStructure(yearId: string) {
  return await safeDbOperation(
    async () =>
      prismaClient.year.findUnique({
        where: { id: yearId },
        include: {
          annualReports: true,
          pages: {
            include: {
              childrenPages: true,
            },
          },
        },
      }),
    null,
    "Failed to fetch year structure",
  )
}
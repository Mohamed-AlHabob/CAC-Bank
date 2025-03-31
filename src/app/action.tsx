"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"


async function safeDbOperation<T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  errorMessage = "Database operation failed",
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    return fallbackValue
  }
}

function checkAuth() {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthorized access")
  }
}

export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
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

export async function getAllYearsWithPages() {
  return await safeDbOperation(
    async () => {
      return await prisma.year.findMany({
        orderBy: { dateCreated: "desc" },
        include: { pages: true, annualReports: true },
      })
    },
    [],
    "Failed to fetch years data",
  )
}

export async function createYear(data: Prisma.YearCreateInput) {
  checkAuth()
  const result = await safeDbOperation(async () => prisma.year.create({ data }), null, "Failed to create year")

  if (result) {
    revalidatePath("/years")
    revalidatePath("/")
  }

  return result
}

export async function getYearById(id: string) {
  return await safeDbOperation(
    async () => prisma.year.findUnique({ where: { id } }),
    null,
    "Failed to fetch year details",
  )
}

export async function getYearByFiscalYear(fiscalYear: string) {
  return await safeDbOperation(
    async () => prisma.year.findUnique({ where: { fiscalYear } }),
    null,
    "Failed to fetch year by fiscal year",
  )
}

export async function getAllYears() {
  return await safeDbOperation(
    async () => prisma.year.findMany({ orderBy: { fiscalYear: "asc" } }),
    [],
    "Failed to fetch years",
  )
}

export async function updateYear(id: string, data: Prisma.YearUpdateInput) {
  checkAuth()
  const result = await safeDbOperation(
    async () => prisma.year.update({ where: { id }, data }),
    null,
    "Failed to update year",
  )

  if (result) {
    revalidatePath("/years")
    revalidatePath(`/years/${id}`)
    revalidatePath("/")
  }

  return result
}

export async function deleteYear(id: string) {
  checkAuth()
  const result = await safeDbOperation(
    async () => prisma.year.delete({ where: { id } }),
    null,
    "Failed to delete year",
  )

  if (result) {
    revalidatePath("/years")
    revalidatePath("/")
  }

  return result
}

export async function createAnnualReport(data: Prisma.AnnualReportCreateInput) {
  checkAuth()
  const result = await safeDbOperation(
    async () => prisma.annualReport.create({ data }),
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
    async () => prisma.annualReport.findUnique({ where: { id } }),
    null,
    "Failed to fetch annual report",
  )
}

export async function getAnnualReportsByYear(yearId: string) {
  return await safeDbOperation(
    async () => prisma.annualReport.findMany({ where: { yearId } }),
    [],
    "Failed to fetch annual reports for this year",
  )
}

export async function getAnnualReportsByField(field: string) {
  return await safeDbOperation(
    async () => prisma.annualReport.findMany({ where: { field } }),
    [],
    "Failed to fetch annual reports by field",
  )
}

export async function updateAnnualReport(id: string, data: Prisma.AnnualReportUpdateInput) {
  checkAuth()
  const result = await safeDbOperation(
    async () => prisma.annualReport.update({ where: { id }, data }),
    null,
    "Failed to update annual report",
  )

  if (result) {
    revalidatePath(`/years/${result.yearId}`)
  }

  return result
}

export async function deleteAnnualReport(id: string) {
  checkAuth()
  const report = await getAnnualReportById(id)
  const yearId = report?.yearId

  const result = await safeDbOperation(
    async () => prisma.annualReport.delete({ where: { id } }),
    null,
    "Failed to delete annual report",
  )

  if (result && yearId) {
    revalidatePath(`/years/${yearId}`)
  }

  return result
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim()
}

export async function createPage(data: Prisma.PageCreateInput) {
  checkAuth()
  const result = await safeDbOperation(async () => {
    let slug = generateSlug(data.title)
    let existingPage = await prisma.page.findUnique({ where: { slug } })
    let suffix = 1
    while (existingPage) {
      slug = `${generateSlug(data.title)}-${suffix}`
      existingPage = await prisma.page.findUnique({ where: { slug } })
      suffix++
    }

    const pageData = { ...data, slug }

    return await prisma.page.create({ data: pageData })
  }, null, "Failed to create page")

  if (result) {
    revalidatePath(`/`)
  }

  return result
}

export async function getPageById(id: string) {
  return await safeDbOperation(
    async () =>
      prisma.page.findUnique({
        where: { id },
        include: { childrenPages: true, parentPage: true },
      }),
    null,
    "Failed to fetch page details",
  )
}

export async function getPageBySlug(slug: string) {
  return await safeDbOperation(
    async () =>
      prisma.page.findUnique({
        where: { slug },
      }),
    null,
    "Failed to fetch page details",
  )
}

export async function getPagesByYear(yearId: string) {
  return await safeDbOperation(
    async () => prisma.page.findMany({ where: { yearId } }),
    [],
    "Failed to fetch pages for this year",
  )
}

export async function getPagesByParent(parentPageId: string) {
  return await safeDbOperation(
    async () => prisma.page.findMany({ where: { parentPageId } }),
    [],
    "Failed to fetch child pages",
  )
}

export async function getParentPages() {
  return await safeDbOperation(
    async () => prisma.page.findMany({ where: { parentPageId: null } }),
    [],
    "Failed to fetch parent pages",
  )
}

export const savePage = async (pageId: string, content: any) => {
  checkAuth()
  try {
    await prisma.page.update({
      where: { id: pageId },
      data: { content: content as Prisma.InputJsonValue },
    })
  } catch (error) {
    console.error("Failed to save page:", error)
    throw error
  }
}

export async function updatePage(id: string, data: Prisma.PageUpdateInput) {
  checkAuth()
  const page = await getPageById(id)
  const yearId = page?.yearId

  const result = await safeDbOperation(
    async () => prisma.page.update({ where: { id }, data }),
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
  checkAuth()
  const page = await getPageById(id)
  const yearId = page?.yearId

  const result = await safeDbOperation(
    async () => prisma.page.delete({ where: { id } }),
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
  checkAuth()
  const page = await getPageById(id)
  const yearId = page?.yearId

  const result = await safeDbOperation(
    async () =>
      prisma.page.update({
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
  checkAuth()
  const page = await getPageById(id)
  const yearId = page?.yearId

  const result = await safeDbOperation(
    async () =>
      prisma.page.update({
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

export async function getFullYearStructure(yearId: string) {
  return await safeDbOperation(
    async () =>
      prisma.year.findUnique({
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
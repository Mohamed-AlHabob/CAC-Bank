"use server"

import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"



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

export async function getLatestYearWithPages() {
  return await safeDbOperation(
    async () => {
      return await prisma.year.findFirst({
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
      return await prisma.year.findMany({
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
  const result = await safeDbOperation(async () => prisma.year.create({ data }), null, "Failed to create year")

  // Revalidate paths after successful creation
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
  const result = await safeDbOperation(
    async () => prisma.year.update({ where: { id }, data }),
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
    async () => prisma.year.delete({ where: { id } }),
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
    .trim();
}

// Page Actions
export async function createPage(data: Prisma.PageCreateInput) {
  const result = await safeDbOperation(async () => {
    // Generate a slug from the title
    let slug = generateSlug(data.title);

    // Check if the slug already exists
    let existingPage = await prisma.page.findUnique({ where: { slug } });
    let suffix = 1;

    // If the slug exists, append a suffix to make it unique
    while (existingPage) {
      slug = `${generateSlug(data.title)}-${suffix}`;
      existingPage = await prisma.page.findUnique({ where: { slug } });
      suffix++;
    }

    // Add the slug to the data
    const pageData = { ...data, slug };

    // Create the page with the unique slug
    return await prisma.page.create({ data: pageData });
  }, null, "Failed to create page");

  if (result) {
    revalidatePath(`/`);
  }

  return result;
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


export async function savePage(id: string, content: any) {
  try {
    const page = await getPageById(id)
    const yearId = page?.yearId

    // Ensure content is a string
    const contentToSave = typeof content === "string" ? content : JSON.stringify(content)

    // Log what we're saving for debugging
    console.log("Saving content:", contentToSave)

    const result = await safeDbOperation(
      async () =>
        prisma.page.update({
          where: { id },
          data: { content: contentToSave },
        }),
      null,
      "Failed to save page content",
    )

    if (result) {
      revalidatePath(`/pages/${id}`)
      if (yearId) revalidatePath(`/years/${yearId}`)
      revalidatePath(`/pages`)
    }

    return { success: !!result, data: result }
  } catch (error) {
    console.error("Error in savePage:", error)
    return { success: false, error: String(error) }
  }
}

export async function updatePage(id: string, data: Prisma.PageUpdateInput) {
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

// Utility Functions
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
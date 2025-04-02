"use server"

import prisma from "@/lib/prisma"
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
        include: { 
          annualReports: true,
          pages: {
            where :{parentPage : null},
            include: {
              childrenPages: true,
            },
          },
         },
      });
    },
    [],
    "Failed to fetch years data",
  );
}

export async function createYear(data: Prisma.YearCreateInput) {
  const result = await safeDbOperation(async () => prisma.year.create({ data }), null, "Failed to create year")

  if (result) {
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

  if (result) {
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

  if (result) {
    revalidatePath("/")
  }

  return result
}

export async function createAnnualReport(data: Prisma.AnnualReportCreateInput) {
  const result = await safeDbOperation(
    async () => prisma.annualReport.create({ data }),
    null,
    "Failed to create annual report",
  )

  if (result) {
    revalidatePath(`/}`)
    revalidatePath(`/analysis/}`)
  }

  return result
}

export async function updateAnnualReport(id: string, data: Prisma.AnnualReportUpdateInput) {
  const result = await safeDbOperation(
    async () => prisma.annualReport.update({ where: { id }, data }),
    null,
    "Failed to update annual report",
  )

  if (result) {
    revalidatePath(`/analysis`)
  }

  return result
}

export async function deleteAnnualReport(id: string) {
  const result = await safeDbOperation(
    async () => prisma.annualReport.delete({ where: { id } }),
    null,
    "Failed to delete annual report",
  )

  if (result) {
    revalidatePath(`/analysis`)
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
    let slug = generateSlug(data.title);
    let existingPage = await prisma.page.findUnique({ where: { slug } });
    let suffix = 1;
    while (existingPage) {
      slug = `${generateSlug(data.title)}-${suffix}`;
      existingPage = await prisma.page.findUnique({ where: { slug } });
      suffix++;
    }

    const pageData = { ...data, slug };

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

export const savePage = async (pageId: string, content: any) => {
  try {
    await prisma.page.update({
      where: { id: pageId },
      data: { content: content as Prisma.InputJsonValue },
    });
  } catch (error) {
    console.error("Failed to save page:", error);
    throw error;
  }
};

export async function updatePage(id: string, data: Prisma.PageUpdateInput) {
  const page = await getPageById(id)
  

  const result = await safeDbOperation(
    async () => prisma.page.update({ where: { id }, data }),
    null,
    "Failed to update page",
  )

  if (result) {
    revalidatePath("/")
    revalidatePath(`/section/${page?.slug}`)

  }

  return result
}

export async function deletePage(id: string) {
  const result = await safeDbOperation(
    async () => prisma.page.delete({ where: { id } }),
    null,
    "Failed to delete page",
  )

  if (result) {
    revalidatePath(`/`)
  }

  return result
}

export async function archivePage(id: string) {

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
    revalidatePath(`/`)
  }

  return result
}

export async function publishPage(id: string) {

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
    revalidatePath(`/`)
  }

  return result
}
import { notFound } from "next/navigation"
import PageContent from "@/components/sections/sectionPage/page-content"
import { getYearByFiscalYear } from "@/app/action"

interface PageProps {
  params: {
    year: string
    slug: string
  }
}

export default async function Page({ params }: PageProps) {
  const { year, slug } = params

  // Fetch the year data
  const fiscalYear = await getYearByFiscalYear(year)

  if (!fiscalYear) {
    notFound()
  }

  return (
    <div className="min-h-screen w-full" data-registry="plate">
        <PageContent fiscalYear={year} slug={slug} />
    </div>
  )
}


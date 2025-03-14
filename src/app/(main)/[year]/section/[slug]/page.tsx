import { notFound } from "next/navigation"
import { SettingsProvider } from "@/components/editor/settings"
import { getYearByFiscalYear } from "@/action"
import PageContent from "@/components/sections/sectionPage/page-content"

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
      <SettingsProvider>
        <PageContent fiscalYear={year} slug={slug} />
      </SettingsProvider>
    </div>
  )
}


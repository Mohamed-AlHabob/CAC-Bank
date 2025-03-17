
import { getAllYearsWithPages } from "@/app/action"
import AnnualDataAnalysis from "@/components/sections/annual-data-analysis"



export default async function AnnualDataPage() {
  const yearsData = await getAllYearsWithPages()

  return (
      <AnnualDataAnalysis allYears={yearsData} />

  )
}


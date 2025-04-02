import { getAllYearsWithPages } from "@/app/action"
import { ChartAreaInteractive } from "@/components/sections/analysis/chart-area-interactive"
import { ChartBar } from "@/components/sections/analysis/chart-bar"
import { ChartPie } from "@/components/sections/analysis/chart-pie"
import { DataTable } from "@/components/sections/analysis/data-table"
import { SectionCards } from "@/components/sections/analysis/section-cards"
import type { YearWithPages } from "@/components/context/YearContext"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default async function AnnualDataPage() {
  const years = await getAllYearsWithPages()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <Suspense fallback={<SectionCardsSkeleton />}>
            <SectionCards />
          </Suspense>

          <div className="px-4 lg:px-6 space-y-4">
            <Suspense fallback={<ChartSkeleton height="300px" />}>
              <ChartAreaInteractive data={years as YearWithPages[]} />
            </Suspense>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Suspense fallback={<ChartSkeleton />}>
                <ChartBar data={years} />
              </Suspense>
              <Suspense fallback={<ChartSkeleton />}>
                <ChartPie data={years} />
              </Suspense>
            </div>
          </div>

          <Suspense fallback={<TableSkeleton />}>
            <DataTable data={years} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function SectionCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 gap-4 px-4 lg:px-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
      ))}
    </div>
  )
}

function ChartSkeleton({ height = "250px" }: { height?: string }) {
  return <Skeleton className={`w-full rounded-lg`} style={{ height }} />
}

function TableSkeleton() {
  return <Skeleton className="h-[400px] w-full rounded-lg mx-4 lg:mx-6" />
}


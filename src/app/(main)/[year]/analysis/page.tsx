import { getAllYearsWithPages } from "@/app/action";
import { ChartAreaInteractive } from "@/components/sections/analysis/chart-area-interactive";
import { ChartBar } from "@/components/sections/analysis/chart-bar";
import { ChartPie } from "@/components/sections/analysis/chart-pie";
import { DataTable } from "@/components/sections/analysis/data-table";
import { SectionCards } from "@/components/sections/analysis/section-cards";

export default async function AnnualDataPage() {
  const years = await getAllYearsWithPages();
  return (
    <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={years} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                 <ChartBar data={years} />
                 <ChartPie data={years}  />
               </div>
              </div>
              <DataTable data={years}  />
            </div>
          </div>
        </div>
  )
}


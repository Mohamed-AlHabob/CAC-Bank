
"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { YearWithPages } from "@/components/context/YearContext"

export function ChartPie({ data }: { data: YearWithPages[] }) {
  // Transform data to extract deposits for each year
  const pieData = React.useMemo(() => {
    return data.map((year, index) => {
      const depositReport = year.annualReports.find((report) => report.field === "Deposits")
      return {
        year: year.fiscalYear, // Use the fiscal year as the label
        deposits: depositReport ? Number.parseInt(depositReport.value) : 0, // Extract deposit value
        // Use the chart color variable based on index (cycling through available colors)
        fill: `var(--color-year-${(index % 5) + 1})`,
      }
    })
  }, [data])

  // Calculate total deposits across all years
  const totalDeposits = React.useMemo(() => {
    return pieData.reduce((acc, curr) => acc + curr.deposits, 0)
  }, [pieData])

  // Create a config object with a color for each year
  const chartConfig = React.useMemo(() => {
    const config: Record<string, any> = {
      deposits: {
        label: "Deposits",
      },
    }

    // Add a color entry for each year
    data.forEach((year, index) => {
      config[`year-${index + 1}`] = {
        label: year.fiscalYear,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      }
    })

    return config
  }, [data])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Deposits by Year</CardTitle>
        <CardDescription>Total deposits for each fiscal year</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[500px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Pie
              data={pieData}
              dataKey="deposits"
              nameKey="year"
              innerRadius={60}
              strokeWidth={5}
              fill="#8884d8" // This is a fallback, the fill property in data will override this
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-5xl font-bold">
                          {totalDeposits.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Total Deposits
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-center gap-4 text-sm">
        {pieData.map((item, index) => (
          <div key={item.year} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: `var(--color-year-${(index % 5) + 1})` }} />
            <span>
              {item.year}: {item.deposits.toLocaleString()}
            </span>
          </div>
        ))}
      </CardFooter>
    </Card>
  )
}


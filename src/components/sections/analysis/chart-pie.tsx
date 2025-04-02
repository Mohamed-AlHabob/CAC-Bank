"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { YearWithPages } from "@/components/context/YearContext"

export function ChartPie({ data }: { data: YearWithPages[] }) {
  const chartData = React.useMemo(() => {
    const allReports: Record<string, number> = {}

    data.forEach((year) => {
      year.annualReports.forEach((report) => {
        const field = report.field
        const value = Number.parseFloat(report.value || "0")

        if (!allReports[field]) {
          allReports[field] = 0
        }

        allReports[field] += value
      })
    })

    return Object.entries(allReports)
      .map(([field, value], index) => ({
        field,
        value: Math.abs(value),
        fill: `var(--color-field-${(index % 5) + 1})`,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) 
  }, [data])

  const totalValue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [chartData])

  const chartConfig = {
    value: {
      label: "Value",
    },
    ...chartData.reduce(
      (acc, curr, index) => {
        acc[curr.field] = {
          label: curr.field,
          color: `hsl(var(--chart-${index + 1}))`,
        }
        return acc
      },
      {} as Record<string, any>,
    ),
  } satisfies ChartConfig

  React.useEffect(() => {
    const root = document.documentElement

    chartData.forEach((_, index) => {
      root.style.setProperty(`--color-field-${index + 1}`, `hsl(var(--chart-${index + 1}))`)
    })

    return () => {
      chartData.forEach((_, index) => {
        root.style.removeProperty(`--color-field-${index + 1}`)
      })
    }
  }, [chartData])

  const formatLargeNumber = (value: number): string => {
    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(2)}T`
    } else if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M` 
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`
    }
    return value.toLocaleString()
  }

  // Get date range for description
  const dateRange = React.useMemo(() => {
    if (data.length === 0) return "No data available"

    const years = data.map((y) => y.fiscalYear).sort()
    return `Fiscal Years ${years[0]} - ${years[years.length - 1]}`
  }, [data])

  // Handle empty state
  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Financial Metrics Distribution</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">No annual report data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Financial Metrics Distribution</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="field"
              innerRadius={80}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) - 10} className="fill-foreground text-3xl font-bold">
                          {formatLargeNumber(totalValue)}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground">
                          Total Value
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this period <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing distribution of top financial metrics across all years
        </div>
      </CardFooter>
    </Card>
  )
}


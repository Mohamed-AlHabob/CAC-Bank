"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { YearWithPages } from "@/components/context/YearContext"

export function ChartBar({ data }: { data: YearWithPages[] }) {
  const barData = React.useMemo(() => {
    return data.map((year) => {
      const reports = year.annualReports.reduce(
        (acc, report) => {
          acc[report.field] = Number.parseInt(report.value)
          return acc
        },
        {} as Record<string, number>,
      )

      return {
        year: year.fiscalYear,
        ...reports,
      }
    })
  }, [data])

  // Get unique field names from the first year's data
  const fieldNames = React.useMemo(() => {
    return data[0]?.annualReports.map((report) => report.field) || []
  }, [data])

  // Create a consistent color config for all fields
  const chartConfig = React.useMemo(() => {
    const config: Record<string, any> = {}

    fieldNames.forEach((field, index) => {
      config[field] = {
        label: field,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      }
    })

    return config
  }, [fieldNames])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Annual Report Data</CardTitle>
        <CardDescription>Comparison across fiscal years</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={barData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {fieldNames.map((field, index) => (
              <Bar key={field} dataKey={field} fill={`var(--color-${field})`} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">Annual report data for each fiscal year</div>
      </CardFooter>
    </Card>
  )
}


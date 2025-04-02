"use client"

import * as React from "react"
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  LabelList,
  ResponsiveContainer
} from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { useYear, type YearWithPages } from "@/components/context/YearContext"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/use-modal-store"
import { PlusIcon, InfoIcon } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function extractFieldNames(data: YearWithPages[]) {
  const fields = new Set<string>()
  data.forEach((year) => {
    year.annualReports.forEach((report) => {
      fields.add(report.field)
    })
  })
  return Array.from(fields)
}

function createChartConfig(fieldNames: string[]) {
  const config: Record<string, any> = {}
  
  fieldNames.forEach((field, index) => {
    config[field] = {
      label: field,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    }
  })
  
  return config
}

function transformBarData(data: YearWithPages[], fieldNames: string[]) {
  return data.map((year) => {
    const initialReports = fieldNames.reduce((acc, field) => {
      acc[field] = 0;
      return acc;
    }, {} as Record<string, number>);
    
    const reports = year.annualReports.reduce(
      (acc, report) => {
        acc[report.field] = Number.parseInt(report.value) || 0;
        return acc;
      },
      initialReports
    );

    return {
      year: year.fiscalYear,
      yearId: year.id,
      ...reports,
    } as Record<string, number | string>;
  });
}

function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <div className="bg-background border rounded-md shadow-md p-3 text-sm">
      <p className="font-medium mb-1">Fiscal Year: {label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={`item-${index}`} style={{ color: entry.color }}>
          {entry.name}: <span className="font-medium">${entry.value.toLocaleString()}</span>
        </p>
      ))}
      <p className="text-muted-foreground text-xs mt-1">
        Click on bars to edit data
      </p>
    </div>
  );
}

export function ChartBar() {
  const { years } = useYear()
  const { isSignedIn } = useAuth();
  const { onOpen } = useModal();
  const [chartType, setChartType] = React.useState("grouped");
  const data = years

  const fieldNames = extractFieldNames(data);

  const chartConfig = createChartConfig(fieldNames);
  
  const barData = transformBarData(data, fieldNames);

  const handleBarClick = (data: any) => {
    if (isSignedIn && data?.yearId) {
      if (data) {
        onOpen("editYear", { year:data });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Financial Metrics Comparison</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Compare financial metrics across fiscal years. 
                  Toggle between grouped and stacked views for different analysis perspectives.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
        <CardDescription>Comparative analysis of key financial metrics</CardDescription>
        <div className=" right-4 top-4 flex gap-2">
          <Tabs defaultValue="grouped" value={chartType} onValueChange={setChartType} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grouped">Grouped</TabsTrigger>
              <TabsTrigger value="stacked">Stacked</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {isSignedIn && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onOpen("createAnnualReport")}
              className="gap-1"
            >
              <PlusIcon className="size-3.5" />
              Add Metric
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="year" 
                tickLine={false} 
                axisLine={true} 
                tickMargin={10} 
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString(undefined, { notation: 'compact' })}`}
                tickLine={false}
                axisLine={true}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                formatter={(value) => <span className="text-sm font-medium">{value}</span>}
              />
              {fieldNames.map((field, index) => (
                <Bar 
                  key={field} 
                  dataKey={field} 
                  name={field}
                  fill={`var(--color-field-${(index % 5) + 1})`} 
                  radius={[4, 4, 0, 0]} 
                  style={{ cursor: isSignedIn ? 'pointer' : 'default' }}
                  onClick={() => handleBarClick(barData.find(item => Number(item[field]) > 0))}
                  stackId={chartType === "stacked" ? "a" : undefined}
                >
                  {chartType === "grouped" && index === 0 && (
                    <LabelList 
                      dataKey="year" 
                      position="bottom" 
                      offset={10} 
                      fill="hsl(var(--muted-foreground))" 
                      fontSize={12}
                    />
                  )}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {chartType === "grouped" ? "Compare individual metrics across years" : "Analyze total financial composition by year"}
        </div>
        {fieldNames.length === 0 && (
          <div className="text-muted-foreground">
            No report data available. {isSignedIn && "Add reports to see data here."}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

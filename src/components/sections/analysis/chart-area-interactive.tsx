"use client";

import * as React from "react";
import { 
  Area, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Line, 
  ComposedChart,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer
} from "recharts";
import useIsMobile from "@/hooks/use-mobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { YearWithPages } from "@/components/context/YearContext";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { PlusIcon, TrendingUpIcon, TrendingDownIcon, InfoIcon } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Constants outside component
const TIME_RANGES = {
  "5y": { label: "Last 5 years", years: 5 },
  "3y": { label: "Last 3 years", years: 3 },
  "1y": { label: "Last year", years: 1 }
};

const chartConfig = {
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-1))",
  },
  trend: {
    label: "Trend",
    color: "hsl(var(--chart-4))",
  }
} satisfies ChartConfig;

// Helper functions
function filterDataByTimeRange(data: any[], timeRange: string) {
  const currentYear = new Date().getFullYear();
  const yearsToSubtract = TIME_RANGES[timeRange as keyof typeof TIME_RANGES]?.years || 3;
  const startYear = currentYear - yearsToSubtract;
  
  return data.filter(item => {
    const fiscalYearNumber = parseInt(item.fiscalYear, 10);
    return fiscalYearNumber >= startYear;
  });
}

function transformChartData(data: YearWithPages[]) {
  // Sort data by fiscal year to ensure proper trend line
  const sortedData = [...data].sort((a, b) => 
    parseInt(a.fiscalYear, 10) - parseInt(b.fiscalYear, 10)
  );
  
  return sortedData.map((year, index, array) => {
    const profit = parseFloat(year.totalProfit?.toString() || "0");
    
    // Calculate growth rate if not the first item
    let growthRate = 0;
    if (index > 0) {
      const prevProfit = parseFloat(array[index-1].totalProfit?.toString() || "0");
      growthRate = prevProfit !== 0 ? ((profit - prevProfit) / prevProfit) * 100 : 0;
    }
    
    return {
      fiscalYear: year.fiscalYear,
      profit,
      growthRate: parseFloat(growthRate.toFixed(2)),
      yearId: year.id,
    };
  });
}

// Calculate moving average for trend line
function calculateMovingAverage(data: any[], field: string, period: number = 2) {
  return data.map((item, index, array) => {
    if (index < period - 1) return { ...item, trend: null };
    
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += array[index - i][field];
    }
    
    return {
      ...item,
      trend: sum / period
    };
  });
}

// Find significant points (highest and lowest values)
function findSignificantPoints(data: any[]) {
  if (data.length < 2) return { max: null, min: null };
  
  let max = data[0];
  let min = data[0];
  
  data.forEach(item => {
    if (item.profit > max.profit) max = item;
    if (item.profit < min.profit) min = item;
  });
  
  return { max, min };
}

// Custom tooltip component
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  const profit = data.profit;
  const growthRate = data.growthRate;
  const isPositive = growthRate >= 0;
  
  return (
    <div className="bg-background border rounded-md shadow-md p-3 text-sm">
      <p className="font-medium mb-1">Fiscal Year: {label}</p>
      <p className="text-foreground">
        Profit: <span className="font-medium">${profit.toLocaleString()}</span>
      </p>
      {growthRate !== 0 && (
        <p className={isPositive ? "text-green-600" : "text-red-600"}>
          Growth: <span className="font-medium">{growthRate.toFixed(2)}%</span>
          {isPositive ? <TrendingUpIcon className="inline ml-1 h-3 w-3" /> : <TrendingDownIcon className="inline ml-1 h-3 w-3" />}
        </p>
      )}
    </div>
  );
}

export function ChartAreaInteractive({ data }: { data: YearWithPages[] }) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("3y");
  const { isSignedIn } = useAuth();
  const { onOpen } = useModal();

  React.useState(() => {
    if (isMobile) {
      setTimeRange("1y");
    }
  });

  const chartData = transformChartData(data);
  
  const filteredData = filterDataByTimeRange(chartData, timeRange);
  
  const dataWithTrend = calculateMovingAverage(filteredData, 'profit');
  
  const { max, min } = findSignificantPoints(filteredData);
  
  const averageProfit = filteredData.reduce((sum, item) => sum + item.profit, 0) / filteredData.length;

  const handleYearClick = (yearId: string) => {
    if (isSignedIn) {
      const year = data.find(y => y.id === yearId);
      if (year) {
        onOpen("editYear", { year });
      }
    }
  };

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <CardTitle>Annual Profit Trend Analysis</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  This chart shows profit trends over time with a moving average trendline. 
                  Highlighted areas indicate significant performance periods.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Financial performance analysis with trend indicators and growth metrics
          </span>
          <span className="@[540px]/card:hidden">Profit trend analysis</span>
        </CardDescription>
        <div className="absolute right-4 top-4 flex gap-2">
          {/* Desktop time range selector */}
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => value && setTimeRange(value)}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            {Object.entries(TIME_RANGES).map(([key, { label }]) => (
              <ToggleGroupItem key={key} value={key} className="h-8 px-2.5">
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          
          {/* Mobile time range selector */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="@[767px]/card:hidden flex w-40">
              <SelectValue placeholder={TIME_RANGES[timeRange as keyof typeof TIME_RANGES]?.label} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {Object.entries(TIME_RANGES).map(([key, { label }]) => (
                <SelectItem key={key} value={key} className="rounded-lg">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Add Year button for signed-in users */}
          {isSignedIn && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onOpen("createYear")}
              className="gap-1"
            >
              <PlusIcon className="size-3.5" />
              Add Year
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dataWithTrend} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <defs>
                <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="fiscalYear"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Reference line for average */}
              <ReferenceLine 
                y={averageProfit} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="3 3" 
                label={{ 
                  value: "Avg", 
                  position: "right", 
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12
                }} 
              />
              
              {/* Highlight max point if it exists */}
              {max && max.profit > averageProfit && (
                <ReferenceArea 
                  x1={max.fiscalYear} 
                  x2={max.fiscalYear} 
                  y1={averageProfit} 
                  y2={max.profit} 
                  fill="hsl(var(--chart-1))" 
                  fillOpacity={0.2} 
                />
              )}
              
              {/* Highlight min point if it exists */}
              {min && min.profit < averageProfit && (
                <ReferenceArea 
                  x1={min.fiscalYear} 
                  x2={min.fiscalYear} 
                  y1={min.profit} 
                  y2={averageProfit} 
                  fill="hsl(var(--destructive))" 
                  fillOpacity={0.2} 
                />
              )}
              
              <Area
                dataKey="profit"
                type="monotone"
                fill="url(#fillProfit)"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                onClick={(e: any) => {
                  const payload = e?.activePayload?.[0]?.payload;
                  handleYearClick(payload?.yearId || "");
                }}
                style={{ cursor: isSignedIn ? 'pointer' : 'default' }}
                activeDot={{ 
                  r: 6, 
                  strokeWidth: 2, 
                  stroke: "hsl(var(--background))",
                  fill: "hsl(var(--chart-1))" 
                }}
              />
              <Line
                dataKey="trend"
                type="monotone"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                dot={false}
                activeDot={false}
                strokeDasharray="5 5"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Legend and additional information */}
        <div className="flex flex-wrap justify-between items-center mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]"></div>
              <span>Profit</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-dashed border-[hsl(var(--chart-4))] rounded-full"></div>
              <span>Trend (Moving Avg)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-[hsl(var(--muted-foreground))] border-dashed"></div>
              <span>Average</span>
            </div>
          </div>
          <div>
            {filteredData.length > 0 && (
              <span>
                Average Profit: ${averageProfit.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

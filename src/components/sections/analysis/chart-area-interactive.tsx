"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import useIsMobile from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { YearWithPages } from "@/components/context/YearContext";

const chartConfig = {
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ data }: { data: YearWithPages[] }) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const chartData = data.map(year => ({
    fiscalYear: year.fiscalYear,
    profit: year.totalProfit || 0,
  }));

  const filteredData = chartData.filter((item) => {
    const fiscalYear = item.fiscalYear;
    const referenceDate = new Date();
    let yearsToSubtract = 3;
    if (timeRange === "1y") {
      yearsToSubtract = 1;
    } else if (timeRange === "5y") {
      yearsToSubtract = 5;
    }
    const startYear = referenceDate.getFullYear() - yearsToSubtract;
    const fiscalYearNumber = parseInt(fiscalYear, 10);
    return fiscalYearNumber >= startYear;
  });

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Annual Profit</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Total profit for each fiscal year
          </span>
          <span className="@[540px]/card:hidden">Annual Profit</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="5y" className="h-8 px-2.5">
              Last 5 years
            </ToggleGroupItem>
            <ToggleGroupItem value="3y" className="h-8 px-2.5">
              Last 3 years
            </ToggleGroupItem>
            <ToggleGroupItem value="1y" className="h-8 px-2.5">
              Last year
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 years" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="5y" className="rounded-lg">
                Last 5 years
              </SelectItem>
              <SelectItem value="3y" className="rounded-lg">
                Last 3 years
              </SelectItem>
              <SelectItem value="1y" className="rounded-lg">
                Last year
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="fiscalYear"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Fiscal Year: ${value}`}
                  formatter={(value: any) => `Profit: $${value}`}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="profit"
              type="natural"
              fill="url(#fillProfit)"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
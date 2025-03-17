"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Year } from "@prisma/client";

interface YearsProps {
  allYears?: Year[];
  className?: string;
}

const defaultData = [
  { fiscalYear: "2020", totalProfit: 186 },
  { fiscalYear: "2021", totalProfit: 305 },
  { fiscalYear: "2022", totalProfit: 237 },
  { fiscalYear: "2023", totalProfit: 73 },
  { fiscalYear: "2024", totalProfit: 209 },
  { fiscalYear: "2025", totalProfit: 214 },
];

const chartConfig: ChartConfig = {
};

export function Chart({ allYears, className = "" }: YearsProps) {
  const chartData = allYears?.map((year) => ({
    fiscalYear: year.fiscalYear,
    totalProfit: year.totalProfit, 
  })) || defaultData;

  return (
    <ChartContainer config={chartConfig} className={`h-full w-full ${className}`}>
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="fiscalYear"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(2)}
        />
        <Bar dataKey="totalProfit" fill="#4F46E5" radius={[4, 4, 0, 0]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}

"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import { useYear } from "../context/YearContext";
import { useMemo } from "react";

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

export function Chart() {
  const { currentYear } = useYear();

  const chartData = useMemo(() => {
    return currentYear ? [{
      fiscalYear: currentYear.fiscalYear,
      ...currentYear.annualReports.reduce((acc, report) => {
        acc[report.field.toLowerCase()] = parseFloat(report.value);
        return acc;
      }, {} as Record<string, number>)
    }] : defaultData.map(item => ({
      fiscalYear: "FY22",
      totalProfit: item.totalProfit
    }));
  }, [currentYear]);

    const fieldNames = useMemo(() => {
      return currentYear 
        ? [...new Set(currentYear.annualReports.map(report => report.field.toLowerCase()))]
        : ["totalProfit"];
    }, [currentYear]);
    
  return (
    <ChartContainer config={chartConfig} className={`h-full w-full`}>
      <BarChart
         data={chartData}
         margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
         barCategoryGap={20}
         barGap={4}
       >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="fiscalYear"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(2)}
        />
        {fieldNames.map((field) => (
              <Bar 
                key={field}
                dataKey={field}
                fill={"#4F46E5"}
                radius={[4, 4, 0, 0]}
                name={field.charAt(0).toUpperCase() + field.slice(1)}
                animationDuration={1500}
                animationEasing="ease-out"
                maxBarSize={120}
              />
            ))}
      </BarChart>
    </ChartContainer>
  );
}
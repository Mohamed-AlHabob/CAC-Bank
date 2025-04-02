"use client";

import { Bar, BarChart, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useYear } from "../context/YearContext";
import { useMemo } from "react";

const defaultData = [
  { field: "Revenue", value: 500 },
  { field: "Expenses", value: 300 },
  { field: "Investments", value: 200 },
  { field: "Assets", value: 800 },
];

const chartConfig: ChartConfig = {
};

export function AnnualReportChart({ className = "" }) {
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
      [item.field.toLowerCase()]: item.value
    }));
  }, [currentYear]);

  const fieldNames = useMemo(() => {
    return currentYear 
      ? [...new Set(currentYear.annualReports.map(report => report.field.toLowerCase()))]
      : defaultData.map(item => item.field.toLowerCase());
  }, [currentYear]);

  return (
    <div className={`h-full w-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%" minHeight={400}>
        <ChartContainer config={chartConfig}>
          <BarChart 
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            barCategoryGap={20}
            barGap={4}
          >
            {fieldNames.map((field) => (
              <Bar 
                key={field}
                dataKey={field}
                fill={"#4F46E5"}
                radius={[4, 4, 0, 0]}
                name={field.charAt(0).toUpperCase() + field.slice(1)}
                animationDuration={1500}
                animationEasing="ease-out"
                maxBarSize={80}
              />
            ))}
            <ChartTooltip 
              content={<ChartTooltipContent />}
              cursor={{ fill: '#F3F4F6', opacity: 0.1 }}
              wrapperStyle={{ 
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '0.5rem'
              }}
            />
            <ChartLegend 
              content={<ChartLegendContent />}
              wrapperStyle={{ paddingTop: '1rem' }}
            />
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}
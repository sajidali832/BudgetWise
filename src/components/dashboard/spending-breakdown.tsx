"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { useBudget } from "@/contexts/budget-context";
import { EXPENSE_CATEGORIES } from "@/lib/types";

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(200, 70%, 50%)",
  "hsl(300, 70%, 50%)",
];

export function SpendingBreakdown() {
  const { expensesByCategory } = useBudget();
  
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    EXPENSE_CATEGORIES.forEach((category, index) => {
      config[category] = {
        label: category,
        color: chartColors[index % chartColors.length],
      };
    });
    return config;
  }, []);

  const chartData = expensesByCategory.filter(item => item.amount > 0).map(item => ({
    name: item.category,
    value: item.amount,
    fill: chartConfig[item.category]?.color || "hsl(var(--muted))",
  }));
  
  const totalExpenses = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>A look at where your money is going.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="60%"
                strokeWidth={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
            No expenses to show.
          </div>
        )}
      </CardContent>
      <CardContent className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
        {chartData.map((item) => {
           const percentage = totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(0) : 0;
           return (
            <div key={item.name} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                <span>{item.name} ({percentage}%)</span>
            </div>
           );
        })}
      </CardContent>
    </Card>
  );
}

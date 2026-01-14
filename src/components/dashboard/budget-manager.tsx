"use client";

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useBudget } from "@/contexts/budget-context";
import { getCategoryIcon } from "@/lib/icons";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export function BudgetManager() {
  const { budgets, setBudget, getSpentAmount } = useBudget();
  const { toast } = useToast();

  const handleBudgetChange = (category: (typeof budgets)[0]['category'], value: string) => {
    const limit = Number(value);
    if (!isNaN(limit) && limit >= 0) {
      setBudget(category, limit);
    }
  };
  
  const handleBlur = (category: (typeof budgets)[0]['category'], value: string) => {
      handleBudgetChange(category, value);
      toast({
        title: "Budget Updated",
        description: `Budget for ${category} set to ${formatCurrency(Number(value))}.`,
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Limits</CardTitle>
        <CardDescription>Set and track your monthly spending goals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.map((budget) => {
          const spent = getSpentAmount(budget.category);
          const progress = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
          const isOverBudget = spent > budget.limit;
          
          return (
            <div key={budget.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(budget.category)}
                  <span className="font-medium">{budget.category}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">$</span>
                    <Input
                        type="number"
                        defaultValue={budget.limit}
                        onBlur={(e) => handleBlur(budget.category, e.target.value)}
                        className="h-8 w-24 text-right"
                        aria-label={`Budget for ${budget.category}`}
                    />
                </div>
              </div>
              <Progress value={Math.min(progress, 100)} className={isOverBudget ? "[&>div]:bg-destructive" : ""} />
              <div className="text-xs text-muted-foreground text-right">
                {isOverBudget ? (
                    <span className="text-destructive font-medium">
                        {formatCurrency(spent - budget.limit)} over budget
                    </span>
                ) : (
                    <span>
                        {formatCurrency(spent)} of {formatCurrency(budget.limit)} spent
                    </span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

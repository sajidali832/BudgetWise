"use client";

import React, { useState } from 'react';
import { useBudget } from '@/contexts/budget-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getAIBudgetTips } from '@/app/actions';
import { Sparkles, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { BudgetTipsOutput } from '@/ai/flows/ai-powered-budget-tips';
import { useToast } from '@/hooks/use-toast';

export function AIBudgetTips() {
  const { transactions, budgets } = useBudget();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BudgetTipsOutput | null>(null);
  const { toast } = useToast();

  const handleGetTips = async () => {
    setLoading(true);
    setResult(null);

    const income = transactions
      .filter(t => t.type === 'income')
      .map(t => ({ category: t.category, amount: t.amount }));

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .map(t => ({ category: t.category, amount: t.amount }));

    const budgetLimits = budgets.map(b => ({ category: b.category, limit: b.limit }));

    const response = await getAIBudgetTips({ income, expenses, budgetLimits });

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI-Powered Budget Tips
        </CardTitle>
        <CardDescription>
          Get personalized recommendations to improve your financial habits based on your recent activity.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[150px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Analyzing your budget...</p>
          </div>
        ) : result ? (
          <Alert>
            <AlertTitle>Your Personalized Summary & Tips</AlertTitle>
            <AlertDescription>
                <p className='mb-4'>{result.summary}</p>
                <ul className="list-disc space-y-2 pl-5">
                    {result.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                    ))}
                </ul>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            Click the button below to generate your personalized budget tips.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGetTips} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate My Tips
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

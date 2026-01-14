"use client";

import { BudgetProvider } from '@/contexts/budget-context';
import { Header } from '@/components/dashboard/header';
import { FinancialSummary } from '@/components/dashboard/financial-summary';
import { TransactionsList } from '@/components/dashboard/transactions-list';
import { SpendingBreakdown } from '@/components/dashboard/spending-breakdown';
import { BudgetManager } from '@/components/dashboard/budget-manager';
import { AIBudgetTips } from '@/components/dashboard/ai-budget-tips';

export default function DashboardPage() {
  return (
    <BudgetProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 animate-in md:gap-8 md:p-8">
          <FinancialSummary />
          <div className="grid grid-cols-1 items-start gap-4 md:gap-8 lg:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <TransactionsList />
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-1 lg:gap-8">
              <SpendingBreakdown />
              <BudgetManager />
            </div>
          </div>
          <AIBudgetTips />
        </main>
      </div>
    </BudgetProvider>
  );
}

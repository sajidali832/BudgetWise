'use client';

import React, { createContext, useContext, useEffect } from 'react';
import {
  collection,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import type { Transaction, Budget, ExpenseCategory } from '@/lib/types';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { EXPENSE_CATEGORIES } from '@/lib/types';

interface BudgetContextType {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'date'> & { date: Date }) => void;
  setBudget: (category: ExpenseCategory, limit: number) => void;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  expensesByCategory: { category: string; amount: number }[];
  getSpentAmount: (category: ExpenseCategory) => number;
  loading: {
    transactions: boolean;
    budgets: boolean;
  };
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const firestore = useFirestore();

  const transactionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'transactions'), orderBy('date', 'desc'));
  }, [user, firestore]);

  const { data: transactions, isLoading: transactionsLoading } = useCollection<Transaction>(transactionsQuery);

  const budgetsCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'budgets');
  }, [user, firestore]);

  const { data: budgets, isLoading: budgetsLoading } = useCollection<Budget>(budgetsCollectionRef);

  useEffect(() => {
    if (user && firestore && !budgetsLoading && budgets?.length === 0) {
      const initialBudgets = EXPENSE_CATEGORIES.map(category => ({
        category,
        limit: 0,
      }));

      initialBudgets.forEach(budget => {
        const budgetRef = doc(firestore, 'users', user.uid, 'budgets', budget.category);
        setDocumentNonBlocking(budgetRef, budget, { merge: true });
      });
    }
  }, [user, firestore, budgets, budgetsLoading]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'userId' | 'date'> & { date: Date }) => {
    if (!user || !firestore) return;
    const newTransaction = {
      ...transaction,
      userId: user.uid,
      date: transaction.date,
    };
    const transactionsCollection = collection(firestore, 'users', user.uid, 'transactions');
    addDocumentNonBlocking(transactionsCollection, newTransaction);
  };

  const setBudget = (category: ExpenseCategory, limit: number) => {
    if (!user || !firestore) return;
    const budgetRef = doc(firestore, 'users', user.uid, 'budgets', category);
    setDocumentNonBlocking(budgetRef, { limit }, { merge: true });
  };
  
  const { totalIncome, totalExpenses, netBalance, expensesByCategory } = React.useMemo(() => {
    let income = 0;
    let expenses = 0;
    const categoryExpenses: { [key in ExpenseCategory]?: number } = {};

    (transactions || []).forEach(t => {
      // The incoming data from firestore is a timestamp, we convert it to a Date object.
      // We need to check if it's a Firestore Timestamp and convert it.
      const transactionDate = (t.date as any).toDate ? (t.date as any).toDate() : t.date;
      t.date = transactionDate;

      if (t.type === 'income') {
        income += t.amount;
      } else {
        expenses += t.amount;
        if (t.category in categoryExpenses) {
          categoryExpenses[t.category as ExpenseCategory]! += t.amount;
        } else {
          categoryExpenses[t.category as ExpenseCategory] = t.amount;
        }
      }
    });

    const expensesByCategoryData = Object.entries(categoryExpenses).map(([category, amount]) => ({
      category,
      amount: amount || 0,
    }));

    return { totalIncome: income, totalExpenses: expenses, netBalance: income - expenses, expensesByCategory: expensesByCategoryData };
  }, [transactions]);

  const getSpentAmount = (category: ExpenseCategory) => {
    return (transactions || [])
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const value = {
    transactions: transactions || [],
    budgets: budgets || [],
    addTransaction,
    setBudget,
    totalIncome,
    totalExpenses,
    netBalance,
    expensesByCategory,
    getSpentAmount,
    loading: {
      transactions: transactionsLoading,
      budgets: budgetsLoading,
    },
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

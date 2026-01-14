import { Timestamp } from "firebase/firestore";

export const TRANSACTION_TYPES = ['income', 'expense'] as const;
export type TransactionType = typeof TRANSACTION_TYPES[number];

export const INCOME_CATEGORIES = ['Salary', 'Investments', 'Gift', 'Other'] as const;
export type IncomeCategory = typeof INCOME_CATEGORIES[number];

export const EXPENSE_CATEGORIES = ['Groceries', 'Rent', 'Utilities', 'Transport', 'Entertainment', 'Health', 'Other'] as const;
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export type TransactionCategory = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: Date | Timestamp;
  description: string;
}

export interface Budget {
  category: ExpenseCategory;
  limit: number;
}

import type { Budget } from './types';
import { EXPENSE_CATEGORIES } from './types';

// This file is now deprecated. The initial data is handled in the budget context.
export const initialBudgets: Budget[] = EXPENSE_CATEGORIES.map(category => {
  return { category, limit: 0 };
});

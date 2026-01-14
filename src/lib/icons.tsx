import React from 'react';
import { Landmark, TrendingUp, Gift, ShoppingCart, Home, Zap, Car, Clapperboard, HeartPulse, HelpCircle } from 'lucide-react';
import type { TransactionCategory } from './types';

export const CategoryIcons: Record<TransactionCategory, React.ElementType> = {
  // Income
  Salary: Landmark,
  Investments: TrendingUp,
  Gift: Gift,
  // Expenses
  Groceries: ShoppingCart,
  Rent: Home,
  Utilities: Zap,
  Transport: Car,
  Entertainment: Clapperboard,
  Health: HeartPulse,
  Other: HelpCircle,
};

export const getCategoryIcon = (category: TransactionCategory) => {
  const Icon = CategoryIcons[category] || HelpCircle;
  return <Icon className="h-4 w-4" />;
};

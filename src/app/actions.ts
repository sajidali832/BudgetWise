"use server";

import { getBudgetTips as getBudgetTipsFlow, type BudgetTipsInput } from '@/ai/flows/ai-powered-budget-tips';

export async function getAIBudgetTips(input: BudgetTipsInput) {
  try {
    const result = await getBudgetTipsFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('AI Budget Tips Error:', error);
    return { success: false, error: 'An error occurred while generating AI budget tips. Please try again.' };
  }
}

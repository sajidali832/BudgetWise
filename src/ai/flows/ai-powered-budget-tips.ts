'use server';

/**
 * @fileOverview Provides AI-driven personalized recommendations for users to save more and manage expenses.
 *
 * - `getBudgetTips` - A function that analyzes the user's budget and expenses to provide personalized recommendations.
 * - `BudgetTipsInput` - The input type for the `getBudgetTips` function.
 * - `BudgetTipsOutput` - The return type for the `getBudgetTips` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetTipsInputSchema = z.object({
  income: z
    .array(
      z.object({
        category: z.string().describe('The category of income (e.g., salary, investments).'),
        amount: z.number().describe('The amount of income.'),
      })
    )
    .describe('The user\'s income transactions with categories and amounts.'),
  expenses: z
    .array(
      z.object({
        category: z.string().describe('The category of expense (e.g., groceries, rent, utilities).'),
        amount: z.number().describe('The amount of expense.'),
      })
    )
    .describe('The user\'s expense transactions with categories and amounts.'),
  budgetLimits: z
    .array(
      z.object({
        category: z.string().describe('The category for the budget limit.'),
        limit: z.number().describe('The budget limit for the category.'),
      })
    )
    .describe('The user\'s set monthly budget limits for each category.'),
});
export type BudgetTipsInput = z.infer<typeof BudgetTipsInputSchema>;

const BudgetTipsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of personalized recommendations for saving and managing expenses.'),
  summary: z.string().describe('A summary of expenses with incorporated suggestions.')
});
export type BudgetTipsOutput = z.infer<typeof BudgetTipsOutputSchema>;

export async function getBudgetTips(input: BudgetTipsInput): Promise<BudgetTipsOutput> {
  return budgetTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetTipsPrompt',
  input: {schema: BudgetTipsInputSchema},
  output: {schema: BudgetTipsOutputSchema},
  prompt: `You are an AI-powered personal finance assistant. Analyze the user\'s income, expenses, and budget limits to provide personalized recommendations for saving and managing expenses.

  Income:
  {{#each income}}
  - Category: {{category}}, Amount: {{amount}}
  {{/each}}

  Expenses:
  {{#each expenses}}
  - Category: {{category}}, Amount: {{amount}}
  {{/each}}

  Budget Limits:
  {{#each budgetLimits}}
  - Category: {{category}}, Limit: {{limit}}
  {{/each}}

  Provide a numbered list of actionable recommendations for the user to save money and manage their expenses better.  Also provide a short summary of expenses and incorporate the budget tips in this summary.
  `,
});

const budgetTipsFlow = ai.defineFlow(
  {
    name: 'budgetTipsFlow',
    inputSchema: BudgetTipsInputSchema,
    outputSchema: BudgetTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

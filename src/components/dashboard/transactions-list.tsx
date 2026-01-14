"use client";

import { useBudget } from "@/contexts/budget-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon } from "@/lib/icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export function TransactionsList({ className }: { className?: string }) {
  const { transactions, loading } = useBudget();

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>A list of your recent income and expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading.transactions ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16" /></TableCell>
                </TableRow>
              ))
            ) : transactions.length > 0 ? (
              transactions.slice(0, 10).map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="font-medium">{t.description}</div>
                    <div className="block text-sm text-muted-foreground sm:hidden">
                      {t.category}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="flex items-center w-fit gap-1">
                      {getCategoryIcon(t.category)}
                      {t.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(t.date as Date, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${t.type === 'income' ? 'text-accent' : 'text-destructive'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No transactions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

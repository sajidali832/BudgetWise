"use client";

import { Button } from "@/components/ui/button";
import { AddTransactionDialog } from "./add-transaction-dialog";
import { LogOut, Landmark, PlusCircle } from "lucide-react";
import { useAuth } from "@/firebase";
import { useSidebar } from "../ui/sidebar";

export function Header({ children }: { children?: React.ReactNode }) {
  const auth = useAuth();
  const { isMobile } = useSidebar();
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      {children}
      <div className="hidden items-center gap-2 md:flex">
        <Landmark className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
          BudgetWise
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <AddTransactionDialog>
           <Button size={isMobile ? "icon" : "default"} className="transition-all duration-300 ease-in-out hover:scale-105 active:scale-95">
            <PlusCircle />
            <span className="hidden md:inline">Add Transaction</span>
          </Button>
        </AddTransactionDialog>
        <Button variant="outline" size="icon" onClick={() => auth.signOut()} className="transition-all duration-300 ease-in-out hover:scale-105 active:scale-95">
          <LogOut />
          <span className="sr-only">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { AddTransactionDialog } from "./add-transaction-dialog";
import { LogOut, Landmark, PlusCircle, User as UserIcon } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header({ children }: { children?: React.ReactNode }) {
  const auth = useAuth();
  const { user } = useUser();

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'G';
    const name = user?.displayName || email;
    const parts = name.split(' ');
    if (parts.length > 1 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      {children}
      <div className="flex items-center gap-2">
        <Landmark className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
          BudgetWise
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <AddTransactionDialog>
           <Button className="transition-all duration-300 ease-in-out hover:scale-105 active:scale-95">
            <PlusCircle />
            <span className="hidden md:inline">Add Transaction</span>
            <span className="sr-only md:hidden">Add Transaction</span>
          </Button>
        </AddTransactionDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.photoURL ?? ''} alt="User avatar" />
                <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
               <p className="truncate text-sm font-medium leading-none text-foreground">
                {user?.displayName || (user?.isAnonymous ? 'Guest User' : user?.email) }
              </p>
              {!user?.displayName && !user?.isAnonymous && <p className="truncate text-xs text-muted-foreground">{user?.email}</p>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => auth.signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

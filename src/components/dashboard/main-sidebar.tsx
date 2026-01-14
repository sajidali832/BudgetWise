"use client";

import {
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser, useAuth } from "@/firebase";
import { LogOut, PiggyBank } from "lucide-react";
import { Button } from "../ui/button";

export function MainSidebar() {
  const { user } = useUser();
  const auth = useAuth();
  const { state } = useSidebar();
  
  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'G';
    const name = user?.displayName || email;
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <PiggyBank className="size-7 text-primary transition-transform duration-300 group-data-[collapsible=icon]:-rotate-12" />
            <h1 className="font-headline text-xl font-bold tracking-tight text-foreground transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">
                BudgetWise
            </h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {/* Navigation items can be added here */}
      </SidebarContent>
      <SidebarFooter className="p-2">
        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 hover:bg-sidebar-accent">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.photoURL ?? ''} alt="User avatar" />
              <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5 transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">
              <p className="truncate text-sm font-medium leading-none text-foreground">
                {user?.displayName || (user?.isAnonymous ? 'Guest User' : user?.email) }
              </p>
              {!user?.displayName && !user?.isAnonymous && <p className="truncate text-xs text-muted-foreground">{user?.email}</p>}
            </div>
             <Button variant="ghost" size="icon" onClick={() => auth.signOut()} className="ml-auto transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">
                <LogOut className="h-4 w-4"/>
             </Button>
        </div>
      </SidebarFooter>
    </>
  );
}

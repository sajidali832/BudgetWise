'use client';

import { useUser } from '@/firebase';
import LoginPage from '@/components/auth/login-page';
import DashboardPage from '@/components/dashboard/dashboard-page';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <DashboardPage />;
}

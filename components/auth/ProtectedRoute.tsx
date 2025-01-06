'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user && pathname !== '/auth') {
      router.push('/auth');
    } else if (user && pathname === '/auth') {
      router.push('/');
    }
  }, [user, router, pathname]);

  if (!user && pathname !== '/auth') {
    return null;
  }

  return <>{children}</>;
} 
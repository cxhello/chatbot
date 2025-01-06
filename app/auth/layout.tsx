'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return <>{children}</>;
} 
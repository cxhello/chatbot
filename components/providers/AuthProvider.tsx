'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import { useChatStore } from '@/store/useChatStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useStore();
  const { reset } = useChatStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          id: user.uid,
          email: user.email || '',
          name: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
        });
      } else {
        setUser(null);
        reset(); // 用户登出时重置聊天状态
      }
    });

    return () => unsubscribe();
  }, [setUser, reset]);

  return <>{children}</>;
} 
'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import { useChatStore } from '@/store/useChatStore';

export function Navbar() {
  const { user } = useStore();
  const { reset } = useChatStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      reset();
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold">AI Chat</span>
          </div>
          {user && (
            <div className="flex items-center">
              <span className="mr-4">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm"
              >
                登出
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 
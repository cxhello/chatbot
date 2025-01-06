'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';

export default function Home() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen">
        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar />
          <ChatArea />
        </div>
      </main>
    </ProtectedRoute>
  );
}

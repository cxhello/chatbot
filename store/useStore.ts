import { create } from 'zustand';
import { User } from '../types/chat';

interface Store {
  user: User | null;
  setUser: (user: User | null) => void;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  currentChatId: null,
  setCurrentChatId: (id) => set({ currentChatId: id }),
})); 
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: null | Record<string, any>;
  setAuth: (token: string, userData: Record<string, any>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      setAuth: (token, userData) => set({ isAuthenticated: true, token, user: userData }),
      logout: () => set({ isAuthenticated: false, token: null, user: null }),
    }),
    {
      name: 'flowgrid-auth', // unique name
    }
  )
);

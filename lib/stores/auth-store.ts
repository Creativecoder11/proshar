import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Retailer } from '@/types/retailer';

interface AuthState {
  token: string | null;
  retailer: Retailer | null;
  hasHydrated: boolean;
  login: (token: string, retailer: Retailer) => void;
  logout: () => void;
  updateRetailer: (retailer: Retailer) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      retailer: null,
      hasHydrated: false,
      login: (token, retailer) => {
        set({ token, retailer });
      },
      logout: () => {
        set({ token: null, retailer: null });
      },
      updateRetailer: (retailer) => {
        set({ retailer });
      },
      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },
    }),
    {
      name: 'cocodile-auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Error rehydrating auth store:', error);
            return;
          }
          // After rehydration, mark as hydrated
          if (state) {
            state.setHasHydrated(true);
          }
        };
      },
    }
  )
);

// Selector hook for isAuthenticated (computed from token and retailer)
export const useIsAuthenticated = () => {
  const token = useAuthStore((state) => state.token);
  const retailer = useAuthStore((state) => state.retailer);
  return !!(token && retailer);
};


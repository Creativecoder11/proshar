import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SignupFormData } from '@/types/retailer';

interface SignupState {
  formData: Partial<SignupFormData>;
  currentStep: number;
  setFormData: (data: Partial<SignupFormData>) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
}

const initialState = {
  formData: {},
  currentStep: 1,
};

export const useSignupStore = create<SignupState>()(
  persist(
    (set) => ({
      ...initialState,

      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setCurrentStep: (step) =>
        set({ currentStep: step }),

      reset: () => {
        set(initialState);
        // ✅ Clear persisted storage
        localStorage.removeItem('cocodile-signup-storage');
      },
    }),
    {
      name: 'cocodile-signup-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

import { create } from "zustand";

interface ModalState {
  isLoginModalOpen: boolean;
  isSignupMode: boolean;
  isLoggedIn: boolean;

  setIsLoggedIn: (value: boolean) => void;
  changeMode: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useLoginModalStore = create<ModalState>((set) => ({
  isLoginModalOpen: false,
  isSignupMode: false,
  isLoggedIn: false,

  setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
  changeMode: () => set((state) => ({ isSignupMode: !state.isSignupMode })),
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));

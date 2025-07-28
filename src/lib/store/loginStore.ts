import { create } from "zustand";

interface ModalState {
  isLoginModalOpen: boolean;
  isSignupMode: boolean;
  isLoggedIn: boolean;

  setIsLoggedIn: () => void;
  changeMode: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useLoginModalStore = create<ModalState>((set) => ({
  isLoginModalOpen: false,
  isSignupMode: false,
  isLoggedIn: false,

  setIsLoggedIn: () => set((state) => ({ isLoggedIn: !state.isLoggedIn })),
  changeMode: () => set((state) => ({ isSignupMode: !state.isSignupMode })),
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));

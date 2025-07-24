import { create } from "zustand";

interface ModalState {
  isLoginModalOpen: boolean;
  isSignupMode: boolean;
  changeMode: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useLoginModalStore = create<ModalState>((set) => ({
  isLoginModalOpen: false,
  isSignupMode: false,
  changeMode: () => set((state) => ({ isSignupMode: !state.isSignupMode })),
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));

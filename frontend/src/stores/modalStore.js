import { create } from "zustand";

export const useModalStore = create((set, get) => ({
  isOpen: false,
  config: {
    type: "confirm", 
    title: "",
    message: "",
    confirmText: "Ya",
    cancelText: "Batal",
  },
  resolver: null, 

  openModal: (config) => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        config: { ...get().config, ...config }, 
        resolver: resolve, 
      });
    });
  },

  closeModal: (result) => {
    const { resolver } = get();
    if (resolver) {
      resolver(result); 
    }
    set({ isOpen: false, resolver: null }); 
  },
}));

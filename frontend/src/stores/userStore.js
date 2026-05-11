import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import instance from "../utils/axios";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isUserLoading: true,

      login: (userData) => {
        set({ user: userData });
      },

      logout: () => {
        set({ user: null });
        localStorage.removeItem("porto-user");
      },

      updateUser: (newProfileData) => {
        set((state) => ({
          user: { ...state.user, ...newProfileData },
        }));
      },

      checkUserSession: async () => {
        const storedJSON = localStorage.getItem("porto-user");

        if (!storedJSON) {
          set({ user: null, isUserLoading: false });
          return;
        }

        set({ isUserLoading: true });
        try {
          const response = await instance.get("/users/getuser");

          if (!response.data.user) {
            get().logout();
            set({ isUserLoading: false });
          } else {
            set({ user: response.data.user, isUserLoading: false });
          }
        } catch (error) {
          get().logout();
          set({ isUserLoading: false });
        }
      },

      logoutApi: async () => {
        try {
          await instance.get("/users/logout");
          get().logout();
          return true;
        } catch (err) {
          get().logout();
          throw err;
        }
      },
    }),
    {
      name: "porto-user",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

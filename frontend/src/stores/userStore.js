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
          set({ user: response.data.user, isUserLoading: false });
        } catch (error) {
          if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
          ) {
            console.log("Sesi berakhir, menghapus data lokal.");
          } else {
            console.error("Gagal cek sesi:", error);
          }

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
          console.error("Gagal logout API:", err);
          get().logout();
          throw err;
        }
      },
    }),
    {
      name: "porto-user",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);

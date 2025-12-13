import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import instance from "../utils/axios";

const lightThemes = ["emerald", "garden", "light", "corporate"];
const darkThemes = [
  "synthwave",
  "dark",
  "black",
  "business",
  "night",
  "dim",
  "abyss",
];

const initialSiteData = {
  brandName: "webMazda.N",
  brandNameShort: "Mazda Nawallsyah",
  jobTitle: "Front-End Developer",
  location: "Powered by https://vercel.com",
  contactLinks: {
    email: "",
    whatsapp: "",
    telegram: "",
    linkedin: "",
    instagram: "",
    github: "",
  },
  profileImages: [],
  aboutParagraph: "...",
  typeAnimationSequenceString: "...",
};

const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme;

    const osPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return osPrefersDark ? "night" : "emerald";
  }
  return "emerald"; 
};

export const useSiteStore = create(
  persist(
    (set, get) => ({
      theme: getInitialTheme(), 

      initTheme: () => {
        const currentTheme = get().theme;
        document.documentElement.setAttribute("data-theme", currentTheme);
        localStorage.setItem("theme", currentTheme);
      },

      toggleTheme: () => {
        const prevTheme = get().theme;
        const isCurrentLight = lightThemes.includes(prevTheme);
        let newTheme;

        if (isCurrentLight) {
          newTheme = darkThemes[Math.floor(Math.random() * darkThemes.length)];
        } else {
          newTheme = lightThemes[Math.floor(Math.random() * lightThemes.length)];
        }

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        set({ theme: newTheme });
        
        return newTheme;
      },

      getThemeMode: () => {
        return lightThemes.includes(get().theme) ? "light" : "dark";
      },

      siteData: initialSiteData,
      isSiteDataLoading: false,

      fetchSiteData: async () => {
        set({ isSiteDataLoading: true });
        try {
          const response = await instance.get("/sitedata");
          set({ siteData: response.data, isSiteDataLoading: false });
        } catch (error) {
          console.error("Zustand: Gagal ambil site data", error);
          set({ isSiteDataLoading: false });
        }
      },

      updateSiteData: async (newFormData) => {
        try {
          const response = await instance.put("/sitedata", newFormData);
          set({ siteData: response.data });
          return response.data;
        } catch (error) {
          console.error("Zustand: Gagal update site data", error);
          throw error;
        }
      },

      uploadProfileImage: async (formData) => {
        try {
          const response = await instance.post(
            "/sitedata/upload-image",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          set({ siteData: response.data });
          return response.data;
        } catch (error) {
          console.error("Zustand: Gagal upload image", error);
          throw error;
        }
      },

      updateProfileImage: async (formData) => {
        try {
          const response = await instance.put(
            "/sitedata/update-image",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          set({ siteData: response.data });
          return response.data;
        } catch (error) {
          console.error("Zustand: Gagal update image", error);
          throw error;
        }
      },

      deleteProfileImage: async (imageUrl) => {
        try {
          const response = await instance.delete("/sitedata/delete-image", {
            data: { imageUrl },
          });
          set({ siteData: response.data });
          return response.data;
        } catch (error) {
          console.error("Zustand: Gagal delete image", error);
          throw error;
        }
      },
    }),
    {
      name: "site-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme, siteData: state.siteData }),

      onRehydrateStorage: () => (state) => {
        if (state && state.theme) {
          document.documentElement.setAttribute("data-theme", state.theme);
        }
      },
    }
  )
);

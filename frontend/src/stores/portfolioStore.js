import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import instance from "../utils/axios";

const initialHardSkills = [
  // Core Web
  { id: 1, icon: "logos:html-5", name: "HTML" },
  { id: 2, icon: "logos:css-3", name: "CSS" },
  { id: 3, icon: "logos:javascript", name: "JavaScript" },
  { id: 4, icon: "logos:typescript-icon", name: "TypeScript" },

  // Frameworks / Libraries Frontend
  { id: 5, icon: "logos:vue", name: "Vue.js" },
  { id: 6, icon: "logos:react", name: "React.js" },
  { id: 7, icon: "logos:angular-icon", name: "Angular" },
  { id: 8, icon: "logos:nuxt-icon", name: "Nuxt.js" },
  { id: 9, icon: "logos:nextjs-icon", name: "Next.js" },
  { id: 10, icon: "logos:svelte-icon", name: "Svelte" },
  { id: 11, icon: "logos:jquery", name: "jQuery" },

  // CSS Frameworks / UI Libraries
  { id: 12, icon: "logos:bootstrap", name: "Bootstrap CSS" },
  { id: 13, icon: "logos:tailwindcss-icon", name: "Tailwind CSS" },
  { id: 14, icon: "logos:material-ui", name: "Material-UI (MUI)" },
  { id: 15, icon: "logos:sass", name: "Sass/SCSS" },

  // State Management
  { id: 16, icon: "logos:redux", name: "Redux" },
  { id: 17, icon: "noto:bear", name: "Zustand" },
  { id: 18, icon: "logos:pinia", name: "Pinia" },

  // Backend
  { id: 19, icon: "logos:nodejs-icon", name: "Node.js" },
  { id: 20, icon: "logos:express", name: "Express.js" },
  { id: 21, icon: "logos:php", name: "PHP" },
  { id: 22, icon: "logos:laravel", name: "Laravel" },
  { id: 23, icon: "logos:go", name: "Golang" },

  // Tools
  { id: 24, icon: "mdi:api", name: "RESTful API" },
  { id: 25, icon: "logos:git-icon", name: "Git" },
  { id: 26, icon: "logos:docker-icon", name: "Docker" },
  { id: 27, icon: "logos:figma", name: "Figma" },
  { id: 28, icon: "logos:npm-icon", name: "npm/yarn" },
  { id: 29, icon: "logos:webpack", name: "Webpack" },
  { id: 30, icon: "logos:vitejs", name: "Vite" },

  // Database (ID 31-33)
  { id: 31, icon: "logos:mongodb-icon", name: "MongoDB" },
  { id: 32, icon: "logos:postgresql", name: "PostgreSQL" },
  { id: 33, icon: "logos:mysql-icon", name: "MySQL" },

  // Testing (ID 34-35)
  { id: 34, icon: "logos:jest", name: "Jest" },
  { id: 35, icon: "logos:testing-library", name: "React Testing Library" },

  // Deployment & CI/CD (ID 36-38)
  { id: 36, icon: "logos:vercel-icon", name: "Vercel" },
  { id: 37, icon: "logos:netlify-icon", name: "Netlify" },
  { id: 38, icon: "logos:github-actions", name: "GitHub Actions" },

  // Animasi & Visualisasi (ID 39-41)
  { id: 39, icon: "logos:framer", name: "Framer Motion" },
  { id: 40, icon: "logos:greensock-icon", name: "GSAP" },
  { id: 41, icon: "logos:threejs", name: "Three.js" },

  // API
  { id: 42, icon: "logos:graphql", name: "GraphQL" },
];

export const categories = [
  "Semua",
  "Universitas",
  "Online Course",
  "Bootcamp",
  "Nasional",
  "Internasional",
];

export const usePortfolioStore = create(
  persist(
    (set, get) => ({
      historyData: { education: [], experience: [] },
      isHistoryLoading: false,

      skillsData: {
        hardSkills: [],
        softSkills: [],
        masterHardSkills: initialHardSkills,
      },
      isSkillsLoading: false,

      projects: [],
      isProjectsLoading: false,

      sertifikatData: [],
      isSertifikatLoading: false,

      fetchHistoryData: async () => {
        set({ isHistoryLoading: true });
        try {
          const response = await instance.get("/history");
          set({ historyData: response.data, isHistoryLoading: false });
        } catch (error) {
          console.error("Zustand: Gagal load history", error);
          set({ isHistoryLoading: false });
        }
      },

      addHistoryItem: async (formData) => {
        try {
          const response = await instance.post("/history", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const newItem = response.data;
          const type = newItem.type; // education / experience

          set((state) => ({
            historyData: {
              ...state.historyData,
              [type]: [newItem, ...state.historyData[type]],
            },
          }));
          return newItem;
        } catch (error) {
          console.error("Gagal tambah history:", error);
          throw error;
        }
      },

      updateHistoryItem: async (itemId, formData) => {
        try {
          const response = await instance.put(`/history/${itemId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const updatedItem = response.data;
          const type = updatedItem.type;

          set((state) => ({
            historyData: {
              ...state.historyData,
              [type]: state.historyData[type].map((item) =>
                item._id === updatedItem._id ? updatedItem : item
              ),
            },
          }));
          return updatedItem;
        } catch (error) {
          console.error("Gagal update history:", error);
          throw error;
        }
      },

      deleteHistoryItem: async (itemId, type) => {
        try {
          await instance.delete(`/history/${itemId}`);
          set((state) => ({
            historyData: {
              ...state.historyData,
              [type]: state.historyData[type].filter(
                (item) => item._id !== itemId
              ),
            },
          }));
        } catch (error) {
          console.error("Gagal hapus history:", error);
          throw error;
        }
      },

      fetchSkillsData: async () => {
        set({ isSkillsLoading: true });
        try {
          const response = await instance.get("/skills");
          set((state) => ({
            skillsData: {
              ...state.skillsData,
              hardSkills: response.data.hardSkills,
              softSkills: response.data.softSkills,
            },
            isSkillsLoading: false,
          }));
        } catch (error) {
          console.error("Zustand: Gagal load skills", error);
          set({ isSkillsLoading: false });
        }
      },

      addSoftSkill: async (skillName) => {
        const currentSoftSkills = get().skillsData.softSkills;
        const newSoftSkills = [...currentSoftSkills, skillName];
        try {
          const response = await instance.put("/skills", {
            softSkills: newSoftSkills,
          });
          set((state) => ({
            skillsData: {
              ...state.skillsData,
              softSkills: response.data.softSkills,
            },
          }));
        } catch (error) {
          console.error("Gagal nambah soft skill:", error);
          throw error;
        }
      },

      deleteSoftSkill: async (index) => {
        const currentSoftSkills = get().skillsData.softSkills;
        const newSoftSkills = currentSoftSkills.filter((_, i) => i !== index);
        try {
          const response = await instance.put("/skills", {
            softSkills: newSoftSkills,
          });
          set((state) => ({
            skillsData: {
              ...state.skillsData,
              softSkills: response.data.softSkills,
            },
          }));
        } catch (error) {
          console.error("Gagal hapus soft skill:", error);
          throw error;
        }
      },

      updateHardSkills: async (newHardSkills) => {
        try {
          const response = await instance.put("/skills", {
            hardSkills: newHardSkills,
          });
          set((state) => ({
            skillsData: {
              ...state.skillsData,
              hardSkills: response.data.hardSkills,
            },
          }));
        } catch (error) {
          console.error("Gagal update hard skills:", error);
          throw error;
        }
      },

      fetchProjects: async () => {
        set({ isProjectsLoading: true });
        try {
          const response = await instance.get("/projects");
          set({ projects: response.data, isProjectsLoading: false });
        } catch (error) {
          console.error("Gagal load projects:", error);
          set({ isProjectsLoading: false });
        }
      },

      addProject: async (formData) => {
        try {
          const response = await instance.post("/projects", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          set((state) => ({
            projects: [response.data, ...state.projects],
          }));
          return response.data;
        } catch (error) {
          console.error("Gagal tambah project:", error);
          throw error;
        }
      },

      updateProject: async (projectId, formData) => {
        try {
          const response = await instance.put(
            `/projects/${projectId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          set((state) => ({
            projects: state.projects.map((item) =>
              item._id === projectId ? response.data : item
            ),
          }));
          return response.data;
        } catch (error) {
          console.error("Gagal update project:", error);
          throw error;
        }
      },

      deleteProject: async (projectId) => {
        try {
          await instance.delete(`/projects/${projectId}`);
          set((state) => ({
            projects: state.projects.filter((item) => item._id !== projectId),
          }));
        } catch (error) {
          console.error("Gagal hapus project:", error);
          throw error;
        }
      },

      fetchSertifikat: async () => {
        set({ isSertifikatLoading: true });
        try {
          const response = await instance.get("/sertifikat");
          set({ sertifikatData: response.data, isSertifikatLoading: false });
        } catch (error) {
          console.error("Gagal load sertifikat:", error);
          set({ isSertifikatLoading: false });
        }
      },

      addSertifikat: async (formData) => {
        try {
          const response = await instance.post("/sertifikat", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          set((state) => ({
            sertifikatData: [response.data, ...state.sertifikatData],
          }));
          return response.data;
        } catch (error) {
          console.error("Gagal tambah sertifikat:", error);
          throw error;
        }
      },

      updateSertifikat: async (sertifId, formData) => {
        try {
          const response = await instance.put(
            `/sertifikat/${sertifId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          set((state) => ({
            sertifikatData: state.sertifikatData.map((item) =>
              item._id === sertifId ? response.data : item
            ),
          }));
          return response.data;
        } catch (error) {
          console.error("Gagal update sertifikat:", error);
          throw error;
        }
      },

      deleteSertifikat: async (sertifId) => {
        try {
          await instance.delete(`/sertifikat/${sertifId}`);
          set((state) => ({
            sertifikatData: state.sertifikatData.filter(
              (item) => item._id !== sertifId
            ),
          }));
        } catch (error) {
          console.error("Gagal hapus sertifikat:", error);
          throw error;
        }
      },
    }),
    {
      name: "portfolio-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        historyData: state.historyData,
        skillsData: state.skillsData,
      }),
    }
  )
);

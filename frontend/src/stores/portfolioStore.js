import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import instance from "../utils/axios";

export const initialHardSkills = [
  { id: 1, icon: "logos:html-5", name: "HTML" },
  { id: 2, icon: "logos:css-3", name: "CSS" },
  { id: 3, icon: "logos:javascript", name: "JavaScript" },
  { id: 4, icon: "logos:typescript-icon", name: "TypeScript" },
  { id: 5, icon: "logos:vue", name: "Vue.js" },
  { id: 6, icon: "logos:react", name: "React.js" },
  { id: 7, icon: "logos:angular-icon", name: "Angular" },
  { id: 8, icon: "logos:nuxt-icon", name: "Nuxt.js" },
  { id: 9, icon: "logos:nextjs-icon", name: "Next.js" },
  { id: 10, icon: "logos:svelte-icon", name: "Svelte" },
  { id: 11, icon: "skill-icons:jquery", name: "jQuery" },
  { id: 12, icon: "logos:bootstrap", name: "Bootstrap CSS" },
  { id: 13, icon: "logos:tailwindcss-icon", name: "Tailwind CSS" },
  { id: 14, icon: "logos:material-ui", name: "Material-UI (MUI)" },
  { id: 15, icon: "logos:sass", name: "Sass/SCSS" },
  { id: 16, icon: "logos:redux", name: "Redux" },
  { id: 17, icon: "devicon:zustand", name: "Zustand" },
  { id: 18, icon: "logos:pinia", name: "Pinia" },
  { id: 19, icon: "logos:nodejs-icon", name: "Node.js" },
  { id: 20, icon: "bxl:express-js", name: "Express.js" },
  { id: 21, icon: "logos:php", name: "PHP" },
  { id: 22, icon: "logos:laravel", name: "Laravel" },
  { id: 23, icon: "logos:go", name: "Golang" },
  { id: 24, icon: "mdi:api", name: "RESTful API" },
  { id: 25, icon: "logos:git-icon", name: "Git" },
  { id: 26, icon: "logos:docker-icon", name: "Docker" },
  { id: 27, icon: "logos:figma", name: "Figma" },
  { id: 28, icon: "logos:npm-icon", name: "npm/yarn" },
  { id: 29, icon: "logos:webpack", name: "Webpack" },
  { id: 30, icon: "logos:vitejs", name: "Vite" },
  { id: 31, icon: "logos:mongodb-icon", name: "MongoDB" },
  { id: 32, icon: "logos:postgresql", name: "PostgreSQL" },
  { id: 33, icon: "logos:mysql-icon", name: "MySQL" },
  { id: 34, icon: "logos:jest", name: "Jest" },
  { id: 35, icon: "logos:testing-library", name: "React Testing Library" },
  { id: 36, icon: "lineicons:vercel", name: "Vercel" },
  { id: 37, icon: "logos:netlify-icon", name: "Netlify" },
  { id: 38, icon: "logos:github-actions", name: "GitHub Actions" },
  { id: 39, icon: "logos:framer", name: "Framer Motion" },
  { id: 40, icon: "logos:greensock-icon", name: "GSAP" },
  { id: 41, icon: "tabler:brand-threejs", name: "Three.js" },
  { id: 42, icon: "logos:graphql", name: "GraphQL" },
  { id: 43, icon: "vscode-icons:file-type-word", name: "Ms. Word" },
  { id: 44, icon: "vscode-icons:file-type-excel", name: "Ms. Excel" },
  { id: 45, icon: "vscode-icons:file-type-powerpoint", name: "Ms. PowerPoint" },
  { id: 46, icon: "logos:visual-studio-code", name: "VS Code" },
  { id: 47, icon: "logos:postman-icon", name: "Postman" },
  { id: 48, icon: "bxl:motion-js", name: "Motion" },
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

      sertifikatData: [],
      isSertifikatLoading: false,

      fetchHistoryData: async () => {
        set({ isHistoryLoading: true });
        try {
          const response = await instance.get("/history");
          set({ historyData: response.data, isHistoryLoading: false });
        } catch (error) {
          set({ isHistoryLoading: false });
        }
      },

      addHistoryItem: async (formData) => {
        try {
          const response = await instance.post("/history", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const newItem = response.data;
          const type = newItem.type;

          set((state) => ({
            historyData: {
              ...state.historyData,
              [type]: [newItem, ...state.historyData[type]],
            },
          }));
          return newItem;
        } catch (error) {
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
                item._id === updatedItem._id ? updatedItem : item,
              ),
            },
          }));
          return updatedItem;
        } catch (error) {
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
                (item) => item._id !== itemId,
              ),
            },
          }));
        } catch (error) {
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
          throw error;
        }
      },

      fetchSertifikat: async () => {
        set({ isSertifikatLoading: true });
        try {
          const response = await instance.get("/sertifikat");
          set({ sertifikatData: response.data, isSertifikatLoading: false });
        } catch (error) {
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
          throw error;
        }
      },

      updateSertifikat: async (sertifId, formData) => {
        try {
          const response = await instance.put(
            `/sertifikat/${sertifId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
          );
          set((state) => ({
            sertifikatData: state.sertifikatData.map((item) =>
              item._id === sertifId ? response.data : item,
            ),
          }));
          return response.data;
        } catch (error) {
          throw error;
        }
      },

      deleteSertifikat: async (sertifId) => {
        try {
          await instance.delete(`/sertifikat/${sertifId}`);
          set((state) => ({
            sertifikatData: state.sertifikatData.filter(
              (item) => item._id !== sertifId,
            ),
          }));
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: "portfolio-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        historyData: state.historyData,
        skillsData: {
          hardSkills: state.skillsData.hardSkills,
          softSkills: state.skillsData.softSkills,
        },
      }),
    },
  ),
);

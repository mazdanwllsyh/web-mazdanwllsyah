import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import instance from "../utils/axios";

export const initialHardSkills = [
  // 01 Languanges & Core
  { icon: "logos:html-5", name: "HTML", category: "Markup" },
  { icon: "logos:css-3", name: "CSS", category: "Bahasa Pemrograman" },
  {
    icon: "logos:javascript",
    name: "JavaScript",
    category: "Bahasa Pemrograman",
  },
  {
    icon: "logos:typescript-icon",
    name: "TypeScript",
    category: "Bahasa Pemrograman",
  },
  { icon: "logos:php", name: "PHP", category: "Bahasa Pemrograman" },
  { icon: "logos:go", name: "Golang", category: "Bahasa Pemrograman" },
  {
    icon: "material-icon-theme:python",
    name: "Python",
    category: "Bahasa Pemrograman",
  },
  {
    icon: "skill-icons:java-light",
    name: "Java",
    category: "Bahasa Pemrograman",
  },

  // 02 Frameworks & Libraries
  {
    icon: "logos:react",
    name: "React.js",
    category: "Framework & Library",
  },
  { icon: "logos:vue", name: "Vue.js", category: "Framework & Library" },
  {
    icon: "logos:angular-icon",
    name: "Angular",
    category: "Framework & Library",
  },
  {
    icon: "logos:nuxt-icon",
    name: "Nuxt.js",
    category: "Framework & Library",
  },
  {
    icon: "logos:nextjs-icon",
    name: "Next.js",
    category: "Framework & Library",
  },
  {
    icon: "logos:svelte-icon",
    name: "Svelte",
    category: "Framework & Library",
  },
  {
    icon: "skill-icons:jquery",
    name: "jQuery",
    category: "Framework & Library",
  },
  {
    icon: "logos:laravel",
    name: "Laravel",
    category: "Framework & Library",
  },
  {
    icon: "logos:nodejs-icon",
    name: "Node.js",
    category: "Framework & Library",
  },
  {
    icon: "bxl:express-js",
    name: "Express.js",
    category: "Framework & Library",
  },
  {
    icon: "material-symbols:flutter",
    name: "Flutter",
    category: "Framework & Library",
  },
  {
    icon: "material-icon-theme:kotlin",
    name: "Kotlin",
    category: "Framework & Library",
  },
  {
    icon: "material-icon-theme:nest",
    name: "NEST.js",
    category: "Framework & Library",
  },
  {
    icon: "material-icon-theme:astro",
    name: "Astro.js",
    category: "Framework & Library",
  },
  {
    icon: "material-icon-theme:django",
    name: "Django",
    category: "Framework & Library",
  },
  {
    icon: "cib:flask",
    name: "Flask",
    category: "Framework & Library",
  },
  {
    icon: "devicon:inertiajs",
    name: "Inertia.js",
    category: "Framework & Library",
  },

  // 03 Styling & UI Tools
  {
    icon: "logos:bootstrap",
    name: "Bootstrap CSS",
    category: "Styling & UI",
  },
  {
    icon: "logos:tailwindcss-icon",
    name: "Tailwind CSS",
    category: "Styling & UI",
  },
  {
    icon: "logos:material-ui",
    name: "Material-UI (MUI)",
    category: "Styling & UI",
  },
  { icon: "logos:sass", name: "Sass/SCSS", category: "Styling & UI" },
  { icon: "logos:daisyui-icon", name: "DaisyUI", category: "Styling & UI" },
  { icon: "bxl:shadcn-ui", name: "Shadcn UI", category: "Styling & UI" },
  { icon: "bxl:motion-js", name: "Motion", category: "Styling & UI" },
  {
    icon: "simple-icons:primereact",
    name: "PrimeReact",
    category: "Styling & UI",
  },
  {
    icon: "devicon:antdesign",
    name: "Ant Design",
    category: "Styling & UI",
  },
  {
    icon: "simple-icons:chakraui",
    name: "Chakra UI",
    category: "Styling & UI",
  },
  { icon: "simple-icons:mantine", name: "Mantine", category: "Styling & UI" },
  { icon: "logos:semantic-ui", name: "Semantic UI", category: "Styling & UI" },
  {
    icon: "streamline-logos:framer-logo-block",
    name: "Framer Motion",
    category: "Styling & UI",
  },
  {
    icon: "logos:greensock-icon",
    name: "GSAP",
    category: "Styling & UI",
  },
  {
    icon: "tabler:brand-threejs",
    name: "Three.js",
    category: "Styling & UI",
  },
  {
    icon: "devicon-plain:bulma",
    name: "Bulma CSS",
    category: "Styling & UI",
  },

  // 04 State Management
  { icon: "logos:redux", name: "Redux", category: "State Management" },
  {
    icon: "devicon:zustand",
    name: "Zustand",
    category: "State Management",
  },
  { icon: "logos:pinia", name: "Pinia", category: "State Management" },

  // 05 Databases
  { icon: "logos:mongodb-icon", name: "MongoDB", category: "Database" },
  {
    icon: "logos:postgresql",
    name: "PostgreSQL",
    category: "Database",
  },
  { icon: "logos:mysql", name: "MySQL", category: "Database" },

  // 06 Tools & Others
  {
    icon: "dashicons:rest-api",
    name: "RESTful API",
    category: "Tools & Lainnya",
  },
  {
    icon: "logos:graphql",
    name: "GraphQL",
    category: "Tools & Lainnya",
  },
  { icon: "logos:git-icon", name: "Git", category: "Tools & Lainnya" },
  {
    icon: "logos:docker-icon",
    name: "Docker",
    category: "Tools & Lainnya",
  },
  { icon: "logos:figma", name: "Figma", category: "Tools & Lainnya" },
  {
    icon: "logos:npm-icon",
    name: "npm",
    category: "Tools & Lainnya",
  },
  {
    icon: "logos:webpack",
    name: "Webpack",
    category: "Tools & Lainnya",
  },
  { icon: "logos:vitejs", name: "Vite", category: "Tools & Lainnya" },
  { icon: "logos:jest", name: "Jest", category: "Tools & Lainnya" },
  {
    icon: "logos:testing-library",
    name: "React Testing Library",
    category: "Tools & Lainnya",
  },
  {
    icon: "logos:postman-icon",
    name: "Postman",
    category: "Tools & Lainnya",
  },
  {
    icon: "lineicons:yarn",
    name: "Yarn",
    category: "Tools & Lainnya",
  },
  {
    icon: "devicon-plain:bun",
    name: "Bun",
    category: "Tools & Lainnya",
  },
  {
    icon: "material-icon-theme:pnpm",
    name: "PNPM",
    category: "Tools & Lainnya",
  },
  {
    icon: "simple-icons:pwa",
    name: "PWA",
    category: "Tools & Lainnya",
  },
  {
    icon: "material-icon-theme:babel",
    name: "Babel",
    category: "Tools & Lainnya",
  },

  // 07 Cloud & Deployment
  {
    icon: "lineicons:vercel",
    name: "Vercel",
    category: "Cloud & Deploy",
  },
  {
    icon: "logos:netlify-icon",
    name: "Netlify",
    category: "Cloud & Deploy",
  },
  {
    icon: "logos:github-actions",
    name: "GitHub Actions",
    category: "Cloud & Deploy",
  },

  // 08 Office & IDE
  {
    icon: "logos:visual-studio-code",
    name: "VS Code",
    category: "IDE & Office",
  },
  {
    icon: "material-symbols:antigravity",
    name: "Antigravity AI IDEs",
    category: "IDE & Office",
  },
  {
    icon: "devicon:jetbrains",
    name: "JetBrains IDEs",
    category: "IDE & Office",
  },
  {
    icon: "material-icon-theme:cursor",
    name: "Cursor AI IDEs",
    category: "IDE & Office",
  },
  {
    icon: "bxl:grok",
    name: "Grok AI IDEs",
    category: "IDE & Office",
  },
  {
    icon: "vscode-icons:file-type-word",
    name: "Ms. Word",
    category: "IDE & Office",
  },
  {
    icon: "vscode-icons:file-type-excel",
    name: "Ms. Excel",
    category: "IDE & Office",
  },
  {
    icon: "vscode-icons:file-type-powerpoint",
    name: "Ms. PowerPoint",
    category: "IDE & Office",
  },
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

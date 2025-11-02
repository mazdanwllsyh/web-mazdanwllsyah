import React, {
  createContext,
  useMemo,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
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

const categories = [
  "Semua",
  "Universitas",
  "Online Course",
  "Bootcamp",
  "Nasional",
  "Internasional",
];

const PortfolioDataContext = createContext(null);

export const PortfolioDataProvider = ({ children }) => {
  const [historyData, setHistoryData] = useState({
    education: [],
    experience: [],
  });
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setIsHistoryLoading(true);
        const response = await instance.get("/history");
        setHistoryData(response.data);
      } catch (error) {
        console.error("Gagal memuat historyData dari API:", error);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    fetchHistoryData();
  }, []);

  const [skillsData, setSkillsData] = useState({
    hardSkills: [],
    softSkills: [],
    masterHardSkills: initialHardSkills,
  });
  const [isSkillsLoading, setIsSkillsLoading] = useState(true);

  const [projects, setProjects] = useState([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsProjectsLoading(true);
        const response = await instance.get("/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Gagal memuat projects dari API:", error);
      } finally {
        setIsProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        setIsSkillsLoading(true);
        const response = await instance.get("/skills");
        setSkillsData((prev) => ({
          ...prev,
          hardSkills: response.data.hardSkills,
          softSkills: response.data.softSkills,
        }));
      } catch (error) {
        console.error("Gagal memuat skillsData dari API:", error);
      } finally {
        setIsSkillsLoading(false);
      }
    };
    fetchSkillsData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("historyData", JSON.stringify(historyData));
    } catch (error) {
      console.error("Gagal menyimpan historyData:", error);
    }
  }, [historyData]);

  useEffect(() => {
    try {
      const { masterHardSkills, ...dataToStore } = skillsData;
      localStorage.setItem("skillsData", JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Gagal menyimpan skillsData:", error);
    }
  }, [skillsData]);

  const addHistoryItem = useCallback(async (formData) => {
    const response = await instance.post("/history", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const newItem = response.data;
    const type = newItem.type;

    setHistoryData((prev) => ({
      ...prev,
      [type]: [newItem, ...prev[type]],
    }));
    return newItem;
  }, []);

  const updateHistoryItem = useCallback(async (itemId, formData) => {
    const response = await instance.put(`/history/${itemId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const updatedItem = response.data;
    const type = updatedItem.type;

    setHistoryData((prev) => ({
      ...prev,
      [type]: prev[type].map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      ),
    }));
    return updatedItem;
  }, []);

  const deleteHistoryItem = useCallback(async (itemId, type) => {
    await instance.delete(`/history/${itemId}`);

    setHistoryData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item._id !== itemId),
    }));
  }, []);

  const addSoftSkill = useCallback(
    async (skillName) => {
      const newSoftSkills = [...skillsData.softSkills, skillName];
      try {
        const response = await instance.put("/skills", {
          softSkills: newSoftSkills,
        });
        setSkillsData((prev) => ({
          ...prev,
          softSkills: response.data.softSkills,
        }));
      } catch (error) {
        console.error("Gagal menambah soft skill:", error);
        throw error;
      }
    },
    [skillsData.softSkills]
  );

  const deleteSoftSkill = useCallback(
    async (index) => {
      const newSoftSkills = skillsData.softSkills.filter((_, i) => i !== index);
      try {
        const response = await instance.put("/skills", {
          softSkills: newSoftSkills,
        });
        setSkillsData((prev) => ({
          ...prev,
          softSkills: response.data.softSkills,
        }));
      } catch (error) {
        console.error("Gagal menghapus soft skill:", error);
        throw error;
      }
    },
    [skillsData.softSkills]
  );

  const updateHardSkills = useCallback(async (newHardSkills) => {
    try {
      const response = await instance.put("/skills", {
        hardSkills: newHardSkills,
      });
      setSkillsData((prev) => ({
        ...prev,
        hardSkills: response.data.hardSkills,
      }));
    } catch (error) {
      console.error("Gagal update hard skills:", error);
      throw error;
    }
  }, []);

  const addProject = useCallback(async (formData) => {
    const response = await instance.post("/projects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const newProject = response.data;
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  }, []);

  const updateProject = useCallback(async (projectId, formData) => {
    const response = await instance.put(`/projects/${projectId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const updatedProject = response.data;
    setProjects((prev) =>
      prev.map((item) =>
        item._id === updatedProject._id ? updatedProject : item
      )
    );
    return updatedProject;
  }, []);

  const deleteProject = useCallback(async (projectId) => {
    await instance.delete(`/projects/${projectId}`);
    setProjects((prev) => prev.filter((item) => item._id !== projectId));
  }, []);

  const [sertifikatData, setSertifikatData] = useState([]);
  const [isSertifikatLoading, setIsSertifikatLoading] = useState(true);

  useEffect(() => {
    const fetchSertifikat = async () => {
      try {
        setIsSertifikatLoading(true);
        const response = await instance.get("/sertifikat");
        setSertifikatData(response.data);
      } catch (error) {
        console.error("Gagal memuat sertifikat dari API:", error);
      } finally {
        setIsSertifikatLoading(false);
      }
    };
    fetchSertifikat();
  }, []);

  const addSertifikat = useCallback(async (formData) => {
    const response = await instance.post("/sertifikat", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const newSertifikat = response.data;
    setSertifikatData((prev) => [newSertifikat, ...prev]);
    return newSertifikat;
  }, []);

  const updateSertifikat = useCallback(async (sertifId, formData) => {
    const response = await instance.put(`/sertifikat/${sertifId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const updatedSertifikat = response.data;
    setSertifikatData((prev) =>
      prev.map((item) =>
        item._id === updatedSertifikat._id ? updatedSertifikat : item
      )
    );
    return updatedSertifikat;
  }, []);

  const deleteSertifikat = useCallback(async (sertifId) => {
    await instance.delete(`/sertifikat/${sertifId}`);
    setSertifikatData((prev) => prev.filter((item) => item._id !== sertifId));
  }, []);

  const value = useMemo(
    () => ({
      historyData,
      isHistoryLoading,
      addHistoryItem,
      updateHistoryItem,
      deleteHistoryItem,

      skillsData,
      isSkillsLoading,
      addSoftSkill,
      deleteSoftSkill,
      updateHardSkills,

      projects,
      isProjectsLoading,
      addProject,
      updateProject,
      deleteProject,

      sertifikatData,
      isSertifikatLoading,
      categories,
      addSertifikat,
      updateSertifikat,
      deleteSertifikat,
    }),
    [
      historyData,
      isHistoryLoading,
      addHistoryItem,
      updateHistoryItem,
      deleteHistoryItem,

      skillsData,
      isSkillsLoading,

      projects,
      isProjectsLoading,
      addProject,
      updateProject,
      deleteProject,

      sertifikatData,
      isSertifikatLoading,
      addSertifikat,
      updateSertifikat,
      deleteSertifikat,
    ]
  );

  return (
    <PortfolioDataContext.Provider value={value}>
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext);
  if (context === null) {
    throw new Error(
      "usePortfolioData harus digunakan di dalam PortfolioDataProvider"
    );
  }
  return context;
};

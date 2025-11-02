import React, { createContext, useState, useEffect, useContext } from "react";
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
  brandNameShort: "MazdaN",
  jobTitle: "Front-End Developer",
  location: "Powered by https://bejalen.com",
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

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme;
    }
    return "emerald";
  });

  const themeMode = lightThemes.includes(theme) ? "light" : "dark";

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      let newTheme;
      const isCurrentLight = lightThemes.includes(prevTheme);

      if (isCurrentLight) {
        newTheme = darkThemes[Math.floor(Math.random() * darkThemes.length)];
      } else {
        newTheme = lightThemes[Math.floor(Math.random() * lightThemes.length)];
      }

      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [siteData, setSiteData] = useState(initialSiteData);
  const [isSiteDataLoading, setIsSiteDataLoading] = useState(true);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        setIsSiteDataLoading(true);
        const response = await instance.get("/sitedata");
        setSiteData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data situs dari API:", error);
        // Biarkan 'initialSiteData' sebagai fallback
      } finally {
        setIsSiteDataLoading(false);
      }
    };
    fetchSiteData();
  }, []);

  const updateSiteData = async (newFormData) => {
    try {
      const response = await instance.put("/sitedata", newFormData);
      setSiteData(response.data);
      return response.data;
    } catch (error) {
      console.error("Gagal update data situs:", error);
      throw error;
    }
  };

  const uploadProfileImage = async (formData) => {
    try {
      const response = await instance.post("/sitedata/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSiteData(response.data); 
      return response.data;
    } catch (error) {
      console.error("Gagal upload gambar:", error);
      throw error;
    }
  };

  const updateProfileImage = async (formData) => {
    try {
      const response = await instance.put("/sitedata/update-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSiteData(response.data); 
      return response.data;
    } catch (error) {
      console.error("Gagal update gambar:", error);
      throw error;
    }
  };

  const deleteProfileImage = async (imageUrl) => {
    try {
      const response = await instance.delete("/sitedata/delete-image", {
        data: { imageUrl }, // Kirim 'imageUrl' di body
      });
      setSiteData(response.data); // Update state dengan data baru
      return response.data;
    } catch (error) {
      console.error("Gagal hapus gambar:", error);
      throw error;
    }
  };

  const contextValue = {
    theme,
    toggleTheme,
    themeMode,
    siteData,
    updateSiteData,
    isSiteDataLoading,
    uploadProfileImage,
    updateProfileImage,
    deleteProfileImage,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

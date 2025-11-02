import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomToast } from "../hooks/useCustomToast";
import useCustomSwals from "../hooks/useCustomSwals";
import instance from "../utils/axios";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const navigate = useNavigate();
  const { success: customToast } = useCustomToast();
  const { showConfirmSwal, showErrorSwal } = useCustomSwals();

  useEffect(() => {
    let storedUser = null;
    try {
      const storedUserData = localStorage.getItem("porto-user");
      if (storedUserData) {
        storedUser = JSON.parse(storedUserData);
        setUser(storedUser); 
      }
    } catch (error) {
      console.error("Gagal memuat user dari localStorage:", error);
      localStorage.removeItem("porto-user");
    }

    const checkUserSession = async (userToCheck) => {
      try {
        const response = await instance.get("/users/getuser");

        login(response.data.user);
      } catch (error) {
        console.log(
          "Info sesi: Sesi tidak valid atau telah berakhir. Memaksa logout."
        );
        logout(); // Hapus data basi
      } finally {
        setIsUserLoading(false);
      }
    };

    if (storedUser) {
      checkUserSession(storedUser);
    } else {
      setIsUserLoading(false);
    }
  }, []); 

  const login = (userData) => {
    try {
      localStorage.setItem("porto-user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Gagal menyimpan user ke localStorage:", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("porto-user");
      setUser(null);
    } catch (error) {
      console.error("Gagal menghapus user dari localStorage:", error);
    }
  };

  const updateUser = (newProfileData) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...newProfileData };
      localStorage.setItem("porto-user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const handleSignOut = async () => {
    const isConfirmed = await showConfirmSwal(
      "Yakin ingin logout?",
      "Anda akan kehilangan sesi ini."
    );

    if (isConfirmed) {
      try {
        await instance.get("/users/logout");
        logout();
        customToast("Anda telah logout.");
        navigate("/");
      } catch (err) {
        console.error("Gagal logout:", err);
        showErrorSwal(
          "Logout Gagal",
          err.response?.data?.message || "Gagal menghubungi server."
        );
        logout();
        navigate("/");
      }
    }
  };

  const value = {
    user,
    isUserLoading,
    login,
    logout,
    updateUser,
    handleSignOut,
  };

  return (
    <UserContext.Provider value={value}>
      {!isUserLoading && children}
    </UserContext.Provider>
  );
};

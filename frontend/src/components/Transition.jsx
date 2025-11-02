import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const fallbackImageUrl =
  "https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp";

const getThemeColor = (varName, fallback) => {
  if (typeof window === "undefined") return fallback;

  const hslValue = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();

  if (hslValue) {
    return `hsl(${hslValue})`;
  }
  return fallback;
};

function Transition({ isLoading }) {
  const { themeMode, siteData } = useAppContext();

  const [currentImageUrl, setCurrentImageUrl] = useState(fallbackImageUrl);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const images = siteData?.profileImages || [];
      let selectedImage = fallbackImageUrl;

      if (!images || images.length === 0) {
        console.log("Transition - Using fallback image");
      } else {
        const randomIndex = Math.floor(Math.random() * images.length);
        selectedImage = images[randomIndex] || fallbackImageUrl;
      }

      setCurrentImageUrl(selectedImage);

      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 0);

      return () => clearTimeout(showTimer);
    } else {
      setIsVisible(false);
    }
  }, [isLoading, siteData?.profileImages]); //

  const bgColor = getThemeColor(
    "--b1",
    themeMode === "light" ? "#F0F0F0FF" : "#0C0B0EFF"
  );

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-400 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="animate-zoom-in-out my-4">
        <img
          src={currentImageUrl}
          alt="Mazda Nawallsyah Loading"
          className="w-64 h-64 rounded-full object-cover shadow-lg"
        />
      </div>

      <span className="loading loading-dots loading-lg mt-8"></span>
    </div>
  );
}

export default Transition;

import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import SeoHelmet from "./SEOHelmet";

const fallbackImageUrl =
  "https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp";

const transformCloudinaryUrl = (url, width, height) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  const transform = `upload/w_${width},h_${height},c_fill,q_auto,f_auto`;
  return url.replace("/upload/", `/${transform}/`);
};

const getThemeColor = (varName, fallback) => {
  if (typeof window === "undefined") return fallback;
  const hslValue = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return hslValue ? `hsl(${hslValue})` : fallback;
};

function Transition({ isLoading }) {
  const { themeMode, siteData, isSiteDataLoading } = useAppContext();
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      const images = siteData?.profileImages;
      if (isSiteDataLoading) return setCurrentImageUrl(null);

      const chosen =
        images?.length > 0
          ? transformCloudinaryUrl(images[0], 512, 512)
          : transformCloudinaryUrl(fallbackImageUrl, 512, 512);

      const preload = new Image();
      preload.src = chosen;
      preload.onload = () => setCurrentImageUrl(chosen);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isLoading, siteData, isSiteDataLoading]);

  const bgColor = getThemeColor(
    "--b1",
    themeMode === "light" ? "#F0F0F0FF" : "#0C0B0EFF"
  );

  <SeoHelmet
    title="Memuat Website Porto Mazda Nawallsyah..."
    description="Menyiapkan pengalaman mengunjungi portofolio Mazda Nawallsyah."
    imageUrl={
      currentImageUrl ||
      "https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp"
    }
    url="/"
  />;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ backgroundColor: bgColor }}
    >
      {!currentImageUrl ? (
        <div className="animate-pulse my-4">
          <div className="skeleton w-48 h-48 md:w-64 md:h-64 rounded-full shadow-lg"></div>
        </div>
      ) : (
        <div className="my-4">
          <img
            src={currentImageUrl}
            alt="Mazda Nawallsyah Loading"
            fetchPriority="high"
            width="256"
            height="256"
            decoding="async"
            className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-lg transition-transform duration-700 ease-in-out animate-[pulse_2s_infinite]"
          />
        </div>
      )}
      <span className="loading loading-dots loading-lg mt-8"></span>
    </div>
  );
}

export default Transition;

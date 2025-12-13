import React, { useState, useEffect } from "react";
import { useSiteStore } from "../stores/siteStore";
import SeoHelmet from "./SEOHelmet";

const fallbackImageUrl = "https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp";

const transformCloudinaryUrl = (url, width, height) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  const transform = `upload/w_${width},h_${height},c_fill,q_auto,f_auto`;
  return url.replace("/upload/", `/${transform}/`);
};

function Transition({ isLoading }) {
  const siteData = useSiteStore((state) => state.siteData);
  const isSiteDataLoading = useSiteStore((state) => state.isSiteDataLoading);

  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setProgress(0); 

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev; 
          return prev + 10;
        });
      }, 150);

      const images = siteData?.profileImages;
      const chosen = images?.length > 0
        ? transformCloudinaryUrl(images[0], 512, 512)
        : transformCloudinaryUrl(fallbackImageUrl, 512, 512);

      const preload = new Image();
      preload.src = chosen;
      preload.onload = () => {
        setCurrentImageUrl(chosen);
      };

      return () => clearInterval(interval);

    } else {
      setProgress(100);
      setTimeout(() => setIsVisible(false), 500);
    }
  }, [isLoading, siteData, isSiteDataLoading]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 bg-base-100 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      <SeoHelmet
        title="Memuat Website..."
        imageUrl={currentImageUrl || fallbackImageUrl}
        url="/"
      />

      {!currentImageUrl ? (
        <div className="animate-pulse my-4">
          <div className="skeleton w-48 h-48 md:w-64 md:h-64 rounded-full shadow-lg"></div>
        </div>
      ) : (
        <div className="my-4">
          <img
            src={currentImageUrl}
            alt="Loading..."
            width="256"
            height="256"
            className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-lg transition-transform duration-700 ease-in-out animate-[pulse_2s_infinite]"
          />
        </div>
      )}

      <progress
        className="progress progress-primary w-56 mt-8 h-2"
        value={progress}
        max="100"
      ></progress>
    </div>
  );
}

export default Transition;
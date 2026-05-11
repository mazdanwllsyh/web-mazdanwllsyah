import React, { useState, useEffect } from "react";
import { useSiteStore } from "../stores/siteStore";
import SeoHelmet from "./SEOHelmet";
import { motion, AnimatePresence } from "framer-motion";

const fallbackImageUrl = "https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp";

const transformCloudinaryUrl = (url, width, height) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  const transform = `upload/w_${width},h_${height},c_fill,q_auto,f_auto`;
  return url.replace("/upload/", `/${transform}/`);
};

function Transition({ isLoading }) {
  const siteData = useSiteStore((state) => state.siteData);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
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
    }
  }, [isLoading, siteData]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-base-100"
        >
          <SeoHelmet
            title="Memuat Website..."
            imageUrl={currentImageUrl || fallbackImageUrl}
            url="/"
          />

          {!currentImageUrl ? (
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="my-4 skeleton w-48 h-48 md:w-64 md:h-64 rounded-full shadow-2xl"
            />
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="my-4 relative"
            >
              <motion.img
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                src={currentImageUrl}
                alt="Loading..."
                width="256"
                height="256"
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-2xl ring-4 ring-primary/30 ring-offset-4 ring-offset-base-100"
              />
            </motion.div>
          )}

          <div className="w-56 mt-8 h-2 bg-base-300 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.2 }}
            ></motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Transition;
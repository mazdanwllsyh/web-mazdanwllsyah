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
          return prev + 15;
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
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="transition-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-base-100/90 backdrop-blur-xl"
        >
          <SeoHelmet
            title="Memuat Ruang Kerja..."
            imageUrl={currentImageUrl || fallbackImageUrl}
            url="/"
          />

          <div className="relative flex flex-col items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"
            />

            {!currentImageUrl ? (
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="my-4 skeleton w-48 h-48 md:w-56 md:h-56 rounded-full shadow-2xl"
              />
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="my-4 relative"
              >
                <img
                  src={currentImageUrl}
                  alt="Loading..."
                  width="256"
                  height="256"
                  className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-2xl ring-4 ring-primary/40 ring-offset-8 ring-offset-base-100"
                />
              </motion.div>
            )}

            <div className="w-64 mt-10 h-2.5 bg-base-300 rounded-full overflow-hidden shadow-inner relative">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 font-bold text-sm tracking-widest text-base-content/60 uppercase"
            >
              Take it easy dude...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Transition;
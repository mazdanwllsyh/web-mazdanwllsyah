import React, { useState, useEffect } from "react";
import { useSiteStore } from "../stores/siteStore";
import SeoHelmet from "./SEOHelmet";
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";

const fallbackImageUrl = "https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp";

const transformCloudinaryUrl = (url, width, height) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  const transform = `upload/w_${width},h_${height},c_fill,q_auto,f_auto`;
  return url.replace("/upload/", `/${transform}/`);
};

function Transition({ isLoading }) {
  const siteData = useSiteStore((state) => state.siteData);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  useEffect(() => {
    const images = siteData?.profileImages;
    const chosen = images?.length > 0
      ? transformCloudinaryUrl(images[0], 512, 512)
      : transformCloudinaryUrl(fallbackImageUrl, 512, 512);

    const preload = new Image();
    preload.src = chosen;
    preload.onload = () => {
      setCurrentImageUrl(chosen);
    };
  }, [siteData]);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <m.div
            key="transition-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-base-100/90 backdrop-blur-md"
          >
            <SeoHelmet
              title="Duhhh..."
              imageUrl={currentImageUrl || fallbackImageUrl}
              url="/"
            />

            <div className="relative flex flex-col items-center justify-center">
              <m.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute w-56 h-56 md:w-72 md:h-72 bg-primary/20 rounded-full blur-3xl -z-10"
              />

              {!currentImageUrl ? (
                <div className="my-4 skeleton w-48 h-48 md:w-56 md:h-56 rounded-full shadow-2xl" />
              ) : (
                <m.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="my-4 relative"
                >
                  <m.img
                    src={currentImageUrl}
                    alt="Loading..."
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-2xl ring-4 ring-primary/30 ring-offset-4 ring-offset-base-100"
                  />
                </m.div>
              )}

              <div className="w-64 mt-10 h-2 bg-base-300 rounded-full overflow-hidden relative shadow-inner">
                <m.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, ease: "circOut" }}
                />
              </div>

              <m.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5 font-bold text-sm tracking-widest text-base-content/60 animate-pulse"
              >
                take it easy dude...
              </m.p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

export default Transition;
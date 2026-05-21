import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useSiteStore } from "../../stores/siteStore";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import SeoHelmet from "../SEOHelmet";
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { transformCloudinaryUrl } from "../../utils/imageHelper";

const socialLinkConfig = [
  { key: "instagram", label: "Instagram", icon: "mdi:instagram", baseUrl: "https://instagram.com/" },
  { key: "github", label: "GitHub", icon: "mdi:github", baseUrl: "https://github.com/" },
  { key: "linkedin", label: "LinkedIn", icon: "mdi:linkedin", baseUrl: "https://linkedin.com/in/" },
  { key: "whatsapp", label: "WhatsApp", icon: "mdi:whatsapp", baseUrl: "https://wa.me/" },
  { key: "telegram", label: "Telegram", icon: "mdi:telegram", baseUrl: "https://t.me/" },
];

const techIcons = [
  { id: "react", icon: "logos:react", position: "top-[-5%] left-1/2 -translate-x-1/2" },
  { id: "nodejs", icon: "logos:nodejs-icon", position: "top-[15%] right-[-5%]" },
  { id: "express", icon: "simple-icons:express", position: "bottom-[15%] right-[-5%]", customClass: "text-base-content" },
  { id: "zustand", icon: "devicon:zustand", position: "bottom-[-5%] left-1/2 -translate-x-1/2" },
  { id: "daisyui", icon: "logos:daisyui-icon", position: "bottom-[15%] left-[-5%]" },
  { id: "axios", icon: "simple-icons:axios", position: "top-[15%] left-[-5%]", customClass: "text-[#5A29E4]" },
];

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.35, delayChildren: 0.4 }
  }
};

const textItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] } }
};

function Hero() {
  const siteData = useSiteStore((state) => state.siteData);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const profileImages = siteData?.profileImages || [];
  const availableLinks = siteData?.contactLinks || {};

  useEffect(() => {
    if (profileImages.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % profileImages.length);
      }, 18000);
      return () => clearInterval(intervalId);
    }
  }, [profileImages.length]);

  const displayParagraph = useMemo(() => {
    const fullAbout = siteData?.aboutParagraph || "";
    const firstSentence = fullAbout.split(".")[0];
    return firstSentence ? firstSentence + "." : "Deskripsi singkat tentang Saya.";
  }, [siteData?.aboutParagraph]);

  const rawSequence = siteData?.typeAnimationSequenceString;
  const isAnimationReady = rawSequence && rawSequence !== "..." && rawSequence.trim() !== "";

  const dynamicSequence = useMemo(() => {
    if (!isAnimationReady) return [];
    const items = rawSequence.split(",").map((s) => s.trim()).filter(Boolean);
    return items.flatMap((item) => [item, 1500]);
  }, [rawSequence, isAnimationReady]);

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": siteData?.brandNameShort || "Mazda Nawallsyah",
    "jobTitle": siteData?.jobTitle || "Front-End Developer",
    "url": window.location.href,
    "image": profileImages.length > 0 ? profileImages[0] : "",
    "sameAs": Object.values(availableLinks).filter((url) => url && url.trim() !== ""),
    "description": siteData?.aboutParagraph || "Portofolio pribadi Mazda Nawallsyah",
  }), [siteData, profileImages, availableLinks]);

  return (
    <div className="hero bg-base-100 flex items-center justify-center pt-10 pb-16 lg:py-0 min-h-[auto] xl:min-h-screen scroll-mt-12" id="home">
      <SeoHelmet
        title="Mazda Nawallsyah"
        description="Portofolio pribadi Mazda Nawallsyah seorang Fresh Graduate S1 - Teknik Informatika Universitas Semarang yang berfokus di Bidang Front-End Web Dev."
        imageUrl={profileImages.length > 0 ? profileImages[currentImgIndex] : "/default-avatar.png"}
        url="/"
      />

      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <div className="hero-content flex flex-col lg:flex-row-reverse items-center justify-between w-full max-w-6xl mx-auto px-0 lg:px-4">

        <LazyMotion features={domAnimation}>
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] mb-12 lg:mb-0 lg:ml-10 flex items-center justify-center z-10">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full mix-blend-multiply opacity-50"></div>

            {techIcons.map((tech, i) => (
              <m.div
                key={tech.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 + (i * 0.1), type: "spring" }}
                className={`absolute ${tech.position} z-20 w-12 h-12 md:w-14 md:h-14 bg-base-100 rounded-xl shadow-xl border border-base-content/10 flex items-center justify-center hover:scale-125 transition-transform duration-300 hover:z-30`}
                title={tech.id}
              >
                <Icon icon={tech.icon} className={`w-6 h-6 md:w-8 md:h-8 ${tech.customClass || ''}`} />
              </m.div>
            ))}

            {/* Tambahan overflow-hidden di bawah ini */}
            <div className="mask mask-hexagon w-full h-full bg-base-300 relative z-10 transition-transform duration-700 hover:scale-105 overflow-hidden">
              {!imageLoaded && <div className="absolute inset-0 skeleton w-full h-full"></div>}

              <AnimatePresence mode="wait">
                <m.img
                  key={currentImgIndex}
                  src={profileImages.length > 0 ? transformCloudinaryUrl(profileImages[currentImgIndex], 600, 600) : "/default-avatar.png"}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.8 }}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => { e.target.src = "/default-avatar.png"; setImageLoaded(true); }}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  alt="Foto Mazda Nawallsyah"
                />
              </AnimatePresence>
            </div>
          </div>
        </LazyMotion>

        <div className="flex flex-row items-start max-w-xl text-center lg:text-left w-full px-4 lg:px-0">
          <div className="hidden sm:flex flex-col space-y-4 mr-6 mt-3 min-w-[24px]">
            {imageLoaded ? (
              <LazyMotion features={domAnimation}>
                <m.div className="flex flex-col space-y-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}>
                  {socialLinkConfig.filter((link) => availableLinks[link.key]).map((link) => (
                    <a key={link.key} href={link.baseUrl + availableLinks[link.key]} target="_blank" rel="noopener noreferrer" aria-label={link.label} className="text-base-content/70 hover:text-primary transition-colors duration-200">
                      <Icon icon={link.icon} className="w-6 h-6 lg:w-7 lg:h-7" />
                    </a>
                  ))}
                </m.div>
              </LazyMotion>
            ) : (
              <div className="flex flex-col space-y-4 mt-1">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-6 w-6 lg:h-7 lg:w-7 rounded-full"></div>)}
              </div>
            )}
          </div>

          <div className="w-full">
            {!imageLoaded ? (
              <div className="space-y-4 w-full">
                <div className="skeleton h-10 md:h-12 lg:h-16 w-3/4 mx-auto lg:mx-0"></div>
                <div className="skeleton h-8 md:h-10 lg:h-12 w-1/2 mx-auto lg:mx-0"></div>
                <div className="py-6 space-y-3">
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-5/6 mx-auto lg:mx-0"></div>
                </div>
                <div className="skeleton h-12 w-40 rounded-2xl mx-auto lg:mx-0"></div>
              </div>
            ) : (
              <LazyMotion features={domAnimation}>
                <m.div variants={textContainerVariants} initial="hidden" animate="visible" className="flex flex-col">
                  <m.h1 variants={textItemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight">Mazda Nawallsyah</m.h1>

                  <m.div variants={textItemVariants} className="w-full">
                    <div className="divider before:bg-base-content/20 after:bg-base-content/20 lg:hidden text-2xl md:text-3xl font-semibold px-2 my-4">
                      {isAnimationReady ? (
                        <TypeAnimation key={rawSequence} sequence={dynamicSequence} wrapper="span" speed={9} repeat={Infinity} />
                      ) : (
                        <span className="text-base-content/50 animate-pulse">...</span>
                      )}
                    </div>

                    <div className="hidden lg:flex items-center gap-3 my-3">
                      <div className="h-1.5 flex-1 max-w-[8rem] bg-gradient-to-br from-accent to-primary rounded-full opacity-80"></div>
                      <div className="text-4xl font-semibold whitespace-nowrap">
                        {isAnimationReady ? (
                          <TypeAnimation key={rawSequence} sequence={dynamicSequence} wrapper="span" speed={9} repeat={Infinity} />
                        ) : (
                          <span className="text-base-content/50 animate-pulse">...</span>
                        )}
                      </div>
                    </div>
                  </m.div>

                  <m.p variants={textItemVariants} className="py-4 lg:py-6 text-base md:text-lg lg:text-xl text-base-content/80 text-justify min-h-[80px] leading-relaxed">
                    {displayParagraph}
                  </m.p>

                  <m.div variants={textItemVariants}>
                    <Link tabIndex={0} to="/tentang" className="btn btn-lg bg-base-300 font-display border-base-content/20 border-2 shadow-sm hover:shadow-primary/20 group rounded-2xl lg:px-8 transition-all">
                      Tentang Saya?
                      <Icon icon="streamline-flex:finger-snapping" className="w-6 h-6 ml-1 group-hover:scale-110 transition-transform text-primary" focusable="false" />
                    </Link>
                  </m.div>

                  <m.div variants={textItemVariants} className="flex sm:hidden space-x-5 mt-8 justify-center min-h-[24px]">
                    {socialLinkConfig.filter((link) => availableLinks[link.key]).map((link) => (
                      <a key={link.key} href={link.baseUrl + availableLinks[link.key]} target="_blank" rel="noopener noreferrer" aria-label={link.label} className="text-base-content/70 hover:text-primary transition-colors duration-200">
                        <Icon icon={link.icon} className="w-7 h-7" />
                      </a>
                    ))}
                  </m.div>
                </m.div>
              </LazyMotion>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
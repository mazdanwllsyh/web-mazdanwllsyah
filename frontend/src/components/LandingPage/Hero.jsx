import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useSiteStore } from "../../stores/siteStore";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import SeoHelmet from "../SEOHelmet";
import { m } from "framer-motion";
import { transformCloudinaryUrl } from "../../utils/imageHelper";

const socialLinkConfig = [
  { key: "instagram", label: "Instagram", icon: "mdi:instagram", baseUrl: "https://instagram.com/" },
  { key: "github", label: "GitHub", icon: "mdi:github", baseUrl: "https://github.com/" },
  { key: "linkedin", label: "LinkedIn", icon: "mdi:linkedin", baseUrl: "https://linkedin.com/in/" },
  { key: "whatsapp", label: "WhatsApp", icon: "mdi:whatsapp", baseUrl: "https://wa.me/" },
  { key: "telegram", label: "Telegram", icon: "mdi:telegram", baseUrl: "https://t.me/" },
];

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.35,
      delayChildren: 0.4,
    }
  }
};

const textItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

function Hero() {
  const siteData = useSiteStore((state) => state.siteData);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heroImage, setHeroImage] = useState("/default-avatar.png");

  useEffect(() => {
    const images = siteData?.profileImages || [];
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      setHeroImage(transformCloudinaryUrl(images[randomIndex], 600, 600));
    }
  }, [siteData?.profileImages]);

  useEffect(() => {
    if (heroImage) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = heroImage;
      document.head.appendChild(link);
    }
  }, [heroImage]);

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

  const techIcons = [
    { icon: "logos:html-5", position: "top-[-1.5rem] left-1/2 -translate-x-1/2" },
    { icon: "logos:css-3", position: "top-[25%] right-[-2rem]" },
    { icon: "logos:javascript", position: "bottom-[25%] right-[-1.5rem]" },
    { icon: "logos:tailwindcss-icon", position: "bottom-[-1.5rem] left-1/2 -translate-x-1/2" },
    { icon: "logos:nodejs", position: "bottom-[25%] left-[-2rem]" },
    { icon: "logos:react", position: "top-[25%] left-[-1.5rem]" },
  ];

  const availableLinks = siteData?.contactLinks || {};

  return (
    <div className="hero bg-base-100 flex items-center justify-center pt-10 pb-16 lg:py-0 min-h-[auto] lg:min-h-screen scroll-mt-12" id="home">
      <SeoHelmet
        title="Mazda Nawallsyah"
        description="Portofolio pribadi Mazda Nawallsyah seorang Fresh Graduate S1 - Teknik Informatika Universitas Semarang yang berfokus di Bidang Front-End Web Dev."
        imageUrl={heroImage}
        url="/"
      />

      <div className="hero-content flex flex-col lg:flex-row-reverse items-center justify-between w-full max-w-6xl mx-auto px-0 lg:px-4">

        <div className="relative mb-8 lg:mb-0 lg:ml-10 group">
          <div tabIndex={0} className="avatar">
            <div className="w-56 h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 aspect-square rounded-full ring-7 ring-base-300 ring-offset-base-100 ring-offset-4 overflow-hidden relative bg-base-300">

              {!imageLoaded && <div className="absolute inset-0 skeleton w-full h-full"></div>}

              <img
                src={heroImage}
                alt="Foto Mazda Nawallsyah"
                fetchPriority="high"
                decoding="sync"
                width="384"
                height="384"
                className={`w-full h-full object-cover transition-all duration-1000 ease-in-out cursor-pointer ${imageLoaded ? "opacity-100 lg:group-hover:scale-110" : "opacity-0"}`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => { e.target.src = "/default-avatar.png"; }}
              />
            </div>
          </div>

          {imageLoaded && techIcons.map((tech, index) => (
            <m.div
              key={index}
              className={`absolute ${tech.position} bg-base-300 p-2 lg:p-3 rounded-full shadow-lg`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.15, duration: 1, type: "spring", bounce: 0.4 }}
            >
              <Icon icon={tech.icon} className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 drop-shadow-lg" />
            </m.div>
          ))}
        </div>

        <div className="flex flex-row items-start max-w-xl text-center lg:text-left w-full">
          <div className="hidden sm:flex flex-col space-y-4 mr-6 mt-3 min-w-[24px]">
            {imageLoaded ? (
              <m.div
                className="flex flex-col space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                // Ikon sosial media desktop muncul paling akhir
                transition={{ delay: 1.6, duration: 1, ease: "easeOut" }}
              >
                {socialLinkConfig.filter((link) => availableLinks[link.key]).map((link) => (
                  <a key={link.key} href={link.baseUrl + availableLinks[link.key]} target="_blank" rel="noopener noreferrer" aria-label={link.label} className="text-base-content/70 hover:text-primary transition-colors duration-200">
                    <Icon icon={link.icon} className="w-6 h-6 lg:w-7 lg:h-7" />
                  </a>
                ))}
              </m.div>
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
              <m.div
                variants={textContainerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col"
              >
                <m.h1 variants={textItemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight">Mazda Nawallsyah</m.h1>

                <m.div variants={textItemVariants} className="min-h-[32px] md:min-h-[40px] lg:min-h-[48px] flex items-center justify-center lg:justify-start mt-2">
                  {isAnimationReady ? (
                    <TypeAnimation
                      key={rawSequence}
                      sequence={dynamicSequence}
                      wrapper="span"
                      speed={9}
                      className="text-2xl md:text-3xl lg:text-4xl font-semibold"
                      repeat={Infinity}
                    />
                  ) : (
                    <span className="text-2xl md:text-3xl lg:text-4xl font-semibold text-base-content/50 animate-pulse">
                      ...
                    </span>
                  )}
                </m.div>

                <m.div variants={textItemVariants}>
                  <div className="divider before:bg-base-content/20 after:bg-base-content/20 lg:hidden my-6"></div>
                  <div className="hidden lg:block h-1.5 w-32 bg-accent my-6 rounded-full"></div>
                </m.div>

                <m.p variants={textItemVariants} className="py-4 lg:py-6 text-base md:text-lg lg:text-xl text-base-content/80 text-justify min-h-[80px] leading-relaxed">
                  {displayParagraph}
                </m.p>

                <m.div variants={textItemVariants}>
                  <Link tabIndex={0} to="/tentang" className="btn btn-lg bg-base-300 font-display border-neutral border-2 shadow-lg group rounded-2xl lg:px-8">
                    Tentang Saya?
                    <Icon icon="streamline-flex:finger-snapping" className="w-6 h-6 ml-1 group-hover:scale-110 transition-transform" focusable="false" />
                  </Link>
                </m.div>

                <m.div
                  variants={textItemVariants}
                  className="flex sm:hidden space-x-5 mt-8 justify-center min-h-[24px]"
                >
                  {socialLinkConfig.filter((link) => availableLinks[link.key]).map((link) => (
                    <a key={link.key} href={link.baseUrl + availableLinks[link.key]} target="_blank" rel="noopener noreferrer" aria-label={link.label} className="text-base-content/70 hover:text-primary transition-colors duration-200">
                      <Icon icon={link.icon} className="w-7 h-7" />
                    </a>
                  ))}
                </m.div>
              </m.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
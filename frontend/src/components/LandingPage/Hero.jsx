import React, { useState, useEffect, useMemo, useRef } from "react";
import { Icon } from "@iconify/react";
import { useSiteStore } from "../../stores/siteStore";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { useProjectStore } from "../../stores/projectStore";
import { Link } from "react-router-dom";
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { transformCloudinaryUrl } from "../../utils/imageHelper";
import { isBot } from "../../App.jsx";

const socialLinkConfig = [
  { key: "instagram", label: "Instagram", icon: "mdi:instagram", baseUrl: "https://instagram.com/" },
  { key: "github", label: "GitHub", icon: "mdi:github", baseUrl: "https://github.com/" },
  { key: "linkedin", label: "LinkedIn", icon: "mdi:linkedin", baseUrl: "https://linkedin.com/in/" },
  { key: "whatsapp", label: "WhatsApp", icon: "mdi:whatsapp", baseUrl: "https://wa.me/" },
  { key: "telegram", label: "Telegram", icon: "mdi:telegram", baseUrl: "https://t.me/" },
];

const techIcons = [
  { id: "react", icon: "logos:react", position: "top-[-5%] left-1/2 -translate-x-1/2" },
  { id: "motion", icon: "bxl:motion-js", position: "top-[15%] right-[-5%]" },
  { id: "html", icon: "logos:html-5", position: "bottom-[15%] right-[-5%]", customClass: "text-base-content" },
  { id: "daisyui", icon: "logos:daisyui-icon", position: "bottom-[-5%] left-1/2 -translate-x-1/2" },
  { id: "css", icon: "logos:css-3", position: "bottom-[15%] left-[-5%]" },
  { id: "zustand", icon: "devicon:zustand", position: "top-[15%] left-[-5%]", customClass: "text-[#5A29E4]" },
];

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const textItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const ZeroRenderTypewriter = ({ rawSequence }) => {
  const elRef = useRef(null);

  useEffect(() => {
    if (!rawSequence || rawSequence === "..." || isBot) {
      if (elRef.current) elRef.current.textContent = rawSequence?.split(",")[0] || "Frontend Developer";
      return;
    }

    const strings = rawSequence.split(",").map(s => s.trim()).filter(Boolean);
    let isCancelled = false;
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeTimeout;

    const type = () => {
      if (isCancelled || !elRef.current) return;
      const currentWord = strings[wordIndex];

      if (isDeleting) {
        elRef.current.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        elRef.current.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 30 : 80;

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % strings.length;
        typeSpeed = 300;
      }

      typeTimeout = setTimeout(type, typeSpeed);
    };

    type();
    return () => {
      isCancelled = true;
      clearTimeout(typeTimeout);
    };
  }, [rawSequence]);

  return (
    <span className="relative">
      <span ref={elRef} className="whitespace-nowrap"></span>
      <span className="animate-pulse ml-[2px]">|</span>
    </span>
  );
};

function Hero() {
  const siteData = useSiteStore((state) => state.siteData);
  const { fetchSertifikat, fetchHistoryData, fetchSkillsData, sertifikatData } = usePortfolioStore();
  const fetchProjects = useProjectStore((state) => state?.fetchProjects);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const profileImages = siteData?.profileImages || [];
  const availableLinks = siteData?.contactLinks || {};

  useEffect(() => {
    fetchSertifikat();
    fetchHistoryData();
    fetchSkillsData();
    if (fetchProjects) fetchProjects();
  }, [fetchSertifikat, fetchHistoryData, fetchSkillsData, fetchProjects]);

  useEffect(() => {
    if (profileImages.length > 1) {
      const intervalId = setInterval(() => setCurrentImgIndex((prev) => (prev + 1) % profileImages.length), 18000);
      return () => clearInterval(intervalId);
    }
  }, [profileImages.length]);

  const displayParagraph = useMemo(() => {
    const fullAbout = siteData?.aboutParagraph || "";
    return fullAbout.split(".")[0] ? fullAbout.split(".")[0] + "." : "Deskripsi singkat tentang Saya.";
  }, [siteData?.aboutParagraph]);

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": siteData?.brandNameShort || "Mazda Nawallsyah",
    "jobTitle": siteData?.jobTitle || "Front-End Developer",
    "url": window.location.href,
    "image": profileImages[0] || "",
    "sameAs": Object.values(availableLinks).filter((url) => url && url.trim() !== ""),
    "description": siteData?.aboutParagraph || "Portofolio pribadi Mazda Nawallsyah",
  }), [siteData, profileImages, availableLinks]);

  useEffect(() => {
    let script = document.getElementById("structured-data-hero");
    if (!script) {
      script = document.createElement("script");
      script.id = "structured-data-hero";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.innerHTML = JSON.stringify(structuredData);
    return () => { if (script) script.remove(); };
  }, [structuredData]);

  return (
    <div className="hero flex items-center justify-center pt-10 pb-16 lg:py-0 min-h-[auto] xl:min-h-screen relative" id="home">
      <div className="hero-content flex flex-col lg:flex-row-reverse items-center justify-between w-full max-w-6xl mx-auto px-0 lg:px-4">
        <LazyMotion features={domAnimation}>
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] mb-12 lg:mb-0 lg:ml-10 flex items-center justify-center z-10" style={{ willChange: "transform" }}>
            <div className="absolute inset-0 bg-primary/20 mask mask-hexagon mix-blend-multiply opacity-40 pointer-events-none"></div>

            {techIcons.map((tech, i) => (
              <m.div
                key={tech.id}
                initial={isBot ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: isBot ? 0 : 0.2 + (i * 0.1), type: "spring", stiffness: 200, damping: 20 }}
                className={`absolute ${tech.position} z-20 w-12 h-12 md:w-14 md:h-14 bg-base-100 rounded-xl shadow-xl border border-base-content/10 flex items-center justify-center hover:scale-110 transition-transform duration-300 hover:z-30 hover:bg-gradient-to-br from-accent to-primary cursor-pointer`}
                style={{ willChange: "transform" }}
              >
                <Icon icon={tech.icon} className={`w-6 h-6 md:w-8 md:h-8 ${tech.customClass || ''}`} />
              </m.div>
            ))}

            <div className="aura aura-gold duration-[3900ms] mask mask-hexagon w-full h-full p-1">
              <div className="mask mask-hexagon w-full h-full bg-base-300 relative z-10 overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
                <AnimatePresence mode="wait">
                  <m.img
                    key={currentImgIndex}
                    src={profileImages.length > 0 ? transformCloudinaryUrl(profileImages[currentImgIndex], 600, 600) : "/default-avatar.png"}
                    initial={isBot ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover select-none pointer-events-none ${(imageLoaded || isBot) ? "opacity-100" : "opacity-0"}`}
                    alt="Foto Mazda Nawallsyah"
                    style={{ willChange: "opacity" }}
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </LazyMotion>

        <div className="flex flex-row items-start max-w-xl text-center lg:text-left w-full px-4 lg:px-0">
          <div className="hidden sm:flex flex-col space-y-4 mr-6 mt-3 min-w-[24px]">
            <LazyMotion features={domAnimation}>
              <m.div className="flex flex-col space-y-4" initial={isBot ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: isBot ? 0 : 0.4, duration: 0.6 }}>
                {socialLinkConfig.filter((link) => availableLinks[link.key]).map((link) => (
                  <a key={link.key} href={link.baseUrl + availableLinks[link.key]} target="_blank" rel="noopener noreferrer" aria-label={link.label} className="text-base-content/70 hover:text-primary transition-colors">
                    <Icon icon={link.icon} className="w-6 h-6 lg:w-7 lg:h-7" />
                  </a>
                ))}
              </m.div>
            </LazyMotion>
          </div>

          <div className="w-full">
            <LazyMotion features={domAnimation}>
              <m.div initial={isBot ? "visible" : "hidden"} animate="visible" variants={textContainerVariants} className="flex flex-col" style={{ willChange: "transform, opacity" }}>
                <m.h1 variants={textItemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight">Mazda Nawallsyah</m.h1>

                <m.div variants={textItemVariants} className="w-full">
                  <div className="divider before:bg-base-content/20 after:bg-base-content/20 lg:hidden text-2xl md:text-3xl font-semibold px-2 my-4">
                    <ZeroRenderTypewriter rawSequence={siteData?.typeAnimationSequenceString} />
                  </div>
                  <div className="hidden lg:flex items-center gap-3 my-3">
                    <div className="h-1.5 flex-1 max-w-[8rem] bg-gradient-to-br from-accent to-primary rounded-full opacity-80"></div>
                    <div className="text-4xl font-semibold">
                      <ZeroRenderTypewriter rawSequence={siteData?.typeAnimationSequenceString} />
                    </div>
                  </div>
                </m.div>

                <m.p variants={textItemVariants} className="py-4 lg:py-6 text-base md:text-lg lg:text-xl text-base-content/80 text-justify min-h-[80px] leading-relaxed">
                  {displayParagraph}
                </m.p>

                <m.div variants={textItemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-2">
                  <div className="tooltip tooltip-bottom" data-tip="Kenali saya lebih dekat">
                    <div className="aura text-primary/90 bg-accent/70 duration-[2900ms] rounded-2xl">
                      <Link to="/tentang" className="btn btn-md bg-base-300/90 text-base-content font-display border-base-content/20 border-2 shadow-sm hover:border-primary/50 group rounded-2xl px-5 relative z-10">
                        Tentang Saya?
                        <Icon icon="streamline-flex:finger-snapping" className="w-5 h-5 ml-1 group-hover:scale-110 text-primary" />
                      </Link>
                    </div>
                  </div>

                  <div className="tooltip tooltip-bottom" data-tip="Sertifikasi & Penghargaan">
                    <div className="aura aura-dual duration-[2900ms] rounded-2xl">
                      <Link to="/sertifikasi" className="btn btn-md bg-primary text-primary-content font-display border-primary border-2 shadow-md hover:shadow-primary/40 group rounded-2xl px-5 relative z-10">
                        Sertifikat
                        <Icon icon="solar:diploma-verified-bold-duotone" className="w-5 h-5 ml-1 group-hover:scale-110" />
                        <span className="text-[11px] font-black opacity-90 border-l border-primary-content/30 pl-2 ml-1">
                          {sertifikatData?.length || 0}
                        </span>
                      </Link>
                    </div>
                  </div>
                </m.div>

                <m.div variants={textItemVariants} className="flex sm:hidden space-x-5 mt-8 justify-center min-h-[24px]">
                  {socialLinkConfig.filter((link) => availableLinks[link.key]).map((link) => (
                    <a key={link.key} href={link.baseUrl + availableLinks[link.key]} target="_blank" rel="noopener noreferrer" aria-label={link.label} className="text-base-content/70 hover:text-primary transition-colors">
                      <Icon icon={link.icon} className="w-7 h-7" />
                    </a>
                  ))}
                </m.div>
              </m.div>
            </LazyMotion>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
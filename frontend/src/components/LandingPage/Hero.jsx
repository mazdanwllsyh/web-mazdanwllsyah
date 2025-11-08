import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useAppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import SeoHelmet from "../SEOHelmet";
import AOS from "aos";
import { transformCloudinaryUrl } from "../../utils/imageHelper";

const socialLinkConfig = [
  {
    key: "instagram",
    label: "Instagram",
    icon: "mdi:instagram",
    baseUrl: "https://instagram.com/",
  },
  {
    key: "github",
    label: "GitHub",
    icon: "mdi:github",
    baseUrl: "https://github.com/",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: "mdi:linkedin",
    baseUrl: "https://linkedin.com/in/",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: "mdi:whatsapp",
    baseUrl: "https://wa.me/",
  },
  {
    key: "telegram",
    label: "Telegram",
    icon: "mdi:telegram",
    baseUrl: "https://t.me/",
  },
];

function Hero() {
  const { siteData } = useAppContext();

  const [imageLoaded, setImageLoaded] = useState(false);

  const [heroImage, setHeroImage] = useState("/default-avatar.png");

  useEffect(() => {
    const images = siteData?.profileImages || [];
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      const selected = transformCloudinaryUrl(images[randomIndex], 576, 576);
      setHeroImage(selected);
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
    return firstSentence
      ? firstSentence + "."
      : "Deskripsi singkat tentang Anda.";
  }, [siteData?.aboutParagraph]);

  const dynamicSequence = useMemo(() => {
    const sequenceString = siteData?.typeAnimationSequenceString || "";
    const items = sequenceString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length === 0) return ["Your Title", 1500];
    return items.flatMap((item) => [item, 1500]);
  }, [siteData?.typeAnimationSequenceString]);

  const techIcons = [
    {
      icon: "logos:html-5",
      position: "top-[-1.5rem] left-1/2 -translate-x-1/2",
    },
    { icon: "logos:css-3", position: "top-[25%] right-[-2rem]" },
    { icon: "logos:javascript", position: "bottom-[25%] right-[-1.5rem]" },
    {
      icon: "logos:bootstrap",
      position: "bottom-[-1.5rem] left-1/2 -translate-x-1/2",
    },
    { icon: "logos:nodejs", position: "bottom-[25%] left-[-2rem]" },
    { icon: "logos:react", position: "top-[25%] left-[-1.5rem]" },
  ];

  useEffect(() => {
    if (imageLoaded) setTimeout(() => AOS.refresh(), 100);
  }, [imageLoaded]);

  const availableLinks = siteData?.contactLinks || {};

  return (
    <div className="hero min-h-screen bg-base-100 pt-24 md:pt-16" id="home">
      <link rel="preload" as="image" href={heroImage} fetchpriority="high" />

      <SeoHelmet
        title="Mazda Nawallsyah"
        description="Portofolio pribadi Mazda Nawallsyah, Web Developer MERN Stack."
        imageUrl={heroImage} 
        url="/"
      />

      <div className="hero-content flex flex-col lg:flex-row-reverse items-center justify-between w-full max-w-6xl mx-auto px-4">
        <div
          className="relative mb-8 lg:mb-0 lg:ml-10 animate-float group will-change-transform"
          data-aos="fade-left"
          data-aos-delay="300"
        >
          <div tabIndex={0} className="avatar">
            <div className="w-56 md:w-72 rounded-full ring-7 ring-base-300 ring-offset-base-100 ring-offset-4 overflow-hidden">
              {!imageLoaded && (
                <div className="skeleton w-full h-full cursor-wait"></div>
              )}
              <img
                src={heroImage}
                alt="Foto Mazda Nawallsyah"
                fetchPriority="high"
                decoding="async"
                width="288"
                height="288"
                className={`w-full h-full object-cover transition-all duration-300 ease-in-out cursor-pointer ${
                  imageLoaded
                    ? "opacity-100 group-hover:scale-115"
                    : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  console.warn("Hero - gagal load gambar:", heroImage);
                  e.target.src = "/default-avatar.png";
                }}
              />
            </div>
          </div>

          {techIcons.map((tech, index) => (
            <div
              key={index}
              data-aos="zoom-in"
              data-aos-delay={300 + index * 100}
              className={`absolute ${tech.position} bg-base-300 p-2 rounded-full shadow-lg`}
            >
              <Icon
                icon={tech.icon}
                className="w-6 h-6 md:w-8 md:h-8 drop-shadow-lg"
              />
            </div>
          ))}
        </div>

        <div
          className="flex flex-row items-start max-w-lg text-center lg:text-left"
          data-aos="fade-right"
          data-aos-duration="700"
        >
          <div className="hidden sm:flex flex-col space-y-4 mr-6 mt-2">
            {!imageLoaded && (
              <div className="hidden sm:flex flex-col space-y-4 mr-6 mt-2">
                <div className="skeleton h-6 w-6 rounded-full"></div>
                <div className="skeleton h-6 w-6 rounded-full"></div>
                <div className="skeleton h-6 w-6 rounded-full"></div>
              </div>
            )}
            {imageLoaded && (
              <div
                className="hidden sm:flex flex-col space-y-4 mr-6 mt-2"
                data-aos="fade-right"
                data-aos-delay="500"
              >
                {socialLinkConfig
                  .filter((link) => availableLinks[link.key])
                  .map((link) => (
                    <a
                      key={link.key}
                      href={link.baseUrl + availableLinks[link.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="text-base-content/70 hover:text-neutral transition-colors duration-200"
                    >
                      <Icon icon={link.icon} className="w-6 h-6" />
                    </a>
                  ))}
              </div>
            )}
          </div>

          <div
            className={`transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } min-h-[350px]`}
            data-aos="zoom-out"
          >
            {!imageLoaded ? (
              <div className="space-y-4">
                <div className="skeleton h-8 md:h-10 w-3/4"></div>
                <div className="skeleton h-7 w-1/2"></div>
                <div className="py-6 space-y-2">
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-5/6"></div>
                </div>
                <div className="skeleton h-12 w-40 rounded-2xl"></div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold font-display">
                  Mazda Nawallsyah
                </h1>
                <TypeAnimation
                  sequence={dynamicSequence}
                  wrapper="span"
                  speed={28}
                  className="text-2xl font-semibold"
                  repeat={Infinity}
                />
                <div className="divider before:bg-base-content/20 after:bg-base-content/20 lg:hidden"></div>
                <div className="hidden lg:block h-1 w-50 bg-accent my-4"></div>
                <p className="py-6 text-base md:text-lg text-base-content/80 text-justify">
                  {displayParagraph}
                </p>
                <Link
                  tabIndex={0}
                  to="/tentang"
                  className="btn bg-base-300 font-display border border-neutral border-2 shadow-lg group rounded-2xl"
                  data-aos="fade-down"
                  data-aos-delay="400"
                >
                  Tentang Saya?
                  <Icon
                    icon="streamline-flex:finger-snapping"
                    className="w-6 h-6 ml-1 group-hover:scale-85 transition-transform"
                    focusable="false"
                  />
                </Link>

                {/* Mobile social icons */}
                <div
                  tabIndex={0}
                  className="flex sm:hidden space-x-4 mt-6 justify-center lg:justify-start"
                >
                  {socialLinkConfig
                    .filter((link) => availableLinks[link.key])
                    .map((link) => (
                      <a
                        key={link.key}
                        href={link.baseUrl + availableLinks[link.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="text-base-content/70 hover:text-primary transition-colors duration-200 group-focus-within:text-secondary"
                      >
                        <Icon icon={link.icon} className="w-6 h-6" />
                      </a>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;

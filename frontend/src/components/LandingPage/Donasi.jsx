import React, { useState } from "react";
import SEO from "../../components/SEO";
import { useSiteStore } from "../../stores/siteStore";
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { Icon } from "@iconify/react";
import { isBot } from "../../App.jsx";

const gopayQrUrl = "https://res.cloudinary.com/dr7olcn4r/image/upload/v1761843697/QRIS_Gopay_c70ei6.jpg";
const danaQrUrl = "https://res.cloudinary.com/dr7olcn4r/image/upload/v1761843697/QRIS_Dana_mz3lgf.jpg";

const SecureImage = ({ src, alt, className = "" }) => (
  <img src={src} alt={alt} className={`w-full h-auto ${className}`} onContextMenu={(e) => e.preventDefault()} draggable="false" />
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

function Donasi() {
  const siteData = useSiteStore((state) => state.siteData);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [hoveredMethod, setHoveredMethod] = useState(null);

  const handleSelectMethod = (method) => setSelectedMethod((current) => (current === method ? null : method));

  return (
    <div className="min-h-[auto] xl:min-h-screen flex flex-col items-center justify-center py-16 lg:py-0 scroll-mt-16 lg:scroll-mt-24 text-base-content" id="donasi">
      <SEO
        title="Donasi"
        description={siteData.aboutParagraph ? siteData.aboutParagraph.substring(0, 160) : "Silakan Jika berminat untuk Berdonasi, klik salah satu ya."}
        url="/donasi"
      />
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-4">
        <LazyMotion features={domAnimation}>
          <m.div
            className="text-center mb-12"
            initial={isBot ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            style={{ willChange: "transform, opacity" }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-2 tracking-tight">Beri Dukungan</h2>
            <p className="text-base md:text-lg text-base-content/60">Jika Anda merasa terbantu, Anda bisa memberi apresiasi.</p>
          </m.div>

          <div className="max-w-lg mx-auto flex flex-col items-center">
            <m.div className="grid grid-cols-2 gap-3 md:gap-4 w-full mb-8" variants={containerVariants} initial={isBot ? "visible" : "hidden"} animate="visible">
              <m.div variants={itemVariants} whileHover={isBot ? {} : { y: -5 }} whileTap={isBot ? {} : { scale: 0.95 }} className={`w-full rounded-3xl transition-all duration-[3500ms] ${(hoveredMethod === "gopay" || selectedMethod === "gopay") ? "aura aura-dual text-success" : ""}`} style={{ willChange: "transform, opacity" }}>
                <button
                  onClick={() => handleSelectMethod("gopay")}
                  onMouseEnter={() => setHoveredMethod("gopay")}
                  onMouseLeave={() => setHoveredMethod(null)}
                  onFocus={() => setHoveredMethod("gopay")}
                  onBlur={() => setHoveredMethod(null)}
                  className={`w-full h-full card shadow-sm p-3 md:p-4 flex flex-col items-center justify-center transition-all duration-300 rounded-3xl border-2 outline-none ${selectedMethod === "gopay" ? "bg-base-200 border-success shadow-lg" : "border-base-content/10 bg-base-100 hover:border-success/50"}`}
                >
                  <div className="bg-white p-1.5 md:p-2 rounded-xl shadow-inner w-full flex justify-center items-center h-12 md:h-16">
                    <img src="https://brandlogos.net/wp-content/uploads/2022/10/gopay-logo_brandlogos.net_gph3u.png" alt="Gopay Logo" className="h-6 md:h-8 w-auto object-contain" />
                  </div>
                </button>
              </m.div>

              <m.div variants={itemVariants} whileHover={isBot ? {} : { y: -5 }} whileTap={isBot ? {} : { scale: 0.95 }} className={`w-full rounded-3xl transition-all duration-[3500ms] ${(hoveredMethod === "dana" || selectedMethod === "dana") ? "aura aura-dual text-info" : ""}`} style={{ willChange: "transform, opacity" }}>
                <button
                  onClick={() => handleSelectMethod("dana")}
                  onMouseEnter={() => setHoveredMethod("dana")}
                  onMouseLeave={() => setHoveredMethod(null)}
                  onFocus={() => setHoveredMethod("dana")}
                  onBlur={() => setHoveredMethod(null)}
                  className={`w-full h-full card shadow-sm p-3 md:p-4 flex flex-col items-center justify-center transition-all duration-300 rounded-3xl border-2 outline-none ${selectedMethod === "dana" ? "bg-base-200 border-info shadow-lg" : "border-base-content/10 bg-base-100 hover:border-info/50"}`}
                >
                  <div className="bg-white p-1.5 md:p-2 rounded-xl shadow-inner w-full flex justify-center items-center h-12 md:h-16">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/52/Dana_logo.png" alt="Dana Logo" className="h-5 md:h-7 w-auto object-contain" />
                  </div>
                </button>
              </m.div>
            </m.div>

            <div className="w-full max-w-xs min-h-[350px] flex justify-center">
              <AnimatePresence mode="wait">
                {selectedMethod && (
                  <m.div key={selectedMethod} initial={isBot ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: -20 }} transition={{ duration: 0.4, type: "spring" }} className="w-full" style={{ willChange: "transform, opacity" }}>
                    <div className="aura aura-rainbow duration-[3500ms] rounded-[2rem] w-full">
                      <figure className={`card w-full p-5 shadow-2xl border-2 rounded-[2rem] bg-base-100 ${selectedMethod === "gopay" ? "border-success" : selectedMethod === "dana" ? "border-info" : "border-[#ee4d2d]"}`}>
                        <div className="bg-white p-2 rounded-2xl">
                          <SecureImage src={selectedMethod === "gopay" ? gopayQrUrl : danaQrUrl} alt={`QRIS ${selectedMethod}`} className="rounded-xl" />
                        </div>
                        <figcaption className="text-center mt-4 text-sm font-bold opacity-80 flex flex-col items-center gap-2">
                          <Icon icon="mdi:qrcode-scan" className="w-6 h-6" />
                          {selectedMethod === "gopay" ? "Scan dari GoPay atau Gojek" : "Scan untuk berdonasi ke DANA"}
                        </figcaption>
                      </figure>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </LazyMotion>
      </div>
    </div>
  );
}

export default Donasi;
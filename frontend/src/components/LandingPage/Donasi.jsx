import React, { useState, useEffect } from "react";
import SeoHelmet from "../SEOHelmet";
import { useSiteStore } from "../../stores/siteStore";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const gopayQrUrl = "https://res.cloudinary.com/dr7olcn4r/image/upload/v1761843697/QRIS_Gopay_c70ei6.jpg";
const danaQrUrl = "https://res.cloudinary.com/dr7olcn4r/image/upload/v1761843697/QRIS_Dana_mz3lgf.jpg";

const SecureImage = ({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    className={`w-full h-auto ${className}`}
    onContextMenu={(e) => e.preventDefault()}
    draggable="false"
  />
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

function Donasi() {
  const siteData = useSiteStore((state) => state.siteData);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(true);

  // FIX: Delay sengaja diset 3000ms (3 Detik) agar kamu bisa lihat skeleton 
  // dan transisi Framer Motion dengan sempurna setelah overlay tertutup!
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectMethod = (method) => {
    setSelectedMethod((current) => (current === method ? null : method));
  };

  return (
    <div
      className="bg-base-100 min-h-[auto] lg:min-h-screen flex flex-col items-center justify-center py-16 lg:py-0 scroll-mt-16 lg:scroll-mt-24 text-base-content"
      id="donasi"
    >
      <SeoHelmet
        title="Donasi ke Mazda Nawallsyah"
        description={
          siteData.aboutParagraph
            ? siteData.aboutParagraph.substring(0, 160)
            : "Silakan Jika berminat untuk Berdonasi, klik salah satu ya."
        }
        url="/donasi"
      />

      <div className="w-full max-w-6xl mx-auto px-4 lg:px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-2 tracking-tight">
            Beri Dukungan
          </h2>
          <p className="text-base md:text-lg text-base-content/60">
            Jika Anda merasa terbantu, Anda bisa memberi apresiasi.
          </p>
        </motion.div>

        <div className="max-w-lg mx-auto flex flex-col items-center">
          {loading ? (
            /* SKELETON: Akan terlihat jelas selama 3 detik! */
            <div className="w-full space-y-8 flex flex-col items-center hover:cursor-wait">
              <div className="grid grid-cols-2 gap-4 md:gap-6 w-full mb-8">
                <div className="skeleton h-24 w-full rounded-3xl"></div>
                <div className="skeleton h-24 w-full rounded-3xl"></div>
              </div>
              <div className="skeleton h-80 w-full max-w-xs rounded-[2rem]"></div>
            </div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-2 gap-4 md:gap-6 w-full mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectMethod("gopay")}
                  className={`card shadow-sm p-4 flex flex-col items-center justify-center transition-all duration-300 rounded-3xl border-2 ${selectedMethod === "gopay"
                      ? "bg-base-200 border-primary shadow-lg"
                      : "border-base-content/10 bg-base-100 hover:border-primary/50"
                    }`}
                >
                  {/* FIX LOGO: Dibungkus container bg-white agar logo GoPay (hitam) selalu terlihat */}
                  <div className="bg-white p-2 rounded-xl shadow-inner w-full flex justify-center items-center h-16">
                    <img
                      src="https://brandlogos.net/wp-content/uploads/2022/10/gopay-logo_brandlogos.net_gph3u.png"
                      alt="Gopay Logo"
                      className="h-8 md:h-10 w-auto object-contain"
                    />
                  </div>
                </motion.button>

                <motion.button
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectMethod("dana")}
                  className={`card shadow-sm p-4 flex flex-col items-center justify-center transition-all duration-300 rounded-3xl border-2 ${selectedMethod === "dana"
                      ? "bg-base-200 border-info shadow-lg"
                      : "border-base-content/10 bg-base-100 hover:border-info/50"
                    }`}
                >
                  <div className="bg-white p-2 rounded-xl shadow-inner w-full flex justify-center items-center h-16">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/52/Dana_logo.png"
                      alt="Dana Logo"
                      className="h-6 md:h-8 w-auto object-contain"
                    />
                  </div>
                </motion.button>
              </motion.div>

              <div className="w-full max-w-xs min-h-[350px] flex justify-center">
                {/* ANIMATE PRESENCE: Membuat QR Code muncul & hilang dengan transisi Bounce! */}
                <AnimatePresence mode="wait">
                  {selectedMethod && (
                    <motion.figure
                      key={selectedMethod}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ duration: 0.4, type: "spring" }}
                      className={`card w-full p-5 shadow-2xl border-2 rounded-[2rem] bg-base-100 ${selectedMethod === "gopay" ? "border-primary" : "border-info"
                        }`}
                    >
                      <div className="bg-white p-2 rounded-2xl">
                        <SecureImage
                          src={selectedMethod === "gopay" ? gopayQrUrl : danaQrUrl}
                          alt={`QRIS ${selectedMethod}`}
                          className="rounded-xl"
                        />
                      </div>
                      <figcaption className="text-center mt-4 text-sm font-bold opacity-80 flex flex-col items-center gap-2">
                        <Icon icon="mdi:qrcode-scan" className="w-6 h-6" />
                        {selectedMethod === "gopay" ? "Scan dari GoPay atau Gojek" : "Scan untuk berdonasi ke DANA"}
                      </figcaption>
                    </motion.figure>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Donasi;
import React, { useEffect, useState } from "react";
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";

function Transition({ isLoading, onExitComplete }) {
  const [loadingText, setLoadingText] = useState("take it easy dude...");

  useEffect(() => {
    if (!isLoading) return;
    const texts = [
      "Mengambil Preferensi...",
      "Menyusun Konfigurasi...",
      "Sedikit Lagi...",
    ];
    let i = 0;
    const timer = setInterval(() => {
      if (i < texts.length) {
        setLoadingText(texts[i]);
        i++;
      }
    }, 1800);
    return () => clearInterval(timer);
  }, [isLoading]);

  const rippleVariants = {
    animate: (i) => ({
      scale: [1, 4.5], 
      opacity: [0.6, 0], 
      transition: {
        repeat: Infinity,
        duration: 3, 
        delay: i * 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94], 
      },
    }),
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <m.div
            key="water-transition"
            initial={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{
              opacity: 0,
              filter: "blur(20px)", 
              scale: 1.1,
              transition: {
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1]
              }
            }}
            
            onAnimationComplete={(definition) => {
              if (definition === "exit" && onExitComplete) {
                onExitComplete();
              }
            }}
            className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-base-100 overflow-hidden pointer-events-auto"
          >
            <div className="relative flex flex-col items-center justify-center">
              {[...Array(5)].map((_, i) => (
                <m.div
                  key={i}
                  custom={i}
                  variants={rippleVariants}
                  animate="animate"
                  className="absolute rounded-full border border-primary/30"
                  style={{
                    width: "100px", 
                    height: "100px",
                    translateX: "-50%",
                    translateY: "-50%",
                    top: "50%",
                    left: "50%",
                  }}
                />
              ))}

              <m.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-display font-black tracking-widest text-primary uppercase text-sm animate-pulse mt-[160px]"
              >
                {loadingText}
              </m.p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

export default Transition;
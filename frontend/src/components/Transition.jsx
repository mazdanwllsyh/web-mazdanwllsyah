import React, { useEffect, useState, useRef } from "react";
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { isBot } from "../App";

const NORMAL_STEPS = [
  { text: "MOUNTING_COMPONENTS", color: "text-secondary", fill: "fill-secondary/80" },
  { text: "RESOLVING_ASSETS", color: "text-accent", fill: "fill-accent/65" },
  { text: "FINALIZING_UI", color: "text-primary", fill: "fill-primary/45" }
];

const LAG_STEP = { text: "BUYING_TIME", color: "text-warning", fill: "fill-warning/55" };

function Transition({ isLoading, onExitComplete }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLagging, setIsLagging] = useState(false);
  const lagTimerRef = useRef(null);

  useEffect(() => {
    if (!isLoading || isBot) return;

    const t1 = setTimeout(() => { setProgress(35); setStep(1); }, 300);
    const t2 = setTimeout(() => { setProgress(75); setStep(2); }, 600);
    const t3 = setTimeout(() => {
      setProgress(100);
      lagTimerRef.current = setTimeout(() => setIsLagging(true), 800);
    }, 900);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      if (lagTimerRef.current) clearTimeout(lagTimerRef.current);
    };
  }, [isLoading]);

  if (isBot) return null;

  const currentProps = isLagging ? LAG_STEP : NORMAL_STEPS[step];

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
        {isLoading && (
          <m.div
            key="elite-transition"
            initial={{ opacity: 1, scale: 1, pointerEvents: "auto" }}
            exit={{
              opacity: 0,
              scale: 3,
              pointerEvents: "none",
              transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
            }}
            className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-base-100 overflow-hidden"
            style={{ transformOrigin: "center center", willChange: "opacity, transform" }}
          >
            <m.div
              exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.35, ease: "easeIn" } }}
              className="flex flex-col items-center gap-6 mb-20"
            >
              <m.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center z-10"
                style={{ willChange: "transform" }}
              >
                <svg viewBox="0 0 100 100" className={`absolute w-full h-full fill-transparent stroke-current stroke-[1px] ${currentProps.color}`}>
                  <polygon points="50,2 91.5,26 91.5,74 50,98 8.5,74 8.5,26" />
                </svg>
                <m.svg
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: isLagging ? 2 : 8, ease: "linear" }}
                  viewBox="0 0 100 100"
                  className={`absolute w-[80%] h-[80%] fill-transparent stroke-current stroke-[2px] opacity-70 ${currentProps.color}`}
                  style={{ willChange: "transform" }}
                >
                  <polygon points="50,2 91.5,26 91.5,74 50,98 8.5,74 8.5,26" />
                </m.svg>
                <svg viewBox="0 0 100 100" className={`absolute w-[50%] h-[50%] stroke-current stroke-[3px] ${currentProps.color} ${currentProps.fill}`}>
                  <polygon points="50,2 91.5,26 91.5,74 50,98 8.5,74 8.5,26" />
                </svg>
              </m.div>

              <div className="flex flex-col items-center gap-1 z-20">
                <span className={`font-mono text-xs md:text-sm font-bold tracking-[0.25em] uppercase ${currentProps.color}`}>
                  {currentProps.text}_
                </span>
              </div>
            </m.div>

            <m.div
              exit={{ opacity: 0, y: 40, transition: { duration: 0.3, ease: "easeIn" } }}
              className="absolute bottom-0 left-0 right-0 w-full flex flex-col items-center"
            >
              <div className={`mb-2 font-mono text-2xl md:text-3xl font-black tracking-widest ${currentProps.color}`}>
                {progress}%
              </div>
              <div className="w-full h-3 md:h-4 bg-base-content/10 relative overflow-hidden flex">
                <m.div
                  className={`absolute top-0 left-0 h-full ${isLagging ? 'bg-warning' : 'bg-gradient-to-r from-secondary via-accent to-primary'}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                />
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

export default Transition;
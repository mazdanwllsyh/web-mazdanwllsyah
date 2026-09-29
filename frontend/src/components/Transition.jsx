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

    let currentStep = 0;
    const textTimer = setInterval(() => {
      if (currentStep < 2) setStep(++currentStep);
    }, 500);

    let currentProgress = 0;
    const progressTimer = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 5) + 5;
      if (currentProgress >= 100) {
        setProgress(100);
        clearInterval(progressTimer);
        lagTimerRef.current = setTimeout(() => setIsLagging(true), 1200);
      } else {
        setProgress(currentProgress);
      }
    }, 45);

    return () => {
      clearInterval(textTimer);
      clearInterval(progressTimer);
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
            initial={{ opacity: 1, pointerEvents: "auto" }}
            exit={{
              opacity: 0,
              pointerEvents: "none",
              transition: { duration: 0.4, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-base-100 overflow-hidden"
            style={{ willChange: "opacity" }}
          >
            <div className="flex flex-col items-center gap-6 mb-20">
              <m.div
                animate={{ scale: [1, 1.1, 1] }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center z-10"
                style={{ willChange: "transform, opacity" }}
              >
                <svg viewBox="0 0 100 100" className={`absolute w-full h-full fill-transparent stroke-current stroke-[1px] transition-colors duration-300 ${currentProps.color}`}>
                  <polygon points="50,2 91.5,26 91.5,74 50,98 8.5,74 8.5,26" />
                </svg>
                <m.svg
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: isLagging ? 2 : 6, ease: "linear" }}
                  viewBox="0 0 100 100"
                  className={`absolute w-[80%] h-[80%] fill-transparent stroke-current stroke-[2px] opacity-70 ${currentProps.color}`}
                  style={{ willChange: "transform" }}
                >
                  <polygon points="50,2 91.5,26 91.5,74 50,98 8.5,74 8.5,26" />
                </m.svg>
                <svg viewBox="0 0 100 100" className={`absolute w-[50%] h-[50%] stroke-current stroke-[3px] transition-colors duration-300 ${currentProps.color} ${currentProps.fill}`}>
                  <polygon points="50,2 91.5,26 91.5,74 50,98 8.5,74 8.5,26" />
                </svg>
              </m.div>

              <m.div exit={{ opacity: 0, y: 10 }} className="flex flex-col items-center gap-1 z-20">
                <span className={`font-mono text-xs md:text-sm font-bold tracking-[0.25em] uppercase transition-colors duration-300 ${currentProps.color}`}>
                  {currentProps.text}_
                </span>
              </m.div>
            </div>

            <m.div exit={{ opacity: 0, y: 20 }} className="absolute bottom-0 left-0 right-0 w-full flex flex-col items-center">
              <div className={`mb-2 font-mono text-2xl md:text-3xl font-black tracking-widest transition-colors duration-300 ${currentProps.color}`}>
                {progress}%
              </div>
              <div className="w-full h-3 md:h-4 bg-base-content/5 relative overflow-hidden flex">
                <m.div
                  className={`absolute top-0 left-0 h-full transition-colors duration-300 ${isLagging ? 'bg-warning' : 'bg-gradient-to-r from-secondary via-accent to-primary'}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "circOut", duration: 0.1 }}
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
import React, { useEffect, useState } from "react";
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { isBot } from "../App";

const NORMAL_STEPS = [
  { text: "MOUNTING_COMPONENTS", color: "text-secondary", fill: "fill-secondary/80", shadow: "drop-shadow-[0_0_15px_rgba(var(--s),0.6)]" },
  { text: "RESOLVING_ASSETS", color: "text-accent", fill: "fill-accent/65", shadow: "drop-shadow-[0_0_15px_rgba(var(--a),0.75)]" },
  { text: "FINALIZING_UI", color: "text-primary", fill: "fill-primary/45", shadow: "drop-shadow-[0_0_15px_rgba(var(--p),0.9)]" }
];

const LAG_STEP = {
  text: "WAITING_FOR_RESPONSE",
  color: "text-warning",
  fill: "fill-warning/55",
  shadow: "drop-shadow-[0_0_20px_rgba(var(--wa),0.9)]"
};

function Transition({ isLoading, onExitComplete }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLagging, setIsLagging] = useState(false);

  useEffect(() => {
    if (!isLoading || isBot) return;

    let currentStep = 0;
    const textTimer = setInterval(() => {
      currentStep++;
      if (currentStep < NORMAL_STEPS.length) {
        setStep(currentStep);
      } else {
        clearInterval(textTimer);
      }
    }, 450);

    let currentProgress = 0;
    const progressTimer = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 4) + 3;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setIsLagging(true);
        clearInterval(progressTimer);
      }
      setProgress(currentProgress);
    }, 40);

    return () => {
      clearInterval(textTimer);
      clearInterval(progressTimer);
    };
  }, [isLoading]);

  if (isBot) return null;

  const currentProps = isLagging ? LAG_STEP : NORMAL_STEPS[step];

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <m.div
            key="elite-transition"
            initial={{ opacity: 1, backdropFilter: "blur(0px)" }}
            exit={{
              opacity: 0,
              backdropFilter: "blur(0px)",
              transition: { duration: 0.6, ease: "easeOut", delay: 0.1 }
            }}
            onAnimationComplete={(definition) => {
              if (definition === "exit" && onExitComplete) onExitComplete();
            }}
            className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-base-100 overflow-hidden pointer-events-auto"
          >
            <div className="flex flex-col items-center gap-6 mb-20">

              <m.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.15, 1] }}
                exit={{ scale: 150, opacity: 0, transition: { duration: 0.8, ease: "circIn" } }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center z-10"
              >
                <m.svg
                  viewBox="0 0 100 100"
                  animate={{ color: currentProps.color }}
                  className={`absolute w-full h-full fill-transparent stroke-current stroke-[1px] transition-colors duration-500 ${currentProps.shadow}`}
                >
                  <polygon points="50,2 91.5,26 91.5,74 50,98 8.5,74 8.5,26" />
                </m.svg>

                <m.svg
                  animate={{ rotate: 360, color: currentProps.color }}
                  transition={{
                    rotate: isLagging
                      ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                      : { repeat: Infinity, duration: 8, ease: "linear" },
                    color: { duration: 0.5 }
                  }}
                  viewBox="0 0 100 100"
                  className="absolute w-[80%] h-[80%] fill-transparent stroke-current stroke-[2px] opacity-70"
                >
                  <polygon points="50,2 91.5,26 91.5,74 50,98 8.5,74 8.5,26" />
                </m.svg>

                <m.svg
                  animate={{ scale: [1, 0.85, 1] }}
                  transition={{
                    scale: isLagging
                      ? { repeat: Infinity, duration: 0.6, ease: "easeInOut" }
                      : { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
                  }}
                  viewBox="0 0 100 100"
                  className={`absolute w-[50%] h-[50%] stroke-current stroke-[3px] transition-colors duration-500 ${currentProps.color} ${currentProps.fill}`}
                >
                  <polygon points="50,2 91.5,26 91.5,74 50,98 8.5,74 8.5,26" />
                </m.svg>
              </m.div>

              <m.div
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-1 z-20"
              >
                <m.span
                  key={currentProps.text}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-mono text-xs md:text-sm font-bold tracking-[0.25em] uppercase transition-colors duration-500 ${currentProps.color}`}
                >
                  {currentProps.text}
                  <m.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: isLagging ? 0.4 : 0.8 }}
                    className="inline-block ml-1"
                  >_</m.span>
                </m.span>
              </m.div>
            </div>

            <m.div
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-0 left-0 right-0 w-full flex flex-col items-center"
            >
              <m.div className={`mb-2 font-mono text-2xl md:text-3xl font-black tracking-widest transition-colors duration-500 drop-shadow-md ${currentProps.color}`}>
                {progress}%
              </m.div>

              <div className="w-full h-3 md:h-4 bg-base-content/5 relative overflow-hidden flex">
                <m.div
                  className={`absolute top-0 left-0 h-full transition-colors duration-500 ${isLagging ? 'bg-warning' : 'bg-gradient-to-r from-secondary via-accent to-primary'}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "circOut", duration: 0.1 }}
                />

                <div className="absolute inset-0 flex justify-evenly w-full h-full pointer-events-none">
                  {[...Array(50)].map((_, i) => (
                    <div key={`mask-${i}`} className="w-[3px] md:w-[4px] h-full bg-base-100 z-10" />
                  ))}
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

export default Transition;
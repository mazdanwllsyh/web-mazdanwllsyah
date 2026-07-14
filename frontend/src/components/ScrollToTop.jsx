import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { m, AnimatePresence } from "framer-motion";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isFlying, setIsFlying] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            const scrolled = window.scrollY;
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (scrolled > totalHeight * 0.12) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
                setIsFlying(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const handleScrollAndFly = () => {
        setIsFlying(true);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-6 md:bottom-8 left-0 right-0 z-[90] pointer-events-none flex justify-center w-full">
                    <div className="w-[92%] md:w-[88%] lg:w-[85%] max-w-7xl relative flex justify-end">
                        <m.button
                            onClick={handleScrollAndFly}
                            initial={{ opacity: 0, scale: 0.5, y: 50 }}
                            animate={isFlying ? { y: -800, scale: 0.8, opacity: 0 } : { opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 20 }}
                            whileHover={!isFlying ? { scale: 1.1 } : {}}
                            whileTap={!isFlying ? { scale: 0.9 } : {}}
                            transition={isFlying ? { duration: 0.5, ease: "easeIn" } : { type: "spring", stiffness: 260, damping: 20 }}
                            className="p-2.5 md:p-3.5 md:fixed md:bottom-8 md:right-8 xl:right-16 rounded-xl md:rounded-2xl bg-base-100/80 backdrop-blur-md border border-base-content/30 shadow-lg text-base-content hover:bg-gradient-to-br hover:from-accent hover:to-primary hover:text-primary-content transition-all group pointer-events-auto"
                            aria-label="Scroll to top"
                        >
                            <Icon icon="solar:alt-arrow-up-bold-duotone" className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-y-1 transition-transform duration-300" />
                        </m.button>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
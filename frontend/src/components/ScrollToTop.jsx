import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { m, AnimatePresence } from "framer-motion";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            const scrolled = window.scrollY;
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (scrolled > totalHeight * 0.12) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <m.button
                    onClick={scrollToTop}
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[90] p-2.5 md:p-3.5 rounded-xl md:rounded-2xl bg-base-100/80 backdrop-blur-md border border-base-content/30 shadow-lg text-base-content hover:bg-gradient-to-br hover:from-accent hover:to-primary hover:text-primary-content transition-all group"
                    aria-label="Scroll to top"
                >
                    <Icon icon="solar:alt-arrow-up-bold-duotone" className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-y-1 transition-transform duration-300" />
                </m.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
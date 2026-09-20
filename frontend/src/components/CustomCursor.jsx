import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { isBot } from "../App";

const CustomCursor = () => {
    
    const isTouchOnly = typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (isBot || isTouchOnly) return null;

    const cursorX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : -100);
    const cursorY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : -100);

    const springConfig = { damping: 25, stiffness: 350, mass: 0.1 };
    const smoothX = useSpring(cursorX, springConfig);
    const smoothY = useSpring(cursorY, springConfig);

    const [isHover, setIsHover] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.05, 1], [0, 1, 1]);

    useEffect(() => {
        const checkTheme = () => {
            const theme = document.documentElement.getAttribute("data-theme");
            setIsDarkMode(["synthwave", "dark", "black", "business", "night", "dim", "abyss", "sunset", "forest", "aqua", "luxury", "dracula", "coffee"].includes(theme));
        };

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        checkTheme();

        const move = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const checkHover = (e) => {
            const t = e.target;
            if (t.tagName === 'A' || t.tagName === 'BUTTON' || t.closest('a') || t.closest('button') || t.classList.contains('cursor-pointer')) {
                setIsHover(true);
            } else {
                setIsHover(false);
            }
        };

        window.addEventListener('mousemove', move, { passive: true });
        window.addEventListener('mouseover', checkHover, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseover', checkHover);
        }
    }, [cursorX, cursorY]);

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-primary z-[99998] pointer-events-none origin-left"
                style={{ scaleX, opacity, willChange: "transform, opacity" }}
            />

            <motion.div
                className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[999999]"
                style={{ x: smoothX, y: smoothY, willChange: "transform" }}
            >
                {isDarkMode && (
                    <motion.div
                        className="absolute rounded-full bg-primary/30 blur-[60px] mix-blend-screen"
                        animate={{ width: isHover ? 160 : 80, height: isHover ? 160 : 80, x: "-50%", y: "-50%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ willChange: "width, height" }}
                    />
                )}

                <motion.div
                    className={`absolute rounded-full bg-gradient-to-br from-accent to-primary ${!isDarkMode ? "shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-white/50" : ""}`}
                    animate={{ width: isHover ? 0 : 12, height: isHover ? 0 : 12, opacity: isHover ? 0 : 1, x: "-50%", y: "-50%" }}
                    transition={{ type: "spring", stiffness: 600, damping: 25 }}
                    style={{ willChange: "width, height, opacity" }}
                />

                <motion.div
                    className={`absolute border rounded-full backdrop-blur-sm ${isDarkMode ? "border-primary/60 bg-primary/10" : "border-primary/40 bg-primary/5 shadow-[0_8px_24px_rgba(0,0,0,0.15)]"}`}
                    animate={{ width: isHover ? 48 : 0, height: isHover ? 48 : 0, opacity: isHover ? 1 : 0, x: "-50%", y: "-50%" }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    style={{ willChange: "width, height, opacity" }}
                />
            </motion.div>
        </>
    );
};

export default CustomCursor;
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const CustomCursor = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHover, setIsHover] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.05, 1], [0, 1, 1]);

    const springConfig = { damping: 25, stiffness: 400, mass: 0.2 };
    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);

    useEffect(() => {
        cursorX.set(mousePos.x);
        cursorY.set(mousePos.y);
    }, [mousePos, cursorX, cursorY]);

    useEffect(() => {
        const checkTheme = () => {
            const theme = document.documentElement.getAttribute("data-theme");
            setIsDarkMode(["synthwave", "dark", "black", "business", "night", "dim", "abyss",
                "sunset", "forest", "aqua", "luxury", "dracula", "coffee"].includes(theme));
        };

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"]
        });
        checkTheme();

        const move = (e) => {
            if (e.touches && e.touches.length > 0) {
                setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
            } else {
                setMousePos({ x: e.clientX, y: e.clientY });
            }
        };

        const checkHover = (e) => {
            const t = e.target;
            if (
                t.tagName === 'A' || t.tagName === 'BUTTON' || t.tagName === 'IMG' ||
                t.closest('a') || t.closest('button') || t.classList.contains('cursor-pointer') ||
                t.classList.contains('checkbox')
            ) {
                setIsHover(true);
            } else {
                setIsHover(false);
            }
        };

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseover', checkHover);
        window.addEventListener('touchmove', move, { passive: true });
        window.addEventListener('touchstart', (e) => { move(e); checkHover(e); }, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseover', checkHover);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchstart', move);
        }
    }, []);

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-primary z-[99998] pointer-events-none origin-left"
                style={{ scaleX, opacity }}
            />

            <motion.div
                className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[999999]"
                style={{ x: cursorX, y: cursorY }}
            >
                {isDarkMode && (
                    <motion.div
                        className="absolute rounded-full bg-primary/20 blur-[50px] mix-blend-screen"
                        animate={{
                            width: isHover ? 160 : 80,
                            height: isHover ? 160 : 80,
                            x: "-50%",
                            y: "-50%",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}

                <motion.div
                    className={`absolute rounded-full bg-gradient-to-br from-accent to-primary ${!isDarkMode ? "shadow-[0_5px_22px_rgba(0,0,0,12)] border border-white/30" : ""}`}
                    animate={{
                        width: isHover ? 0 : 12,
                        height: isHover ? 0 : 12,
                        opacity: isHover ? 0 : 1,
                        x: "-30%",
                        y: "-30%"
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                />

                <motion.div
                    className={`absolute border rounded-full backdrop-blur-sm ${isDarkMode
                        ? "border-primary/50 bg-primary/10"
                        : "border-primary/30 bg-primary/5 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                        }`}
                    animate={{
                        width: isHover ? 48 : 0,
                        height: isHover ? 48 : 0,
                        opacity: isHover ? 1 : 0,
                        x: "-50%",
                        y: "-50%"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
            </motion.div>
        </>
    );
};

export default CustomCursor;
import React, { useEffect, useRef, useState } from "react";
import { isBot } from "../App";

const CustomCursor = () => {
    const isTouchOnly = typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (isBot || isTouchOnly) return null;

    const cursorDot = useRef(null);
    const cursorOutline = useRef(null);
    const requestRef = useRef(null);
    const [isHover, setIsHover] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const mouse = useRef({ x: typeof window !== "undefined" ? window.innerWidth / 2 : -100, y: typeof window !== "undefined" ? window.innerHeight / 2 : -100 });
    const pos = useRef({ x: typeof window !== "undefined" ? window.innerWidth / 2 : -100, y: typeof window !== "undefined" ? window.innerHeight / 2 : -100 });

    useEffect(() => {
        const checkTheme = () => {
            const theme = document.documentElement.getAttribute("data-theme");
            setIsDarkMode(["synthwave", "dark", "black", "business", "night", "dim", "abyss", "sunset", "forest", "aqua", "luxury", "dracula", "coffee"].includes(theme));
        };

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        checkTheme();

        const onMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        const onMouseOver = (e) => {
            const t = e.target;
            if (t.tagName === 'A' || t.tagName === 'BUTTON' || t.closest('a') || t.closest('button') || t.classList.contains('cursor-pointer')) {
                setIsHover(true);
            } else {
                setIsHover(false);
            }
        };

        const renderLoop = () => {
            pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
            pos.current.y += (mouse.current.y - pos.current.y) * 0.15;

            if (cursorDot.current) {
                cursorDot.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
            }
            if (cursorOutline.current) {
                cursorOutline.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
            }

            requestRef.current = requestAnimationFrame(renderLoop);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('mouseover', onMouseOver, { passive: true });
        requestRef.current = requestAnimationFrame(renderLoop);

        return () => {
            observer.disconnect();
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
            cancelAnimationFrame(requestRef.current);
        }
    }, []);

    return (
        <div className="pointer-events-none z-[999999] fixed top-0 left-0">
            <div
                ref={cursorOutline}
                className={`absolute rounded-full transition-[width,height,background-color,border-color] duration-300 ease-out will-change-transform ${isDarkMode ? "border-primary/60 bg-primary/10" : "border-primary/40 bg-primary/5 shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                    }`}
                style={{
                    width: isHover ? "48px" : "0px",
                    height: isHover ? "48px" : "0px",
                    opacity: isHover ? 1 : 0,
                    backdropFilter: isHover ? "blur(4px)" : "blur(0px)"
                }}
            />

            <div
                ref={cursorDot}
                className={`absolute rounded-full bg-gradient-to-br from-accent to-primary transition-[width,height,opacity] duration-300 ease-out will-change-transform ${!isDarkMode ? "shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-white/50" : ""
                    }`}
                style={{
                    width: isHover ? "0px" : "12px",
                    height: isHover ? "0px" : "12px",
                    opacity: isHover ? 0 : 1,
                }}
            />
        </div>
    );
};

export default CustomCursor;
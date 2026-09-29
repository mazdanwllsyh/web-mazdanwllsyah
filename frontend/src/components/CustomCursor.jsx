import React, { useEffect, useRef } from "react";
import { isBot } from "../App";

const CustomCursor = () => {
    const cursorDot = useRef(null);
    const cursorOutline = useRef(null);
    const requestRef = useRef(null);
    const isHover = useRef(false);
    const isDarkMode = useRef(false);
    const mouse = useRef({ x: -100, y: -100 });
    const pos = useRef({ x: -100, y: -100 });
    const isIdle = useRef(false);
    let idleTimeout;

    useEffect(() => {
        const isTouchOnly = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (isBot || isTouchOnly || reduceMotion) return;

        const checkTheme = () => {
            const theme = document.documentElement.getAttribute("data-theme");
            const darkThemes = ["synthwave", "dark", "black", "business", "night", "dim", "abyss", "sunset", "forest", "aqua", "luxury", "dracula", "coffee"];
            const nowDark = darkThemes.includes(theme);
            if (nowDark !== isDarkMode.current) {
                isDarkMode.current = nowDark;
                if (nowDark) {
                    cursorOutline.current.className = "absolute rounded-full border border-primary/60 bg-primary/10 pointer-events-none";
                    cursorDot.current.className = "absolute rounded-full bg-gradient-to-br from-accent to-primary pointer-events-none";
                } else {
                    cursorOutline.current.className = "absolute rounded-full border border-primary/40 bg-primary/5 shadow-[0_8px_24px_rgba(0,0,0,0.15)] pointer-events-none";
                    cursorDot.current.className = "absolute rounded-full bg-gradient-to-br from-accent to-primary shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-white/50 pointer-events-none";
                }
            }
        };

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        checkTheme();

        const onMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
            isIdle.current = false;
            clearTimeout(idleTimeout);
            idleTimeout = setTimeout(() => isIdle.current = true, 2000);
        };

        const onMouseOver = (e) => {
            const t = e.target;
            isHover.current = !!(t.tagName === 'A' || t.tagName === 'BUTTON' || t.closest('a') || t.closest('button') || t.classList.contains('cursor-pointer'));
        };

        const renderLoop = () => {
            if (isIdle.current) {
                requestRef.current = requestAnimationFrame(renderLoop);
                return;
            }
            pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
            pos.current.y += (mouse.current.y - pos.current.y) * 0.15;

            if (cursorDot.current && cursorOutline.current) {
                cursorDot.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
                cursorOutline.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;

                if (isHover.current) {
                    cursorOutline.current.style.width = "48px";
                    cursorOutline.current.style.height = "48px";
                    cursorOutline.current.style.opacity = "1";
                    cursorDot.current.style.opacity = "0";
                } else {
                    cursorOutline.current.style.width = "0px";
                    cursorOutline.current.style.height = "0px";
                    cursorOutline.current.style.opacity = "0";
                    cursorDot.current.style.width = "12px";
                    cursorDot.current.style.height = "12px";
                    cursorDot.current.style.opacity = "1";
                }
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
            clearTimeout(idleTimeout);
        };
    }, []);

    if (isBot) return null;

    return (
        <div className="pointer-events-none z-[9999] fixed top-0 left-0 w-full h-full hidden md:block overflow-hidden">
            <div ref={cursorOutline} />
            <div ref={cursorDot} />
        </div>
    );
};

export default CustomCursor;
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
        const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
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

        return () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseover', checkHover);
        }
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[999999] hidden lg:block"
            animate={{ x: mousePos.x, y: mousePos.y }}
            transition={{ type: "spring", stiffness: 800, damping: 40, mass: 0.2 }}
        >
            <motion.div
                className="absolute bg-gradient-to-br from-accent to-primary rounded-full"
                animate={{
                    width: isHover ? 0 : 12,
                    height: isHover ? 0 : 12,
                    opacity: isHover ? 0 : 1,
                    x: "-50%",
                    y: "-50%"
                }}
            />
            <motion.div
                className="absolute border border-primary bg-primary/10 backdrop-blur-sm rounded-full"
                animate={{
                    width: isHover ? 32 : 0,
                    height: isHover ? 32 : 0,
                    opacity: isHover ? 0.87 : 0,
                    x: "-50%",
                    y: "-50%"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
        </motion.div>
    );
};

export default CustomCursor;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { m } from "framer-motion";

const FABDonate = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsExpanded(true);
            setTimeout(() => {
                setIsExpanded(false);
            }, 5500);
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const showFull = isExpanded || isHovered;

    return (
        <div
            className="fixed top-1/2 -translate-y-1/2 right-0 z-[90] flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to="/donasi" aria-label="Support me on Buy Me a Coffee" className="block md:hidden">
                <m.div
                    className="bg-base-300/90 shadow-xl flex flex-col items-center justify-center rounded-l-2xl border-y border-l border-white/30 py-3 px-1.5"
                    initial={false}
                    animate={{
                        x: showFull ? 0 : "calc(95% - 1px)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                    <Icon icon="simple-icons:buymeacoffee" className="w-5 h-5 shrink-0 mb-1.5" />
                    <span
                        className="text-[11px] tracking-widest whitespace-nowrap"
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                        Buy me a Coffee
                    </span>
                </m.div>
            </Link>

            <Link to="/donasi" aria-label="Support me on Buy Me a Coffee" className="hidden md:block">
                <m.div
                    className="bg-base-300/75 shadow-xl flex items-center rounded-l-full cursor-pointer border-y border-l border-white/30 h-10 md:h-12 px-2 md:px-3"
                    initial={false}
                    animate={{
                        x: showFull ? 0 : "calc(100% - 3px)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                    <Icon icon="simple-icons:buymeacoffee" className="w-5 h-5 shrink-0" />
                    <span className="ml-2 text-sm whitespace-nowrap">
                        Buy me a Coffee
                    </span>
                </m.div>
            </Link>
        </div>
    );
};

export default FABDonate;
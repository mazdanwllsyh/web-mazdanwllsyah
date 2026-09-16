import React from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";

export default function HexagonBackground({
    className = "",
    hexColor = "text-primary/40",
    animate = true
}) {
    const hexPath = "M30 0 L60 17.32 L60 51.96 L30 69.28 L0 51.96 L0 17.32 Z";

    return (
        <div className={`fixed inset-0 pointer-events-none -z-10 w-full h-full bg-base-100 overflow-hidden ${className}`}>
            <LazyMotion features={domAnimation}>
                <m.svg
                    className="absolute inset-0 w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                    initial={animate ? { opacity: 0.42 } : false}
                    animate={animate ? { opacity: [0.37, 0.62, 0.22] } : false}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                >
                    <defs>
                        <pattern
                            id="hex-pattern-base"
                            width="60"
                            height="103.92"
                            patternUnits="userSpaceOnUse"
                            patternTransform="scale(0.7)"
                        >
                            <path d={hexPath} className={`fill-transparent stroke-current stroke-[1px] ${hexColor}`} />
                            <path d={hexPath} transform="translate(30, 51.96)" className={`fill-transparent stroke-current stroke-[1px] ${hexColor}`} />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hex-pattern-base)" />
                </m.svg>
            </LazyMotion>

            <div className="absolute inset-0 bg-base-100 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_30%,black_100%)]"></div>
        </div>
    );
}
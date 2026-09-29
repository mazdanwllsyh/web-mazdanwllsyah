import React from "react";
import { isBot } from "../App";

export default function HexagonBackground({
    className = "",
    hexColor = "text-primary/30",
    animate = true
}) {
    const hexPath = "M30 0 L60 17.32 L60 51.96 L30 69.28 L0 51.96 L0 17.32 Z";

    if (isBot) return null;

    return (
        <div className={`fixed inset-0 pointer-events-none -z-10 w-full h-full overflow-hidden ${className}`}>
            <style>
                {`
                    @keyframes hexPulseHeavy {
                        0%, 100% { opacity: 0.25; transform: translateZ(0) scale(1); }
                        50% { opacity: 0.50; transform: translateZ(0) scale(1.02); }
                    }
                    .animate-hex-pulse {
                        animation: hexPulseHeavy 6s ease-in-out infinite;
                        will-change: opacity, transform;
                    }
                `}
            </style>

            <svg
                className={`absolute inset-0 w-full h-full ${animate ? 'animate-hex-pulse' : 'opacity-40'}`}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id="hex-pattern-base"
                        width="60"
                        height="103.92"
                        patternUnits="userSpaceOnUse"
                        patternTransform="scale(0.9)"
                    >
                        <path d={hexPath} className={`fill-transparent stroke-current stroke-[1px] ${hexColor}`} />
                        <path d={hexPath} transform="translate(30, 51.96)" className={`fill-transparent stroke-current stroke-[1px] ${hexColor}`} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hex-pattern-base)" />
            </svg>
            <div className="absolute inset-0 bg-base-100 [mask-image:radial-gradient(ellipse_85%_85%_at_50%_50%,transparent_35%,black_100%)] pointer-events-none"></div>
        </div>
    );
}
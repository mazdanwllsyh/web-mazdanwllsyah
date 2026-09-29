import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import Sitemap from "vite-plugin-sitemap";

export default defineConfig({
  base: "/",
  plugins: [
    tailwindcss({
      config: {
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
        daisyui: {
          themes: [
            "emerald",
            "light",
            "corporate",
            "synthwave",
            "dark",
            "black",
            "business",
            "night",
            "dim",
            "abyss",
            "bumblebee",
            "caramellatte",
            "nord",
            "cupcake",
            "retro",
            "valentine",
            "halloween",
            "garden",
            "forest",
            "aqua",
            "lofi",
            "pastel",
            "fantasy",
            "wireframe",
            "luxury",
            "dracula",
            "cmyk",
            "autumn",
            "acid",
            "lemonade",
            "coffee",
            "winter",
            "sunset",
          ],
        },
      },
    }),
    react(),
    visualizer({ open: false }),
    Sitemap({
      hostname: "https://mazdaweb.bejalen.com",
      dynamicRoutes: [
        "/",
        "/tentang",
        "/sertifikasi",
        "/donasi",
        "/signin",
        "/signup",
        "/verifikasi",
      ],
      generateRobotsTxt: true,
      robots: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/dashboard/", "/profil/"],
        },
      ],
    }),
  ],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("react-router-dom")) return "routing";
            if (id.includes("react") || id.includes("react-dom"))
              return "vendor";
            return "core";
          }
        },
      },
    },
  },
});

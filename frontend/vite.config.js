import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import Sitemap from "vite-plugin-sitemap";

export default defineConfig(({ mode }) => {
  return {
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
              "halloween",
              "forest",
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
      Sitemap({
        hostname: "https://mazdaweb.bejalen.com",
        outDir: "dist",
        dynamicRoutes: ["/tentang", "/sertifikasi", "/donasi"],
        customRouteConfig: [
          { url: "/", priority: 1.0, changefreq: "daily" },
          { url: "/tentang", priority: 0.9, changefreq: "weekly" },
          { url: "/sertifikasi", priority: 0.8, changefreq: "monthly" },
          { url: "/donasi", priority: 0.5, changefreq: "yearly" },
        ],
        exclude: ["/signin", "/signup", "/verifikasi", "/dashboard", "/profil"],
        generateRobotsTxt: true,
        robots: [
          {
            userAgent: "*",
            allow: "/",
            disallow: [
              "/dashboard/",
              "/profil/",
              "/signin/",
              "/signup/",
              "/verifikasi/",
            ],
          },
        ],
      }),
      process.env.ANALYZE === "true" &&
        visualizer({ open: true, filename: "stats.html" }),
    ].filter(Boolean),
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
  };
});

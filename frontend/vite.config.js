import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: "/",
  plugins: [
    tailwindcss({
      config: {
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
        theme: {
          extend: {
            fontFamily: {
              sans: [
                '"SF UI Text"',
                '"SF Pro Text"', 
                "system-ui",
                "-apple-system",
                "BlinkMacSystemFont",
                "Segoe UI",
                "Roboto",
                "sans-serif",
              ],
              display: [
                '"SF UI Display"',
                '"SF Pro Display"', 
                "sans-serif",
              ],
            },
          },
        },
        daisyui: {
          themes: [
            "emerald",
            "garden",
            "light",
            "corporate",
            "synthwave",
            "dark",
            "black",
            "business",
            "night",
            "dim",
            "abyss",
          ],
        },
      },
    }),
    react(),
    visualizer({ open: true }),
  ],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) return "vendor-framer";
            if (id.includes("@react-pdf") || id.includes("pdfjs-dist"))
              return "vendor-pdf";
            if (id.includes("react/") || id.includes("react-dom/"))
              return "vendor-react";
            return "vendor-core";
          }
        },
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    tailwindcss({
      config: {
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
        theme: {
          extend: {
            fontFamily: {
              sans: [
                '"SF UI Text"',
                "system-ui",
                "-apple-system",
                "BlinkMacSystemFont",
                "Segoe UI",
                "Roboto",
                "sans-serif",
              ],
              display: ['"SF UI Display"', "sans-serif"],
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
        manualChunks(id) {},
      },
    },
  },
});

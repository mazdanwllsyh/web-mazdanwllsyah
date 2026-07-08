import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from "vite-plugin-pwa";

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
              display: ['"SF UI Display"', '"SF Pro Display"', "sans-serif"],
            },
          },
        },
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
          ],
        },
      },
    }),
    react(),
    visualizer({ open: true }),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "script",
      devOptions: {
        enabled: true,
      },
      manifest: {
        short_name: "Shahclyffe",
        name: "Mazda Nawallsyah",
        icons: [
          {
            src: "https://res.cloudinary.com/dr7olcn4r/image/upload/c_fill,h_480,w_480/v1761388118/croppedsebelumgembuldanmenjadijawir_cdep6a.png",
            type: "image/png",
            sizes: "480x480",
          },
          {
            src: "https://res.cloudinary.com/dr7olcn4r/image/upload/c_fill,h_768,w_768/v1761388118/croppedsebelumgembuldanmenjadijawir_cdep6a.png",
            type: "image/png",
            sizes: "768x768",
            purpose: "any maskable",
          },
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#10b981",
        background_color: "#0f1729",
      },
    }),
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

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss({
      config: {
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
  ],
});

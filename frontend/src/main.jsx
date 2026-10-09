// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import { Toaster } from "sonner";
import { useSiteStore } from "./stores/siteStore.js";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

const ThemeAwareToaster = () => {
  const theme = useSiteStore((state) => state.theme);
  const isLight = [
    "emerald", "light", "corporate", "bumblebee", "cupcake", "caramellatte",
    "nord", "lofi", "pastel", "fantasy",
    "wireframe", "cmyk", "autumn", "acid", "lemonade", "winter"
  ].includes(theme);

  return (
    <Toaster
      theme={isLight ? "light" : "dark"}
      position="bottom-center"
      richColors
      toastOptions={{
        className: "bg-base-100/90 backdrop-blur-xl border border-base-content/20 text-base-content font-medium rounded-2xl shadow-2xl px-6 py-4",
        descriptionClassName: "text-base-content/70",
      }}
    />
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ThemeAwareToaster />
    <SpeedInsights />
    <Analytics />
  </React.StrictMode>
);
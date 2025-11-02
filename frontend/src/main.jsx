import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import { AppProvider } from "./context/AppContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { PortfolioDataProvider } from "./context/PortofolioDataContext.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster, toast } from "react-hot-toast";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

function AppWrapper() {
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <AppProvider>
        <BrowserRouter>
          <UserProvider>
            <PortfolioDataProvider>
              <AppWrapper />
            </PortfolioDataProvider>
          </UserProvider>
        </BrowserRouter>
      </AppProvider>
    </HelmetProvider>
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: "hsl(var(--n))",
          color: "hsl(var(--nc))",
          borderRadius: "var(--rounded-btn, 0.5rem)",
          border: "2px solid hsl(var(--b3))",
        },
        success: {
          style: {
            background: "hsl(var(--su))",
            color: "hsl(var(--suc))",
            border: "1px solid hsl(var(--b3))",
            borderRadius: "var(--rounded-btn, 0.5rem)",
          },
          icon: "✅",
        },
        error: {
          style: {
            background: "hsl(var(--er))",
            color: "hsl(var(--erc))",
            border: "1px solid hsl(var(--b3))",
            borderRadius: "var(--rounded-btn, 0.5rem)",
          },
          icon: "❌",
        },
      }}
    />
  </React.StrictMode>
);

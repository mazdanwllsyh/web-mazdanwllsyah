import React, { useCallback } from "react";
import { useSiteStore } from "../stores/siteStore";
import { useCustomToast } from "../hooks/useCustomToast";
import { toast } from "react-hot-toast";

function ThemeSwitcher() {
  const toggleTheme = useSiteStore((state) => state.toggleTheme);
  const theme = useSiteStore((state) => state.theme);

  const { success } = useCustomToast();

  const darkThemes = ["synthwave", "dark", "black", "business", "night", "dim", "abyss"];
  const isDarkMode = darkThemes.includes(theme);

  const handleToggle = useCallback((e) => {
    toast.dismiss();
    const newTheme = toggleTheme();

    setTimeout(() => {
      success(`Tema ganti ke: ${newTheme}`, {
        position: "top-right",
        id: "theme-toast"
      });
    }, 100);
  }, [toggleTheme, success]);

  return (
    <label className="toggle text-primary">
      <input
        type="checkbox"
        className="theme-controller"
        onChange={handleToggle}
        checked={isDarkMode}
      />

      <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></g></svg>

      <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></g></svg>

    </label>
  );
}

export default ThemeSwitcher;
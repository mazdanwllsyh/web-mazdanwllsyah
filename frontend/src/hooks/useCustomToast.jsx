import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext.jsx";
import { useCallback, useMemo } from "react";

export function useCustomToast() {
  const { themeMode } = useAppContext();

  const getThemeColor = (varName, fallback) => {
    if (typeof window === "undefined") return fallback;

    const hslValue = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();

    if (hslValue) {
      return `hsl(${hslValue})`;
    }

    return fallback;
  };

  const showSuccessToast = useCallback(
    (message, options = {}) => {
      const toastBackgroundColor = getThemeColor(
        "--p", 
        themeMode === "light" ? "darkcyan" : "#261b25" 
      );
      const toastTextColor = getThemeColor(
        "--pc", 
        themeMode === "light" ? "wheat" : "lightblue" 
      );

      const darkBorder = getThemeColor("--b3", "darkslategray");
      const lightBorder = getThemeColor("--b1", "white");
      const toastBorderColor = themeMode === "light" ? darkBorder : lightBorder;

      const finalOptions = {
        position: "top-right",
        duration: 1400,
        ...options,
        style: {
          background: toastBackgroundColor,
          color: toastTextColor,
          border: `2px solid ${toastBorderColor}`,
          borderRadius: "var(--rounded-btn, 0.5rem)",
          ...(options.style || {}),
        },
        icon: "✅",
      };

      toast.success(message, finalOptions);
    },
    [themeMode] 
  );

  const showErrorToast = useCallback(
    (title, detail, options = {}) => {
      const toastBackgroundColor = getThemeColor(
        "--er", 
        themeMode === "light" ? "#b91c1c" : "#dc2626" 
      );
      const toastTextColor = getThemeColor(
        "--erc", 
        "white" 
      );

      const darkBorder = getThemeColor("--b3", "darkslategray");
      const lightBorder = getThemeColor("--b1", "white");
      const toastBorderColor = themeMode === "light" ? darkBorder : lightBorder;

      const message = (
        <div className="text-center">
          <strong className="text-base">{title}</strong>
          {detail && <div className="text-sm opacity-90 mt-3">{detail}</div>}
        </div>
      );

      const finalOptions = {
        position: "bottom-center",
        duration: 3500,
        ...options,
        style: {
          background: toastBackgroundColor,
          color: toastTextColor,
          border: `2px solid ${toastBorderColor}`,
          borderRadius: "var(--rounded-btn, 0.5rem)",
          ...(options.style || {}),
        },
        icon: "❎",
      };

      toast.error(message, finalOptions);
    },
    [themeMode] 
  );

  return useMemo(
    () => ({
      success: showSuccessToast,
      error: showErrorToast,
    }),
    [showSuccessToast, showErrorToast]
  );
}

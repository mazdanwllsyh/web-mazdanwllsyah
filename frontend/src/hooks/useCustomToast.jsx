import { toast } from "react-hot-toast";
import { useCallback, useMemo } from "react";

export function useCustomToast() {
  const defaultStyle = {
    background: "var(--color-base-100, oklch(var(--b1)))",
    color: "var(--color-base-content, oklch(var(--bc)))",
    border: "1px solid var(--color-base-content, oklch(var(--bc) / 0.3))",
    borderRadius: "1rem",
    padding: "16px 24px",
    fontWeight: "500",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    zIndex: 9999999,
  };

  const showSuccessToast = useCallback((message, options = {}) => {
    toast.success(message, {
      style: defaultStyle,
      iconTheme: {
        primary: "var(--color-success, oklch(var(--su)))",
        secondary: "var(--color-success-content, oklch(var(--suc)))",
      },
      duration: 3000,
      ...options,
    });
  }, []);

  const showErrorToast = useCallback((title, detail, options = {}) => {
    const message = detail ? `${title}: ${detail}` : title;
    toast.error(message, {
      style: defaultStyle,
      iconTheme: {
        primary: "var(--color-error, oklch(var(--er)))",
        secondary: "var(--color-error-content, oklch(var(--erc)))",
      },
      duration: 4000,
      ...options,
    });
  }, []);

  const showInfoToast = useCallback((message, options = {}) => {
    toast(message, {
      style: defaultStyle,
      icon: "ℹ️",
      duration: 3000,
      ...options,
    });
  }, []);

  return useMemo(() => ({
    success: showSuccessToast,
    error: showErrorToast,
    info: showInfoToast,
  }), [showSuccessToast, showErrorToast, showInfoToast]);
}
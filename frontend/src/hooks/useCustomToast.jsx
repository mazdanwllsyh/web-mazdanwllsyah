import { toast } from "sonner";
import { useCallback, useMemo } from "react";

export function useCustomToast() {
  const showSuccessToast = useCallback((message, options = {}) => {
    toast.success(message, { duration: 3000, className: "font-display font-large text-primary", ...options });
  }, []);

  const showErrorToast = useCallback((title, detail, options = {}) => {
    const message = detail ? `${title}: ${detail}` : title;
    toast.error(message, { duration: 4000, className: "font-display font-large text-error", ...options });
  }, []);

  const showInfoToast = useCallback((message, options = {}) => {
    toast.info(message, { duration: 3000, className: "font-display font-large text-info", ...options });
  }, []);

  return useMemo(() => ({
    success: showSuccessToast,
    error: showErrorToast,
    info: showInfoToast,
  }), [showSuccessToast, showErrorToast, showInfoToast]);
}
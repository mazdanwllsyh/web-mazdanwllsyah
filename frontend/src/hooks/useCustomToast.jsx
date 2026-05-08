import { toast } from "react-hot-toast";
import { Icon } from "@iconify/react";
import { useCallback, useMemo } from "react";

export function useCustomToast() {
  const showSuccessToast = useCallback((message, options = {}) => {
    toast.custom((t) => (
      <div
        className={`alert shadow-xl max-w-md flex flex-row items-center gap-3 
        bg-success text-success-content border-none rounded-2xl transition-all duration-300 ease-out origin-bottom
        ${t.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}`}
      >
        <Icon icon="solar:check-circle-bold" className="text-3xl" />
        <div>
          <h3 className="font-bold text-lg">Berhasil!</h3>
          <div className="text-sm font-medium opacity-90">{message}</div>
        </div>
      </div>
    ), { duration: 3000, ...options });
  }, []);

  const showErrorToast = useCallback((title, detail, options = {}) => {
    toast.custom((t) => (
      <div
        className={`alert shadow-xl max-w-md flex flex-row items-start gap-3 
        bg-error text-error-content border-none rounded-2xl transition-all duration-300 ease-out origin-bottom
        ${t.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}`}
      >
        <Icon icon="solar:danger-circle-bold" className="text-3xl mt-0.5" />
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          {detail && <div className="text-sm font-medium opacity-90">{detail}</div>}
        </div>
      </div>
    ), { duration: 4000, ...options });
  }, []);

  const showInfoToast = useCallback((message, options = {}) => {
    toast.custom((t) => (
      <div
        className={`alert shadow-xl max-w-md flex flex-row items-center gap-3 
        bg-info text-info-content border-none rounded-2xl transition-all duration-300 ease-out origin-bottom
        ${t.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}`}
      >
        <Icon icon="solar:info-circle-bold" className="text-3xl" />
        <span className="font-semibold">{message}</span>
      </div>
    ), { duration: 3000, ...options });
  }, []);

  return useMemo(() => ({
    success: showSuccessToast,
    error: showErrorToast,
    info: showInfoToast,
  }), [showSuccessToast, showErrorToast, showInfoToast]);
}
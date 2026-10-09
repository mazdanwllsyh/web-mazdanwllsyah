import { toast } from "sonner";
import { Icon } from "@iconify/react";

const useCustomSwals = () => {
  const showConfirmSwal = (title, text) => {
    return new Promise((resolve) => {
      const toastId = toast(
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-start gap-3">
            <Icon icon="lucide:alert-triangle" className="text-warning w-6 h-6 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <h2 className="font-display font-bold text-base-content text-base leading-tight text-center">{title}</h2>
              <p className="text-md text-base-content/70">{text}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <button
              className="btn btn-sm btn-outline border-base-content/30 text-base-content/80 hover:bg-base-content/10 hover:text-base-content hover:border-base-content/50 rounded-xl px-4 font-bold"
              onClick={() => {
                toast.dismiss(toastId);
                resolve(false);
              }}
            >
              Batal
            </button>
            <button
              className="btn btn-sm btn-error text-white rounded-xl px-5 shadow-md font-bold"
              onClick={() => {
                toast.dismiss(toastId);
                resolve(true);
              }}
            >
              Ya, Lanjutkan!
            </button>
          </div>
        </div>,
        {
          duration: Infinity,
          position: "top-center",
          style: { minWidth: '320px' }
        }
      );
    });
  };

  const showSuccessSwal = (title, text) => {
    toast.success(title, { description: text, duration: 4000 });
  };

  const showErrorSwal = (title, text) => {
    toast.error(title, { description: text, duration: 5000 });
  };

  return { showConfirmSwal, showSuccessSwal, showErrorSwal };
};

export default useCustomSwals;
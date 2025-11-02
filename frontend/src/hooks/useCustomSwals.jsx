import Swal from "sweetalert2";
import { useAppContext } from "../context/AppContext.jsx";

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

const useCustomSwals = () => {
  const { themeMode } = useAppContext(); 

  const swalBg = getThemeColor(
    "--b1", 
    themeMode === "light" ? "#FDFDFDFF" : "#1f2937" 
  );
  const swalColor = getThemeColor(
    "--bc", 
    themeMode === "light" ? "#1f2937" : "#ffffff" 
  );

  const borderCustomClass = { popup: "swal2-popup-bordered" };
  const baseSwalConfig = {
    buttonsStyling: false,
    customClass: { ...borderCustomClass },
    background: swalBg,
    color: swalColor,
  };

  const buildSwalConfig = (specificConfig = {}, buttonClasses = {}) => {
    const config = {
      ...baseSwalConfig,
      ...specificConfig,
      customClass: {
        ...baseSwalConfig.customClass,
        ...buttonClasses,
      },
    };

    return config;
  };

  const showConfirmSwal = async (title, text) => {
    const config = buildSwalConfig(
      {
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Iya, Lanjutkan!",
        cancelButtonText: "Batal",
      },
      {
        confirmButton: "btn btn-error",
        cancelButton: "btn btn-info ml-2",
      }
    );
    const result = await Swal.fire(config);
    return result.isConfirmed;
  };

  const showSuccessSwal = (title, text) => {
    const config = buildSwalConfig(
      {
        title: title,
        text: text,
        icon: "success",
      },
      {
        confirmButton: "btn btn-success",
      }
    );
    return Swal.fire(config);
  };

  const showErrorSwal = (title, text) => {
    const config = buildSwalConfig(
      {
        title: title,
        text: text,
        icon: "error",
      },
      {
        confirmButton: "btn btn-error",
      }
    );
    return Swal.fire(config);
  };

  const showInfoSwal = (title, text) => {
    const config = buildSwalConfig(
      {
        title: title,
        text: text,
        icon: "info",
      },
      {
        confirmButton: "btn btn-info",
      }
    );
    return Swal.fire(config);
  };

  const showQuestionSwal = async (title, text) => {
    const config = buildSwalConfig(
      {
        title: title,
        text: text,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Iya",
        cancelButtonText: "Tidak",
      },
      {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-error ml-2",
      }
    );
    const result = await Swal.fire(config);
    return result.isConfirmed;
  };

  return {
    showConfirmSwal,
    showSuccessSwal,
    showErrorSwal,
    showInfoSwal,
    showQuestionSwal,
  };
};

export default useCustomSwals;

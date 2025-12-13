import Swal from "sweetalert2";

const swalCustomStyle = `
  div:where(.swal2-container) div:where(.swal2-popup) {
    background-color: hsl(var(--b1)) !important; 
    color: hsl(var(--bc)) !important;
    border: 2px solid hsl(var(--p)); /* Border warna Primary */
    border-radius: 1rem;
  }
  
  div:where(.swal2-container) .swal2-title {
    color: hsl(var(--bc)) !important;
    font-family: 'SF UI Display', sans-serif;
  }

  div:where(.swal2-container) .swal2-html-container {
    color: hsl(var(--bc) / 0.8) !important;
  }

  /* .swal2-icon.swal2-success { border-color: hsl(var(--su)); color: hsl(var(--su)); } */
  /* .swal2-icon.swal2-error { border-color: hsl(var(--er)); color: hsl(var(--er)); } */
`;

if (typeof document !== 'undefined' && !document.getElementById('swal-theme-style')) {
  const style = document.createElement('style');
  style.id = 'swal-theme-style';
  style.innerHTML = swalCustomStyle;
  document.head.appendChild(style);
}

const useCustomSwals = () => {

  const baseSwalConfig = {
    buttonsStyling: false,
    customClass: {
      popup: "swal2-popup-custom shadow-2xl",
      confirmButton: "btn btn-primary min-w-[100px]",
      cancelButton: "btn btn-ghost min-w-[80px] ml-2",
      denyButton: "btn btn-error ml-2",
    },
    backdrop: `rgba(0,0,0,0.6)`,
  };

  const buildSwalConfig = (specificConfig = {}, buttonClasses = {}) => {
    return {
      ...baseSwalConfig,
      ...specificConfig,
      customClass: {
        ...baseSwalConfig.customClass,
        ...buttonClasses,
      },
    };
  };

  const showConfirmSwal = async (title, text) => {
    const config = buildSwalConfig(
      {
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Lanjutkan!",
        cancelButtonText: "Batal",
        reverseButtons: true,
      },
      {
        confirmButton: "btn btn-error text-white", 
      }
    );
    const result = await Swal.fire(config);
    return result.isConfirmed;
  };

  const showSuccessSwal = (title, text) => {
    const config = buildSwalConfig(
      { title, text, icon: "success" },
      { confirmButton: "btn btn-success text-white" } 
    );
    return Swal.fire(config);
  };

  const showErrorSwal = (title, text) => {
    const config = buildSwalConfig(
      { title, text, icon: "error" },
      { confirmButton: "btn btn-error text-white" } 
    );
    return Swal.fire(config);
  };

  const showInfoSwal = (title, text) => {
    const config = buildSwalConfig(
      { title, text, icon: "info" },
      { confirmButton: "btn btn-info text-white" } 
    );
    return Swal.fire(config);
  };

  return { showConfirmSwal, showSuccessSwal, showErrorSwal, showInfoSwal };
};

export default useCustomSwals;
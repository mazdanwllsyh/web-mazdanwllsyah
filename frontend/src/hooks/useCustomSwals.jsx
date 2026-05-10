import Swal from "sweetalert2";

const swalCustomStyle = `
  div:where(.swal2-container) div:where(.swal2-popup) {
    background-color: hsl(var(--b1)) !important; 
    color: hsl(var(--bc)) !important;
    border: 2px solid hsl(var(--p));
    border-radius: 1.5rem;
  }
  
  div:where(.swal2-container) .swal2-title {
    color: hsl(var(--bc)) !important;
    font-family: 'SF UI Display', sans-serif;
  }

  div:where(.swal2-container) .swal2-html-container {
    color: hsl(var(--bc) / 0.8) !important;
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('swal-theme-style')) {
  const style = document.createElement('style');
  style.id = 'swal-theme-style';
  style.innerHTML = swalCustomStyle;
  document.head.appendChild(style);
}

const useCustomSwals = () => {
  const baseSwalConfig = {
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-ghost",
    },
    buttonsStyling: false,
  };

  const buildSwalConfig = (specificConfig = {}, buttonClasses = {}) => {
    return {
      ...baseSwalConfig,
      ...specificConfig,
      customClass: {
        ...baseSwalConfig.customClass,
        ...buttonClasses,
        actions: 'flex gap-3 mt-3',
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
        confirmButtonText: '<div class="flex items-center gap-2"><span class="iconify w-5 h-5" data-icon="mdi:check-circle"></span> Ya, Lanjutkan!</div>',
        cancelButtonText: '<div class="flex items-center gap-2"><span class="iconify w-5 h-5" data-icon="mdi:close-circle"></span> Batal</div>',
        reverseButtons: true,
      },
      {
        confirmButton: "btn btn-error text-white px-6 rounded-xl",
        cancelButton: "btn btn-neutral px-6 rounded-xl",
      }
    );
    const result = await Swal.fire(config);
    return result.isConfirmed;
  };

  const showSuccessSwal = (title, text) => {
    const config = buildSwalConfig(
      {
        title,
        text,
        icon: "success",
        confirmButtonText: '<div class="flex items-center gap-2"><span class="iconify w-5 h-5" data-icon="mdi:hand-okay"></span> Mantap!</div>',
      },
      { confirmButton: "btn btn-success text-white px-10 rounded-xl shadow-md" }
    );
    return Swal.fire(config);
  };

  const showErrorSwal = (title, text) => {
    const config = buildSwalConfig(
      {
        title,
        text,
        icon: "error",
        confirmButtonText: '<div class="flex items-center gap-2"><span class="iconify w-5 h-5" data-icon="mdi:alert-circle"></span> Mengerti</div>',
      },
      { confirmButton: "btn btn-error text-white px-10 rounded-xl shadow-md" }
    );
    return Swal.fire(config);
  };

  return { showConfirmSwal, showSuccessSwal, showErrorSwal };
};

export default useCustomSwals;
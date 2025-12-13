import { useModalStore } from "../stores/modalStore";

const useGlobalModal = () => {
    const openModal = useModalStore((state) => state.openModal);

    const showConfirm = async (title, message) => {
        return await openModal({
            type: "confirm",
            title,
            message,
            confirmText: "Ya, Lanjutkan!",
            cancelText: "Batal",
        });
    };

    const showSuccess = async (title, message) => {
        return await openModal({
            type: "success",
            title,
            message,
            confirmText: "Mantap!",
        });
    };

    const showError = async (title, message) => {
        return await openModal({
            type: "error",
            title,
            message,
            confirmText: "Tutup",
        });
    };

    return { showConfirm, showSuccess, showError };
};

export default useGlobalModal;
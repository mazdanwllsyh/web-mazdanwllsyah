import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore"; // Import Store
import useGlobalModal from "./useGlobalModal";
import { useCustomToast } from "./useCustomToast"; // Import Toast
import instance from "../utils/axios";

export const useAuth = () => {
    const navigate = useNavigate();
    const { showConfirm, showError } = useGlobalModal();
    const { success: customToast } = useCustomToast();

    const user = useUserStore((state) => state.user);
    const isUserLoading = useUserStore((state) => state.isUserLoading);
    const loginAction = useUserStore((state) => state.login);
    const logoutAction = useUserStore((state) => state.logout);
    const updateUserAction = useUserStore((state) => state.updateUser);
    const checkUserSession = useUserStore((state) => state.checkUserSession);

    const handleSignOut = async () => {
        const isConfirmed = await showConfirm(
            "Yakin ingin logout?",
            "Sesi Anda akan berakhir dan harus login ulang."
        );

        if (isConfirmed) {
            try {
                await instance.get("/users/logout");
                logoutAction();
                customToast("Anda telah logout.");
                navigate("/");
            } catch (err) {
                console.error("Gagal logout:", err);
                showErrorSwal(
                    "Logout Gagal",
                    err.response?.data?.message || "Gagal menghubungi server."
                );
                logoutAction();
                navigate("/");
            }
        }
    };

    return {
        user,
        isUserLoading,
        login: loginAction,
        logout: logoutAction,
        updateUser: updateUserAction,
        checkUserSession,
        handleSignOut,
    };
};
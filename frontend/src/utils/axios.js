import axios from "axios";
import { useUserStore } from "../stores/userStore";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL + "/api",
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const state = useUserStore.getState();
    const token = state.user?.token; 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      useUserStore.getState().logout();

      sessionStorage.clear();
      localStorage.removeItem("sessionExpiresAt");
    }

    return Promise.reject(error);
  }
);

export default instance;

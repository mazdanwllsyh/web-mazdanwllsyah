import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import SeoHelmet from "../SEOHelmet";
import { useUser } from "../../context/UserContext";
import { useAppContext } from "../../context/AppContext";
import useCustomSwals from "../../hooks/useCustomSwals";
import instance from "../../utils/axios";

const FloatingLabelInput = ({
  id,
  label,
  value,
  onChange,
  name,
  type = "text",
}) => (
  <div className="relative form-control">
    <input
      type={type}
      id={id}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder=" "
      className="input input-bordered w-full pt-4 peer text-base"
    />
    <label
      htmlFor={id}
      className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out 
                 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm 
                 peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary 
                 pointer-events-none z-10"
    >
      {label}
    </label>
  </div>
);

function LoginPage() {
  const { siteData } = useAppContext();
  const { login } = useUser();
  const { showErrorSwal, showSuccessSwal } = useCustomSwals();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const cleanupGoogleOneTap = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.cancel();
      const fedCmEl = document.querySelector('[id^="credential_picker_container"]');
      if (fedCmEl) fedCmEl.remove();
    }
  };

  useEffect(() => {
    return () => cleanupGoogleOneTap();
  }, [location.pathname]);

  const handleLoginSuccess = (user) => {
    cleanupGoogleOneTap();
    login(user);
    const isAdmin = user.role === "admin" || user.role === "superAdmin";
    const destination = isAdmin ? "/dashboard" : "/profil";
    navigate(destination);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await instance.post("/users/login", {
        email,
        password,
      });

      const user = response.data.user;
      login(user);
      await showSuccessSwal(
        `Selamat Datang, ${user.fullName}!`,
        "Login berhasil."
      );
      handleLoginSuccess(user);
    } catch (err) {
      console.error("Gagal login:", err);
      showErrorSwal(
        "Login Gagal",
        err.response?.data?.message || "Terjadi kesalahan"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await instance.post("/users/google", {
        credential: credentialResponse.credential,
      });
      const user = response.data.user;
      cleanupGoogleOneTap();
      await showSuccessSwal(`Selamat Datang, ${user.fullName}!`, "Login dengan Google berhasil.");
      handleLoginSuccess(user);
    } catch (err) {
      console.error("Gagal login Google:", err);
      showErrorSwal("Login Gagal", err.response?.data?.message || "Kredensial Google tidak valid");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin,
          auto_select: true,
          cancel_on_tap_outside: false,
          itp_support: true,
        });

        if (location.pathname === "/signin") {
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed()) {
              console.warn("FedCM hidden:", notification.getNotDisplayedReason());
            }
          });
        }

        const buttonDiv = document.getElementById("hiddenGoogleBtn");
        if (buttonDiv) {
          window.google.accounts.id.renderButton(
            buttonDiv,
            { theme: "outline", size: "large", width: "100%" }
          );
        }
      } else {
        setTimeout(initializeGoogle, 500);
      }
    };

    initializeGoogle();
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-base-100 px-4 py-8">
      <SeoHelmet
        title="Masuk ke Porto Mazda?"
        description={
          siteData.aboutParagraph
            ? siteData.aboutParagraph.substring(0, 160)
            : "Login Sistem."
        }
        url="/signin"
      />

      <div className="w-full max-w-sm flex flex-col">
        <div className="text-sm breadcrumbs mb-2 px-1">
          <ul>
            <li>
              <Link to="/">Beranda</Link>
            </li>
            <li>Login</li>
          </ul>
        </div>

        <div className="card w-full shadow-2xl bg-base-200 border border-base-300">
          <form className="card-body" onSubmit={handleSubmit}>
            <h2 className="card-title text-2xl font-bold font-display justify-center mb-2">
              Login
            </h2>

            <div className="divider my-0"></div>

            <div className="relative form-control mt-2">
              <FloatingLabelInput
                id="emailLogin"
                label="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
              />
            </div>

            <div className="relative form-control mt-4">
              <FloatingLabelInput
                id="passwordLogin"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-primary z-10"
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
              >
                <Icon
                  icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                  className="w-5 h-5"
                />
              </button>
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary font-semibold w-full text-base shadow-lg hover:shadow-primary/40 transition-shadow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-bars loading-sm"></span>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <div className="divider text-xs text-base-content/60 my-3">
              ATAU
            </div>

            <div className="relative w-full h-12 group">
              {!isLoading && (
                <div
                  id="hiddenGoogleBtn"
                  className="absolute inset-0 w-full h-full z-20 opacity-0 overflow-hidden cursor-pointer"
                  style={{ transform: "scale(1.05)" }}
                ></div>
              )}

              <button
                type="button"
                disabled={isLoading}
                className="btn w-full bg-neutral hover:bg-neutral-focus text-neutral-content border-primary border-2 relative z-10 flex items-center justify-center gap-3 normal-case text-base font-medium shadow-sm transition-all group-hover:shadow-md disabled:bg-neutral disabled:text-neutral-content disabled:border-primary"
              >
                {isLoading ? (
                  <span className="loading loading-bars loading-sm"></span>
                ) : (
                  <>
                    <Icon icon="logos:google-icon" className="w-6 h-6" />
                    <span>Lanjutkan dengan Google</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-sm mt-4">
              Belum punya akun?
              <Link
                to="/signup"
                className="link link-primary mx-2 font-semibold no-underline hover:underline"
              >
                Daftar di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
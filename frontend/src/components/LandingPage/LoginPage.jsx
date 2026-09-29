import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../../hooks/useAuth";
import { useSiteStore } from "../../stores/siteStore";
import useCustomSwals from "../../hooks/useCustomSwals";
import instance from "../../utils/axios";
import FloatingLabelInput from "../FloatingLabelInput";

function LoginPage() {
  const siteData = useSiteStore((state) => state.siteData);
  const { login } = useAuth();
  const { showErrorSwal, showSuccessSwal } = useCustomSwals();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
    const from = location.state?.from;
    if (from) {
      navigate(from);
    } else {
      const isAdmin = user.role === "admin" || user.role === "superAdmin";
      navigate(isAdmin ? "/dashboard" : "/profil");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await instance.post("/users/login", { email, password });
      const user = response.data.user;
      login(user);
      await showSuccessSwal(`Selamat Datang, ${user.fullName}!`, "Login berhasil.");
      handleLoginSuccess(user);
    } catch (err) {
      console.error("Gagal login:", err);
      showErrorSwal("Login Gagal", err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await instance.post("/users/google", { credential: credentialResponse.credential });
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
    let isMounted = true;
    let timeoutId;
    const initializeGoogle = () => {
      if (!isMounted) return;
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
            if (notification.isNotDisplayed()) console.warn("FedCM hidden:", notification.getNotDisplayedReason());
          });
        }
        const buttonDiv = document.getElementById("hiddenGoogleBtn");
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            theme: "outline",
            size: "large",
            width: 400,
            text: "signin_with"
          });
        }
      } else {
        timeoutId = setTimeout(initializeGoogle, 500);
      }
    };
    initializeGoogle();
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      cleanupGoogleOneTap();
    };
  }, [location.pathname]);

  return (
    <div className="w-full flex justify-center py-10 z-10 relative">
      <title>Login Sistem | Mazda Nawallsyah</title>
      <meta name="description" content={siteData.aboutParagraph ? siteData.aboutParagraph.substring(0, 160) : "Login ke akun Anda untuk melanjutkan."} />
      <link rel="canonical" href={`https://mazdaweb.bejalen.com/signin`} />

      <div className="card lg:card-side bg-base-100/60 backdrop-blur-xl shadow-2xl border border-base-content/10 w-full max-w-6xl overflow-hidden rounded-[2.5rem]">

        <div className="hidden lg:flex lg:w-1/2 order-1 bg-base-200/50 p-12 flex-col items-center justify-center text-center relative border-r border-base-content/10">
          <div className="w-40 h-40 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20 shadow-[0_0_40px_rgba(var(--p),0.2)]">
            <Icon icon="solar:shield-keyhole-minimalistic-bold-duotone" className="w-20 h-20 text-primary" />
          </div>
          <h2 className="text-3xl font-black font-display tracking-tight mb-4 text-base-content">Akses Portofolio</h2>
          <p className="text-sm font-medium opacity-70 leading-relaxed max-w-sm text-base-content">
            Sistem manajemen autentikasi terpusat. Login untuk mengelola data dan konfigurasi personal Anda.
          </p>
        </div>

        <div className="w-full lg:w-1/2 p-8 md:p-12 order-2 flex flex-col justify-center bg-base-100/40">
          <div className="text-sm breadcrumbs font-medium text-base-content/60 mb-2">
            <ul>
              <li><Link to="/" className="hover:text-primary transition-colors">Beranda</Link></li>
              <li className="text-base-content">Login</li>
            </ul>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight text-base-content mb-2">Login Sistem</h1>
          <p className="text-base-content/60 text-sm font-medium mb-8">Silakan masukkan detail akun Anda.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FloatingLabelInput id="emailLogin" label="Email Anda" type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" required />
            <div className="relative">
              <FloatingLabelInput id="passwordLogin" label="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} name="password" required rightElement={
                <button type="button" onClick={togglePasswordVisibility} className="text-base-content/40 hover:text-primary transition-colors p-2 outline-none">
                  <Icon icon={showPassword ? "solar:eye-closed-bold" : "solar:eye-bold"} className="w-5 h-5" />
                </button>
              } />
              <div className="flex justify-end mt-2"><a href="#" className="text-xs font-semibold text-primary hover:underline">Lupa password?</a></div>
            </div>

            <button type="submit" className="btn btn-primary w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all text-base" disabled={isLoading}>
              {isLoading ? <span className="loading loading-dots loading-md"></span> : "Sign In"}
            </button>

            <div className="divider text-xs text-base-content/40 font-bold tracking-widest my-6">ATAU</div>

            <div className="relative group w-full h-12 flex items-center justify-center rounded-xl aura aura-rainbow duration-3000">

              <button
                type="button"
                className="btn w-full h-full rounded-xl bg-base-100 hover:bg-base-200 border-base-content/20 text-base-content absolute inset-0 z-10 flex items-center justify-center gap-3 normal-case shadow-sm pointer-events-none"
              >
                {isLoading ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  <>
                    <Icon icon="logos:google-icon" className="w-5 h-5" />
                    <span className="font-semibold text-sm">Login dengan Google</span>
                  </>
                )}
              </button>

              {!isLoading && (
                <div
                  id="hiddenGoogleBtn"
                  className="absolute inset-0 z-20 flex items-center justify-center opacity-[0.001] cursor-pointer overflow-hidden rounded-xl [&>div]:w-full [&>div]:h-full"
                ></div>
              )}
            </div>
          </form>
          <p className="text-center text-sm mt-8 font-medium text-base-content/70">
            Belum punya akun? <Link to="/signup" className="text-primary font-bold hover:underline ml-1">Daftar sekarang</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import SeoHelmet from "../SEOHelmet";
import { useUser } from "../../context/UserContext"; //
import { useAppContext } from "../../context/AppContext";
import useCustomSwals from "../../hooks/useCustomSwals";
import instance from "../../utils/axios"; //

// --- PERBAIKAN 1: FloatingLabelInput DIKEMBALIKAN ---
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
// --- BATAS PERBAIKAN 1 ---

function LoginPage() {
  const { siteData } = useAppContext();
  const { login } = useUser(); //
  const { showErrorSwal, showSuccessSwal } = useCustomSwals();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginSuccess = (user) => {
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
      login(user); //
      await showSuccessSwal(
        `Selamat Datang, ${user.fullName}!`,
        "Login dengan Google berhasil."
      );
      handleLoginSuccess(user);
    } catch (err) {
      console.error("Gagal login Google:", err);
      showErrorSwal(
        "Login Gagal",
        err.response?.data?.message || "Kredensial Google tidak valid"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
        auto_select: true, // Mencoba login otomatis jika user sudah pernah login
      });

      // Tampilkan pop-up FedCM
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // (Opsional) Log jika pop-up gagal muncul
          console.log("FedCM prompt tidak ditampilkan.");
        }
      });
    }
  }, []); // <-- Dependensi kosong, hanya berjalan sekali

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
      <div className="text-sm breadcrumbs mb-4 self-start max-w-5xl mx-auto w-full">
        <ul>
          <li>
            <Link to="/">Beranda</Link>
          </li>
          <li>Login</li>
        </ul>
      </div>
      <div className="card w-full max-w-sm shadow-2xl bg-base-200">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="card-title text-2xl font-bold font-display justify-center">
            Login
          </h2>

          <div className="divider my-2"></div>

          {/* --- PERBAIKAN 3: Tombol Google & Divider "ATAU" DIHAPUS --- */}
          {/* <div id="googleSignInButton" ...></div> */}
          {/* <div className="divider">ATAU</div> */}

          {/* Input Email (Sekarang di atas) */}
          <div className="relative form-control mt-3">
            <FloatingLabelInput // <-- Menggunakan komponen yang dikembalikan
              id="emailLogin"
              label="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // <-- Bug 'setemail' diperbaiki
              name="email"
            />
          </div>

          {/* Input Password */}
          <div className="relative form-control mt-3">
            <FloatingLabelInput // <-- Menggunakan komponen yang dikembalikan
              id="passwordLogin"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />
            {/* Tombol Show/Hide */}
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
              className="btn btn-primary font-semibold w-full text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>
          <p className="text-center text-sm mt-3">
            Belum punya akun?{" "}
            <Link to="/signup" className="link link-primary font-semibold">
              Daftar di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

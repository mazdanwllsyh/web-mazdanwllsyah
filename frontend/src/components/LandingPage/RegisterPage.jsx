import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import SEO from "../../components/SEO";
import { useSiteStore } from "../../stores/siteStore";
import useCustomSwals from "../../hooks/useCustomSwals";
import instance from "../../utils/axios";
import FloatingLabelInput from "../FloatingLabelInput";

function RegisterPage() {
  const siteData = useSiteStore((state) => state.siteData);
  const { showErrorSwal, showSuccessSwal } = useCustomSwals();
  const [showPasswords, setShowPasswords] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPasswords(!showPasswords);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showErrorSwal("Konfirmasi password tidak cocok!");
      return;
    }
    setIsLoading(true);
    try {
      const response = await instance.post("/users/register-request", {
        fullName,
        email,
        phone,
        password,
        confirmPassword,
      });
      await showSuccessSwal("Registrasi Berhasil!", response.data.message);
      navigate("/verifikasi", { state: { email } });
    } catch (err) {
      console.error("Gagal register:", err);
      showErrorSwal("Registrasi Gagal", err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-10 z-10 relative">
      <SEO
        title="Registrasi Akun"
        description={
          siteData.aboutParagraph
            ? siteData.aboutParagraph.substring(0, 160)
            : "Buat akun baru untuk mendapatkan akses penuh."
        }
        url="/signup"
      />
      <div className="card lg:card-side bg-base-100/60 backdrop-blur-xl shadow-2xl border border-base-content/10 w-full max-w-6xl overflow-hidden rounded-[2.5rem]">

        <div className="w-full lg:w-1/2 p-8 md:p-12 order-1 flex flex-col justify-center bg-base-100/40">
          <div className="text-sm breadcrumbs font-medium text-base-content/60 mb-2">
            <ul>
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li className="text-base-content">Register</li>
            </ul>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight text-base-content mb-2">
            Buat Akun
          </h1>
          <p className="text-base-content/60 text-sm font-medium mb-6">
            Lengkapi form di bawah ini untuk memulai.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FloatingLabelInput
              id="nama"
              label="Nama Lengkap"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <FloatingLabelInput
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FloatingLabelInput
              id="whatsapp"
              label="Nomor WhatsApp"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatingLabelInput
                id="passwordReg"
                label="Password"
                type={showPasswords ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FloatingLabelInput
                id="confirmPassword"
                label="Konfirmasi Password"
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-base-content/40 hover:text-primary transition-colors p-2 outline-none"
                  >
                    <Icon
                      icon={showPasswords ? "solar:eye-closed-bold" : "solar:eye-bold"}
                      className="w-5 h-5"
                    />
                  </button>
                }
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full h-12 mt-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all text-base"
              disabled={isLoading}
            >
              {isLoading ? <span className="loading loading-dots loading-md"></span> : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm mt-8 font-medium text-base-content/70">
            Sudah punya akun?{" "}
            <Link to="/signin" className="text-primary font-bold hover:underline ml-1">
              Sign in di sini
            </Link>
          </p>
        </div>

        <div className="hidden lg:flex lg:w-1/2 order-2 bg-base-200/50 p-12 flex-col items-center justify-center text-center relative border-l border-base-content/10">
          <div className="w-40 h-40 bg-secondary/10 rounded-full flex items-center justify-center mb-8 border border-secondary/20 shadow-[0_0_40px_rgba(var(--s),0.2)]">
            <Icon icon="solar:user-id-bold-duotone" className="w-20 h-20 text-secondary" />
          </div>
          <h2 className="text-3xl font-black font-display tracking-tight mb-4 text-base-content">
            Bergabunglah Sekarang
          </h2>
          <p className="text-sm font-medium opacity-70 leading-relaxed max-w-sm text-base-content">
            Dapatkan akses penuh ke sistem. Registrasi cepat, dan aman yang telah dioptimalkan.
          </p>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;
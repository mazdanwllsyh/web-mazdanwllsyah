import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import SeoHelmet from "../SEOHelmet";
import { useAppContext } from "../../context/AppContext";
import useCustomSwals from "../../hooks/useCustomSwals";
import instance from "../../utils/axios";

function RegisterPage() {
  const { siteData } = useAppContext();
  const { showErrorSwal, showSuccessSwal } = useCustomSwals();
  const [showPasswords, setShowPasswords] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPasswords(!showPasswords);
  };

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
      showErrorSwal(
        "Registrasi Gagal",
        err.response?.data?.message || "Terjadi kesalahan"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-base-100 px-4 py-8">
      <SeoHelmet
        title="Buat Akun? Serius?"
        description={
          siteData.aboutParagraph
            ? siteData.aboutParagraph.substring(0, 160)
            : "Register your Account now!"
        }
        url="/signup"
      />
      <div className="text-sm breadcrumbs mb-4 self-start max-w-5xl mx-auto w-full">
        <ul>
          <li>
            <Link to="/">Beranda</Link>
          </li>
          <li>Register</li>
        </ul>
      </div>
      <div className="card w-full max-w-md shadow-2xl bg-base-200">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="card-title text-2xl font-bold font-display justify-center">
            Register Akun Baru
          </h2>
          <div className="divider my-2"></div>

          {/* Nama */}
          <div className="relative form-control mt-2">
            <input
              type="text"
              id="nama"
              placeholder=" "
              className="input input-bordered w-full pt-4 peer"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <label
              htmlFor="nama"
              className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out 
                         peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm 
                         peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary 
                         pointer-events-none z-10"
            >
              Nama Lengkap
            </label>
          </div>

          {/* Email */}
          <div className="relative form-control mt-2">
            <input
              type="email"
              id="email"
              placeholder=" "
              className="input input-bordered w-full pt-4 peer"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="email"
              // Ubah posisi placeholder-shown
              className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out 
                         peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm 
                         peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary 
                         pointer-events-none z-10"
            >
              Email
            </label>
          </div>

          {/* Nomor WhatsApp */}
          <div className="relative form-control mt-2">
            <input
              type="tel"
              id="whatsapp"
              placeholder=" "
              className="input input-bordered w-full pt-4 peer"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label
              htmlFor="whatsapp"
              // Ubah posisi placeholder-shown
              className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out 
                         peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm 
                         peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary 
                         pointer-events-none z-10"
            >
              Nomor WhatsApp
            </label>
          </div>

          {/* Password */}
          <div className="relative form-control mt-2">
            <input
              type={showPasswords ? "text" : "password"}
              id="passwordReg"
              placeholder=" "
              className="input input-bordered w-full pr-10 pt-4 peer"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor="passwordReg"
              // Ubah posisi placeholder-shown
              className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out 
                         peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm 
                         peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary 
                         pointer-events-none z-10"
            >
              Password
            </label>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-primary z-10"
              aria-label={
                showPasswords ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              <Icon
                icon={showPasswords ? "mdi:eye-off" : "mdi:eye"}
                className="w-5 h-5"
              />
            </button>
          </div>

          {/* Konfirmasi Password */}
          <div className="relative form-control mt-2">
            <input
              type={showPasswords ? "text" : "password"}
              id="confirmPassword"
              placeholder=" "
              className="input input-bordered w-full pr-10 pt-4 peer"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out 
                         peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm 
                         peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary 
                         pointer-events-none z-10"
            >
              Konfirmasi Password
            </label>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-primary z-10"
              aria-label={
                showPasswords ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              <Icon
                icon={showPasswords ? "mdi:eye-off" : "mdi:eye"}
                className="w-5 h-5"
              />
            </button>
          </div>

          <div className="form-control mt-6">
            {" "}
            <button
              type="submit"
              className="btn btn-primary w-full font-bold text-base"
            >
              Register
            </button>
          </div>
          <p className="text-center text-sm mt-3">
            Sudah punya akun?{" "}
            <Link to="/signin" className="link link-primary font-semibold">
              Login di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import SeoHelmet from "../SEOHelmet";
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
      <div className="w-full max-w-sm flex flex-col">
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

            <div className="mt-2">
              <FloatingLabelInput
                id="nama"
                label="Nama Lengkap"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="mt-2">
              <FloatingLabelInput
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mt-2">
              <FloatingLabelInput
                id="whatsapp"
                label="Nomor WhatsApp"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="mt-2">
              <FloatingLabelInput
                id="passwordReg"
                label="Password"
                type={showPasswords ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-base-content/50 hover:text-primary transition-colors cursor-pointer"
                    aria-label={showPasswords ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    <Icon icon={showPasswords ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5" />
                  </button>
                }
              />
            </div>

            <div className="mt-2">
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
                    className="text-base-content/50 hover:text-primary transition-colors cursor-pointer"
                    aria-label={showPasswords ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    <Icon icon={showPasswords ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5" />
                  </button>
                }
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full font-bold text-base"
                disabled={isLoading}
              >
                {isLoading ? <span className="loading loading-spinner"></span> : "Register"}
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
    </div>
  );
}

export default RegisterPage;
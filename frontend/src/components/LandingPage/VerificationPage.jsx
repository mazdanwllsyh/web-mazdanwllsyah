import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import SEO from "../../components/SEO";
import { useAuth } from "../../hooks/useAuth";
import { useSiteStore } from "../../stores/siteStore";
import useCustomSwals from "../../hooks/useCustomSwals";
import instance from "../../utils/axios";
import FloatingLabelInput from "../FloatingLabelInput";

const COOLDOWN_TIERS = [60, 90, 120, 180, 210];

function VerificationPage() {
  const siteData = useSiteStore((state) => state.siteData);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showErrorSwal, showSuccessSwal } = useCustomSwals();

  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!location.state?.email) {
      showErrorSwal("Akses Ditolak", "Silakan mulai dari halaman registrasi atau login.").then(() => navigate("/signup"));
    }
  }, [location.state, navigate, showErrorSwal]);

  useEffect(() => {
    const storedEndTime = parseInt(localStorage.getItem(`otp_cd_${email}`), 10);
    if (storedEndTime) {
      const now = Date.now();
      if (storedEndTime > now) {
        setCountdown(Math.ceil((storedEndTime - now) / 1000));
      } else {
        localStorage.removeItem(`otp_cd_${email}`);
      }
    }
  }, [email]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            localStorage.removeItem(`otp_cd_${email}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, email]);

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return showErrorSwal("Error", "Kode OTP harus 6 digit.");
    setIsVerifying(true);
    try {
      const response = await instance.post("/users/register-verify", { email, verificationCode: code });
      const user = response.data.user;
      login(user);
      await showSuccessSwal("Verifikasi Berhasil!", "Akun Anda telah aktif.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Gagal verifikasi:", err);
      showErrorSwal("Verifikasi Gagal", err.response?.data?.message || "Kode OTP tidak valid.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      const response = await instance.post("/users/resend-verification", { email });
      showSuccessSwal("Terkirim", response.data.message);

      const currentAttempt = parseInt(localStorage.getItem(`otp_attempts_${email}`) || "0", 10);
      const nextDuration = COOLDOWN_TIERS[Math.min(currentAttempt, COOLDOWN_TIERS.length - 1)];

      const endTime = Date.now() + nextDuration * 1000;
      localStorage.setItem(`otp_cd_${email}`, endTime.toString());
      localStorage.setItem(`otp_attempts_${email}`, (currentAttempt + 1).toString());

      setCountdown(nextDuration);
    } catch (err) {
      console.error("Gagal kirim ulang:", err);
      showErrorSwal("Gagal", err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-12 z-10 relative">
      <SEO
        title="Verifikasi Akun"
        description="Masukkan kode OTP 6 digit yang dikirim ke email Anda."
        url="/verifikasi"
      />
      <div className="w-full max-w-lg z-10">
        <div className="text-sm breadcrumbs mb-6 font-medium text-base-content/60 justify-center flex">
          <ul>
            <li><Link to="/" className="hover:text-primary">Beranda</Link></li>
            <li className="text-base-content">Verifikasi OTP</li>
          </ul>
        </div>

        <div className="card w-full shadow-2xl bg-base-100/60 backdrop-blur-xl border border-base-content/10 rounded-[2.5rem]">
          <form className="card-body p-8 lg:p-10" onSubmit={handleVerifySubmit}>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary shadow-[0_0_30px_rgba(var(--p),0.15)]">
              <Icon icon="solar:shield-check-bold-duotone" className="w-8 h-8" />
            </div>

            <h2 className="card-title text-2xl font-black font-display justify-center text-center tracking-tight mb-1 text-base-content">Verifikasi Email</h2>
            <p className="text-center text-sm font-medium text-base-content/60 mb-8">
              Kode OTP 6 digit telah dikirim ke <br />
              <strong className="text-primary">{email}</strong>
            </p>

            <div className="mb-8">
              <FloatingLabelInput
                id="verificationCode"
                label="Masukkan 6 Digit OTP"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                required
                className="tracking-[0.75em] text-center font-bold text-lg"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full rounded-xl font-bold text-base h-12 shadow-lg shadow-primary/20 hover:shadow-primary/40" disabled={isVerifying || code.length !== 6}>
              {isVerifying ? <span className="loading loading-spinner loading-md"></span> : "Verifikasi Sekarang"}
            </button>
          </form>

          <div className="card-body pt-0 pb-8 text-center flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-base-content/60">Tidak menerima email?</p>
            <button
              type="button"
              className={`btn btn-sm rounded-lg font-bold ${countdown > 0 ? "btn-disabled text-base-content/40" : "btn-ghost hover:bg-base-200 text-primary"}`}
              onClick={handleResendVerification}
              disabled={isResending || countdown > 0}
            >
              {isResending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : countdown > 0 ? (
                <Icon icon="solar:clock-circle-bold-duotone" className="mr-1.5 w-4 h-4" />
              ) : (
                <Icon icon="solar:letter-opened-bold-duotone" className="mr-1.5 w-4 h-4" />
              )}
              {countdown > 0 ? `Tunggu ${countdown} detik` : "Kirim Ulang OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationPage;
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";
import { useSiteStore } from "../../stores/siteStore"; 
import { useAuth } from "../../hooks/useAuth";

function Kontak() {
  const siteData = useSiteStore((state) => state.siteData);
  const { user } = useAuth();
  const [nama, setNama] = useState("");
  const [emailForm, setEmailForm] = useState("");
  const [pesan, setPesan] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    if (user) {
      setNama(user.fullName || "");
      setEmailForm(user.email || "");
    }
  }, [user]);

  const handleSendMessage = () => {

    const links = siteData?.contactLinks || {};

    if (selectedMethod === "telegram") {
      const url = `https://t.me/${siteData.contactLinks.telegram}`;
      window.open(url, "_blank", "noopener,noreferrer");
      toast.success("Membuka Telegram...", { duration: 1700 });
      return;
    }
    if (!selectedMethod) {
      toast.error("Pilih metode kontak terlebih dahulu (Email/WhatsApp).");
      return;
    }
    if (nama.trim().length < 5) {
      toast.error("Nama minimal 5 karakter.");
      return;
    }
    if (emailForm.trim().length < 8) {
      toast.error("Email minimal 8 karakter.");
      return;
    }
    if (pesan.trim().length < 25) {
      toast.error("Pesan minimal 25 karakter.");
      return;
    }
    const subject = `Pesan dari ${nama || "Pengunjung"}`;
    const body = `Nama: ${nama}\nEmail: ${
      emailForm || "-"
    }\n\nPesan:\n${pesan}`;
    const encodedBody = encodeURIComponent(body);
    const encodedSubject = encodeURIComponent(subject);
    let url = "";
    switch (selectedMethod) {
      case "email":
        url = `mailto:${siteData.contactLinks.email}?subject=${encodedSubject}&body=${encodedBody}`;
        break;
      case "whatsapp":
        const waBody = `Halo Mazda,\n\nNama: ${nama || "-"}\nEmail: ${
          emailForm || "-"
        }\n\nPesan:\n${pesan}`;
        const encodedWaBody = encodeURIComponent(waBody);
        url = `https://wa.me/${siteData.contactLinks.whatsapp}?text=${encodedWaBody}`;
        break;
      default:
        return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getButtonText = () => {
    switch (selectedMethod) {
      case "email":
        return "Kirim via Email";
      case "whatsapp":
        return "Chat via WhatsApp";
      case "telegram":
        return "Buka Telegram";
      default:
        return "Pilih Kontak Dahulu";
    }
  };

  const isFormDisabled = selectedMethod === "telegram";

  const isFormValid =
    !isFormDisabled &&
    nama.trim().length >= 5 &&
    emailForm.trim().length >= 8 &&
    pesan.trim().length >= 25;

  return (
    <div
      className="min-h-screen flex items-center justify-center py-20 bg-base-100 text-base-content"
      id="kontak"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-bold font-display mb-2">Hubungi Saya</h2>
        </div>
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
            <div data-aos="fade-right" data-aos-delay="150">
              <div
                className={`card shadow-sm p-6 flex flex-col items-center text-center space-y-2 border cursor-pointer transition-all duration-200 h-full ${
                  selectedMethod === "email"
                    ? "border-primary scale-105 bg-base-200"
                    : "border-base-300 bg-base-100"
                }`}
                onClick={() => setSelectedMethod("email")}
              >
                <Icon
                  icon="mdi:email-outline"
                  className="w-10 h-10 text-primary"
                />
                <div>
                  <h3 className="font-bold font-display text-lg">Email</h3>
                  <p className="text-sm text-base-content/80 break-all">
                    {siteData.contactLinks.email}
                  </p>
                </div>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="300">
              <div
                className={`card shadow-sm p-6 flex flex-col items-center text-center space-y-2 border cursor-pointer transition-all duration-200 h-full ${
                  selectedMethod === "whatsapp"
                    ? "border-success scale-105 bg-base-200"
                    : "border-base-300 bg-base-100"
                }`}
                onClick={() => setSelectedMethod("whatsapp")}
              >
                <Icon icon="mdi:whatsapp" className="w-10 h-10 text-success" />
                <div>
                  <h3 className="font-bold font-display text-lg">WhatsApp</h3>
                  <p className="text-sm text-base-content/80">
                    {siteData.contactLinks.whatsapp}
                  </p>
                </div>
              </div>
            </div>

            <div data-aos="fade-left" data-aos-delay="590">
              <div
                className={`card shadow-sm p-6 flex flex-col items-center text-center space-y-2 border cursor-pointer transition-all duration-200 h-full ${
                  selectedMethod === "telegram"
                    ? "border-info scale-105 bg-base-200"
                    : "border-base-300 bg-base-100"
                }`}
                onClick={() => setSelectedMethod("telegram")}
              >
                <Icon icon="mdi:telegram" className="w-10 h-10 text-info" />
                <div>
                  <h3 className="font-bold font-display text-lg">Telegram</h3>
                  <p className="text-sm text-base-content/80">
                    @{siteData.contactLinks.telegram}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`card w-full shadow-sm p-6 border border-base-300 bg-base-100`}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h3 className="text-xl font-bold font-display mb-4 text-center">
              Tuliskan Pesan Anda
            </h3>
            <form className="space-y-4">
              {/* Nama */}
              <div className="relative form-control">
                <input
                  type="text"
                  id="contactNama"
                  placeholder=" "
                  className={`input input-bordered w-full pt-4 peer text-base ${
                    isFormDisabled ? "cursor-not-allowed opacity-75" : ""
                  }`}
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  disabled={isFormDisabled}
                />
                <label
                  htmlFor="contactNama"
                  className={`absolute left-3 top-1 text-xs transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs pointer-events-none z-10 ${
                    isFormDisabled
                      ? "text-base-content/40"
                      : "text-base-content/70 peer-focus:text-primary"
                  }`}
                >
                  Nama
                </label>
              </div>
              {/* Email Form */}
              <div className="relative form-control">
                <input
                  type="email"
                  id="contactEmail"
                  placeholder=" "
                  className={`input input-bordered w-full pt-4 peer text-base ${
                    isFormDisabled ? "cursor-not-allowed opacity-75" : ""
                  }`}
                  value={emailForm}
                  onChange={(e) => setEmailForm(e.target.value)}
                  disabled={isFormDisabled}
                />
                <label
                  htmlFor="contactEmail"
                  className={`absolute left-3 top-1 text-xs transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs pointer-events-none z-10 ${
                    isFormDisabled
                      ? "text-base-content/40"
                      : "text-base-content/70 peer-focus:text-primary"
                  }`}
                >
                  Email
                </label>
              </div>
              {/* Pesan */}
              <div className="relative form-control">
                <textarea
                  id="contactPesan"
                  className={`textarea textarea-bordered w-full pt-4 peer text-base h-32 ${
                    isFormDisabled ? "cursor-not-allowed opacity-75" : ""
                  }`}
                  placeholder=" "
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  required={!isFormDisabled}
                  disabled={isFormDisabled}
                ></textarea>
                <label
                  htmlFor="contactPesan"
                  className={`absolute left-3 top-1 text-xs transition-all duration-200 ease-in-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs pointer-events-none z-10 ${
                    isFormDisabled
                      ? "text-base-content/40"
                      : "text-base-content/70 peer-focus:text-primary"
                  }`}
                >
                  Pesan atau Kritik
                </label>
              </div>

              <button
                type="button"
                onClick={handleSendMessage}
                className={`btn w-full mt-4 ${
                  !selectedMethod
                    ? "btn-disabled"
                    : isFormDisabled
                    ? "btn-primary" // Selalu btn-primary jika Telegram
                    : isFormValid
                    ? "btn-primary"
                    : "btn-disabled"
                }`}
                disabled={!selectedMethod || (!isFormDisabled && !isFormValid)}
              >
                {getButtonText()}
                {selectedMethod && selectedMethod !== "telegram" && (
                  <Icon icon="mdi:send" className="w-4 h-4 ml-1" />
                )}
                {selectedMethod === "telegram" && (
                  <Icon icon="mdi:open-in-new" className="w-4 h-4 ml-1" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kontak;

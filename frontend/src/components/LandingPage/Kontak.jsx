import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { useSiteStore } from "../../stores/siteStore";
import { useAuth } from "../../hooks/useAuth";
import FloatingLabelInput, { FloatingLabelTextarea } from "../FloatingLabelInput";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 85, damping: 15, mass: 1 }
  }
};

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
    if (selectedMethod === "telegram") {
      const url = `https://t.me/${siteData.contactLinks.telegram}`;
      window.open(url, "_blank", "noopener,noreferrer");
      toast.success("Membuka Telegram...", { duration: 1700 });
      return;
    }
    if (!selectedMethod) {
      toast.error("Pilih metode kontak terlebih dahulu.");
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
    const body = `Nama: ${nama}\nEmail: ${emailForm || "-"}\n\nPesan:\n${pesan}`;
    const encodedBody = encodeURIComponent(body);
    const encodedSubject = encodeURIComponent(subject);
    let url = "";
    switch (selectedMethod) {
      case "email":
        url = `mailto:${siteData.contactLinks.email}?subject=${encodedSubject}&body=${encodedBody}`;
        break;
      case "whatsapp":
        const waBody = `Halo Mazda,\n\nNama: ${nama || "-"}\nEmail: ${emailForm || "-"}\n\nPesan:\n${pesan}`;
        url = `https://wa.me/${siteData.contactLinks.whatsapp}?text=${encodeURIComponent(waBody)}`;
        break;
      default:
        return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getButtonText = () => {
    switch (selectedMethod) {
      case "email": return "Kirim via Email";
      case "whatsapp": return "Chat via WhatsApp";
      case "telegram": return "Buka Telegram";
      default: return "Pilih Metode Kontak";
    }
  };

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Hubungi Saya",
    "description": "Halaman kontak Mazda Nawallsyah",
    "mainEntity": {
      "@type": "Person",
      "name": siteData?.brandNameShort || "Mazda Nawallsyah",
      "email": siteData?.contactLinks?.email || "",
      "sameAs": Object.values(siteData?.contactLinks || {}).filter(Boolean)
    }
  }), [siteData]);

  useEffect(() => {
    let script = document.getElementById("structured-data-kontak");
    if (!script) {
      script = document.createElement("script");
      script.id = "structured-data-kontak";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.innerHTML = JSON.stringify(structuredData);
    return () => { if (script) script.remove(); };
  }, [structuredData]);

  const isFormDisabled = selectedMethod === "telegram";
  const isFormValid = !isFormDisabled && nama.trim().length >= 5 && emailForm.trim().length >= 8 && pesan.trim().length >= 25;

  const navigate = useNavigate();
  const [hoveredContact, setHoveredContact] = useState(null);

  const maskContact = (text, type) => {
    if (!text) return "";
    if (type === "email") {
      const [name, domain] = text.split("@");
      if (!domain) return text;
      return `${name.substring(0, 2)}${"*".repeat(Math.max(name.length - 2, 3))}@${domain}`;
    } else if (type === "whatsapp" || type === "phone") {
      return text.substring(0, 4) + "-****-***" + text.substring(text.length - 2);
    } else if (type === "telegram") {
      return text.substring(0, 2) + "***" + text.substring(text.length - 2);
    }
    return "******";
  };

  return (
    <LazyMotion features={domAnimation}>
      <div
        className="bg-base-100 min-h-[auto] my-12 xl:min-h-screen flex flex-col items-center justify-center py-9 lg:py-12 text-base-content"
        id="kontak"
      >
        <div className="w-full max-w-6xl mx-auto px-4">
          <m.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 70, damping: 20 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-2 tracking-tight">Hubungi <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Saya</span></h2>
            <p className="text-base md:text-lg text-base-content/60">Mari berdiskusi tentang proyek hebat Anda</p>
          </m.div>

          <div className="w-full">
            <m.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 w-full mb-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {[
                { id: "email", icon: "mdi:email-outline", label: "Email", color: "text-primary", border: "border-primary", data: siteData.contactLinks?.email },
                { id: "whatsapp", icon: "mdi:whatsapp", label: "WhatsApp", color: "text-success", border: "border-success", data: siteData.contactLinks?.whatsapp },
                { id: "telegram", icon: "mdi:telegram", label: "Telegram", color: "text-info", border: "border-info", data: siteData.contactLinks?.telegram }
              ].map((method) => {
                if (!method.data) return null;
                const isHoveredOrFocused = hoveredContact === method.id;
                const displayData = isHoveredOrFocused || method.id === "email" ? method.data : maskContact(method.data, method.id);

                return (
                  <m.div
                    key={method.id}
                    layout
                    variants={itemVariants}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onMouseEnter={() => setHoveredContact(method.id)}
                    onMouseLeave={() => setHoveredContact(null)}
                    onClick={() => setSelectedMethod(method.id)}
                    tabIndex={0}
                    onFocus={() => setHoveredContact(method.id)}
                    onBlur={() => setHoveredContact(null)}
                    className={`card shadow-sm p-6 flex flex-col items-center text-center space-y-2 cursor-pointer transition-colors duration-300 rounded-3xl outline-none ${selectedMethod === method.id ? `border-2 ${method.border} bg-base-200/80 shadow-md` : "border border-base-content/40 bg-base-100"}`}
                  >
                    <Icon icon={method.icon} className={`w-12 h-12 ${method.color}`} />
                    <h3 className="font-bold font-display text-lg">{method.label}</h3>
                    <m.p layout className="text-xs text-base-content/60 break-all font-text">
                      {displayData}
                    </m.p>
                  </m.div>
                );
              })}
            </m.div>

            <m.div
              className="card w-full shadow-lg p-6 md:p-10 border border-base-content/40 bg-base-100 rounded-[2.5rem]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold font-display mb-8 text-center uppercase tracking-widest text-base-content/80">
                Kirim Pesan
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingLabelInput
                    id="contactNama"
                    label="Nama Lengkap"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    disabled={isFormDisabled}
                    alwaysFloat={true}
                  />

                  <FloatingLabelInput
                    id="contactEmail"
                    label="Alamat Email"
                    type="email"
                    value={emailForm}
                    onChange={(e) => setEmailForm(e.target.value)}
                    disabled={isFormDisabled}
                    alwaysFloat={true}
                    onDoubleClick={() => navigate("/signin", { state: { from: "/#kontak" } })}
                    title="Klik 1x untuk mengetik, Klik 2x untuk menuju halaman Login"
                  />
                </div>

                <FloatingLabelTextarea
                  id="contactPesan"
                  label="Pesan atau Pertanyaan"
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  disabled={isFormDisabled}
                  rows={4}
                  required={!isFormDisabled}
                  alwaysFloat={true}
                />

                <m.button
                  type="button"
                  whileHover={selectedMethod && (isFormDisabled || isFormValid) ? { scale: 1.02 } : {}}
                  whileTap={selectedMethod && (isFormDisabled || isFormValid) ? { scale: 0.97 } : {}}
                  onClick={handleSendMessage}
                  className={`btn btn-lg w-full rounded-2xl font-bold shadow-lg ${!selectedMethod ? "btn-disabled" : isFormDisabled ? "btn-info text-base-100" : isFormValid ? "btn-primary" : "btn-disabled"
                    }`}
                >
                  {getButtonText()}
                  <Icon icon={selectedMethod === "telegram" ? "mdi:open-in-new" : "mdi:send"} className="w-5 h-5 ml-2" />
                </m.button>
              </form>
            </m.div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}

export default Kontak;
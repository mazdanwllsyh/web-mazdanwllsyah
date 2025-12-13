import React, { useState } from "react";
import SeoHelmet from "../SEOHelmet";
import { useSiteStore } from "../../stores/siteStore";
import AOS from "aos";

const gopayQrUrl =
  "https://res.cloudinary.com/dr7olcn4r/image/upload/v1761843697/QRIS_Gopay_c70ei6.jpg";
const danaQrUrl =
  "https://res.cloudinary.com/dr7olcn4r/image/upload/v1761843697/QRIS_Dana_mz3lgf.jpg";

const SecureImage = ({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    className={`w-full h-auto ${className}`}
    onContextMenu={(e) => e.preventDefault()}
    draggable="false"
  />
);

function Donasi() {
  const siteData = useSiteStore((state) => state.siteData); 
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleSelectMethod = (method) => {
    setSelectedMethod((current) => (current === method ? null : method));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-20 bg-base-100 text-base-content"
      id="donasi"
    >
      <SeoHelmet
        title="Donasi ke Mazda Nawallsyah"
        description={
          siteData.aboutParagraph
            ? siteData.aboutParagraph.substring(0, 160)
            : "Silakan Jika berminat untuk Berdonasi, klik salah satu ya."
        }
        url="/donasi" 
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-bold font-display mb-2">
            Beri Dukungan
          </h2>
          <p className="text-sm text-base-content/70">
            Jika Anda merasa terbantu, Anda bisa memberi apresiasi.
          </p>
        </div>

        <div className="max-w-lg mx-auto flex flex-col items-center">
          <div
            className="grid grid-cols-2 gap-4 md:gap-6 w-full mb-8"
            data-aos="zoom-in-down"
            data-aos-delay="100"
          >
            <button
              onClick={() => handleSelectMethod("gopay")}
              className={`btn btn-lg h-auto transition-all duration-300 ${
                selectedMethod === "gopay"
                  ? "scale-105 ring-2 ring-primary ring-offset-2"
                  : ""
              } bg-base-100 border border-base-300 hover:bg-base-200 hover:border-primary`}
            >
              <img
                src="https://brandlogos.net/wp-content/uploads/2022/10/gopay-logo_brandlogos.net_gph3u.png"
                alt="Gopay Logo"
                className="h-30 w-auto" 
              />
            </button>

            <button
              onClick={() => handleSelectMethod("dana")}
              className={`btn btn-lg h-auto transition-all duration-300 ${
                selectedMethod === "dana"
                  ? "scale-105 ring-2 ring-info ring-offset-2"
                  : ""
              } bg-base-100 border border-base-300 hover:bg-base-200 hover:border-info`}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/52/Dana_logo.png"
                alt="Dana Logo"
                className="h-10 w-auto" 
              />
            </button>
          </div>

          <div
            className="w-full max-w-xs"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            {selectedMethod === "gopay" && (
              <figure className="card bg-neutral text-neutral-content p-4 shadow-lg border-2 border-primary animate-fade-in">
                <SecureImage src={gopayQrUrl} alt="QRIS Gopay" />
                <figcaption className="text-center mt-3 text-sm font-medium">
                  Scan dari aplikasi GoPay atau Gojek
                </figcaption>
              </figure>
            )}

            {selectedMethod === "dana" && (
              <figure className="card bg-base-100 p-4 shadow-lg border-2 border-info animate-fade-in">
                <SecureImage src={danaQrUrl} alt="QRIS Dana" />
                <figcaption className="text-center mt-3 text-sm font-medium text-base-content">
                  Scan untuk berdonasi ke DANA
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Donasi;

import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import SeoHelmet from "../SEOHelmet";
import { useAuth } from "../../hooks/useAuth"; // GANTI: Pake useAuth
import { useSiteStore } from "../../stores/siteStore";
import { useCustomToast } from "../../hooks/useCustomToast";
import useCustomSwals from "../../hooks/useCustomSwals";
import instance from "../../utils/axios";
import AOS from "aos";

const ProfileSkeleton = () => {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-sm breadcrumbs mb-4">
          <ul>
            <li>
              <div className="skeleton h-4 w-16"></div>
            </li>
            <li>
              <div className="skeleton h-4 w-20"></div>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="card bg-base-100 shadow-md border border-base-200 p-4 items-center text-center">
              <div className="skeleton w-36 h-36 rounded-full shrink-0"></div>
              <div className="skeleton h-4 w-2/3 mt-3"></div>
              <div className="skeleton h-10 w-full mt-4"></div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <div className="card bg-base-100 shadow-md border border-base-200">
              <div className="card-body">
                <div className="skeleton h-6 w-1/3 mb-2 w-full"></div>
                <div className="divider my-2"></div>
                <div className="skeleton h-16 w-full mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="skeleton h-16 w-full"></div>
                  <div className="skeleton h-16 w-full"></div>
                </div>
                <div className="skeleton h-16 w-full mt-4"></div>
                <div className="skeleton h-12 w-full mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function Profile() {
  const siteData = useSiteStore((state) => state.siteData);
  const { user, isUserLoading, handleSignOut, updateUser } = useAuth();
  const customToast = useCustomToast();
  const { showSuccessSwal, showErrorSwal, showInfoSwal } = useCustomSwals();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
      });
      AOS.refresh();
    }
  }, [user]);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") {
      if (value.startsWith("0")) {
        value = "62" + value.substring(1);
      }
    }
    setProfileData({ ...profileData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/webp"
      ) {
        showInfoSwal("Format file harus .jpg, .png, atau .webp!");
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        showErrorSwal("Ukuran gambar tidak boleh lebih dari 4MB!");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    if (oldPassword || newPassword) {
      if (!oldPassword || !newPassword) {
        showErrorSwal("Sandi Lama dan Sandi Baru harus diisi!");
        return;
      }
      if (newPassword.length < 8) {
        showInfoSwal("Kata sandi baru minimal 8 karakter!");
        return;
      }
    }

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("fullName", profileData.fullName);
      formData.append("email", profileData.email);
      formData.append("phone", profileData.phone);
      formData.append("gender", profileData.gender);

      if (imageFile) {
        formData.append("profilePicture", imageFile);
      }
      if (oldPassword && newPassword) {
        formData.append("oldPassword", oldPassword);
        formData.append("password", newPassword);
      }

      const response = await instance.put("/users/profile", formData, { headers: { "Content-Type": "multipart/form-data" } });

      updateUser(response.data.user); 
      showSuccessSwal("Berhasil!", "Profil diperbarui.");

      setIsEditing(false);
      setImageFile(null);
      setImagePreview("");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Gagal update profil:", err);
      showErrorSwal(
        "Update Gagal",
        err.response?.data?.message || "Terjadi kesalahan"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
    });
    setImageFile(null);
    setImagePreview("");
    setOldPassword("");
    setNewPassword("");
  };

  if (isUserLoading) {
    return <ProfileSkeleton />;
  }

  const isAdmin = user && (user.role === "admin" || user.role === "superAdmin");

  return (
    <>
      <section id="userprofile" className="container mx-auto px-4 py-8">
        <SeoHelmet
          title="Selamat Datang di Web MazdaN"
          description={
            siteData.aboutParagraph
              ? siteData.aboutParagraph.substring(0, 160)
              : "Profil Kamu disini ya"
          }
          url="/profil"
        />
        <div className="max-w-7xl mx-auto">
          <div className="text-sm breadcrumbs mb-4" data-aos="fade-down">
            <ul>
              <li>
                <Link to="/">Beranda</Link>
              </li>
              <li>Profil</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 mb-4 lg:mb-0 order-1 lg:order-1">
              <div
                className="card bg-base-100 shadow-md border border-base-200"
                data-aos="fade-right"
              >
                <div className="card-body items-center text-center">
                  <h2 className="text-3xl font-bold font-display">
                    Foto Profil
                  </h2>
                  <div className="divider my-2"></div>
                  <div className="avatar">
                    <div className="w-36 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={
                          imagePreview ||
                          (user?.profilePicture
                            ? user.profilePicture
                            : "/default-avatar.png")
                        }
                        alt="Foto Profil"
                      />
                    </div>
                  </div>
                  {isEditing ? (
                    <div className="form-control w-full my-3">
                      <label className="label">
                        <span className="label-text text-xs">
                          Maks. 4MB (format gambar harus .jpg, .png)
                        </span>
                      </label>
                      <input
                        type="file"
                        className="file-input file-input-bordered file-input-sm w-full"
                        onChange={handleFileChange}
                        accept="image/jpeg, image/png"
                      />
                    </div>
                  ) : (
                    <small className="text-base-content/70 text-sm mt-2">
                      "Edit Data" untuk mengubah data.
                    </small>
                  )}
                </div>
              </div>

              <div className="hidden lg:block text-center mt-3 space-y-3">
                {isAdmin && (
                  <Link to="/dashboard" className="btn btn-neutral w-full">
                    <Icon icon="mdi:view-dashboard-outline" className="mr-2" />
                    Ke Dashboard
                  </Link>
                )}

                <button
                  className="btn btn-error w-full text-white"
                  onClick={handleSignOut}
                >
                  <Icon icon="mdi:logout" className="mr-2" />
                  Logout
                </button>
              </div>

              {!isEditing && (
                <div className="lg:hidden w-full mt-3">
                  {isAdmin && (
                    <Link
                      to="/dashboard"
                      className="btn btn-neutral w-full mb-3"
                    >
                      <Icon
                        icon="mdi:view-dashboard-outline"
                        className="mr-2"
                      />
                      Ke Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    className="btn btn-error w-full text-white"
                    onClick={handleSignOut}
                  >
                    <Icon icon="mdi:logout" className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Kolom Kanan: Form Data Diri */}
            <div className="lg:col-span-8 order-2 lg:order-2">
              <div
                className="card bg-base-100 shadow-md border border-base-200"
                data-aos="fade-left"
              >
                <form
                  className="card-body"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <h2 className="text-3xl font-bold font-display text-center">
                    Data Diri
                  </h2>
                  <div className="divider my-2"></div>

                  {/* Floating Label: Nama Lengkap */}
                  <div className="relative form-control mt-4">
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder=" "
                      className={`input input-bordered w-full pt-4 peer text-base ${!isEditing
                        ? "disabled:bg-base-100 disabled:text-base-content/70 disabled:border-base-300"
                        : ""
                        }`}
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <label
                      htmlFor="fullName"
                      className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary pointer-events-none z-10"
                    >
                      Nama Lengkap
                    </label>
                  </div>

                  {/* Grid Email & Telepon */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Floating Label: Email (dengan ikon) */}
                    <div className="relative form-control">
                      <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder=" "
                        className="input input-bordered w-full pt-4 peer text-base pr-10 disabled:bg-base-100 disabled:text-base-content/70 disabled:border-base-300"
                        value={
                          isEditing && showEmail
                            ? profileData.email
                            : "••••••••"
                        }
                        disabled // Selalu disabled (readOnly look)
                      />
                      <label
                        htmlFor="email"
                        className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary pointer-events-none z-10"
                      >
                        Email
                      </label>
                      {isEditing && (
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-primary z-10"
                          onClick={() => setShowEmail(!showEmail)}
                        >
                          <Icon
                            icon={showEmail ? "mdi:eye-off" : "mdi:eye"}
                            className="w-5 h-5"
                          />
                        </button>
                      )}
                    </div>
                    {/* Floating Label: Nomor Telepon */}
                    <div className="relative form-control">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder=" "
                        autoComplete="tel"
                        className={`input input-bordered w-full pt-4 peer text-base ${!isEditing
                          ? "disabled:bg-base-100 disabled:text-base-content/70 disabled:border-base-300"
                          : ""
                          }`}
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                      <label
                        htmlFor="phone"
                        className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary pointer-events-none z-10"
                      >
                        Nomor Telepon
                      </label>
                    </div>
                  </div>

                  {/* Jenis Kelamin (Select) */}
                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text text-base-content/70">
                        Jenis Kelamin:
                      </span>
                    </label>
                    <select
                      name="gender"
                      className={`select select-bordered w-full text-base text-center ${!isEditing
                        ? "disabled:bg-base-100 disabled:text-base-content/70 disabled:border-base-300"
                        : ""
                        }`}
                      value={profileData.gender || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="" disabled>
                        -- Pilih Jenis Kelamin --
                      </option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  {isEditing ? (
                    <>
                      <div className="divider my-4">
                        Ubah Password <strong>(Opsional)</strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Floating Label: Sandi Lama */}
                        <div className="relative form-control">
                          <input
                            type="password"
                            id="oldPassword"
                            placeholder=" "
                            className="input input-bordered w-full pt-4 peer text-base"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                          />
                          <label
                            htmlFor="oldPassword"
                            className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary pointer-events-none z-10"
                          >
                            Kata Sandi Lama
                          </label>
                        </div>
                        {/* Floating Label: Sandi Baru (dengan ikon) */}
                        <div className="relative form-control">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="newPassword"
                            placeholder=" "
                            className="input input-bordered w-full pr-10 pt-4 peer text-base"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <label
                            htmlFor="newPassword"
                            className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary pointer-events-none z-10"
                          >
                            Kata Sandi Baru
                          </label>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-primary z-10"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon
                              icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                              className="w-5 h-5"
                            />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Password Dummy (Saat tidak editing)
                    <div className="relative form-control mt-4">
                      <input
                        type="password"
                        id="dummyPassword"
                        placeholder=" "
                        className="input input-bordered w-full pt-4 peer text-base disabled:bg-base-100 disabled:text-base-content/70 disabled:border-base-300"
                        value="********"
                        disabled
                      />
                      <label
                        htmlFor="dummyPassword"
                        className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary pointer-events-none z-10"
                      >
                        Password
                      </label>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col items-center gap-2">
                    {isEditing ? (
                      <div className="flex flex-col md:flex-row gap-2 w-full">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="btn btn-warning w-full md:flex-1"
                          disabled={isUpdating}
                        >
                          <Icon icon="mdi:close-circle" className="mr-2" />
                          Batal Edit
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveChanges}
                          className="btn btn-success w-full md:flex-1"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <span className="loading loading-spinner"></span>
                          ) : (
                            <Icon icon="mdi:content-save" className="mr-2" />
                          )}
                          Simpan Perubahan
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="btn btn-secondary w-full"
                      >
                        <Icon icon="mdi:pencil" className="mr-2" />
                        Edit Data
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;

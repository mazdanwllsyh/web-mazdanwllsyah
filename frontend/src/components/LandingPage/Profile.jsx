import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import SeoHelmet from "../SEOHelmet";
import { useAuth } from "../../hooks/useAuth";
import { useSiteStore } from "../../stores/siteStore";
import { useCustomToast } from "../../hooks/useCustomToast";
import useCustomSwals from "../../hooks/useCustomSwals";
import instance from "../../utils/axios";
import FloatingLabelInput, { FloatingLabelSelect } from "../FloatingLabelInput";

const ProfileSkeleton = () => {
  return (
    <section className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3">
          <div className="card bg-base-100 border border-base-content/10 rounded-[2rem] overflow-hidden">
            <div className="h-32 bg-base-200 animate-pulse"></div>
            <div className="px-6 pb-6 pt-0 flex flex-col items-center -mt-16">
              <div className="w-32 h-32 rounded-full bg-base-300 border-4 border-base-100 animate-pulse mb-4"></div>
              <div className="h-6 w-3/4 bg-base-300 animate-pulse rounded-lg mb-2"></div>
              <div className="h-4 w-1/2 bg-base-200 animate-pulse rounded-lg mb-6"></div>
              <div className="h-12 w-full bg-base-200 animate-pulse rounded-xl"></div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/3">
          <div className="card bg-base-100 border border-base-content/10 rounded-[2rem] p-8">
            <div className="h-8 w-1/3 bg-base-300 animate-pulse rounded-lg mb-8"></div>
            <div className="space-y-6">
              <div className="h-14 w-full bg-base-200 animate-pulse rounded-xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-14 w-full bg-base-200 animate-pulse rounded-xl"></div>
                <div className="h-14 w-full bg-base-200 animate-pulse rounded-xl"></div>
              </div>
              <div className="h-14 w-full bg-base-200 animate-pulse rounded-xl"></div>
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

      const response = await instance.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

  const displayImage =
    imagePreview ||
    (user?.profilePicture &&
      user.profilePicture !== "null" &&
      user.profilePicture.trim() !== ""
      ? user.profilePicture
      : "/default-avatar.png");

  return (
    <section id="userprofile" className="py-12 px-2 lg:px-12">
      <SeoHelmet
        title={`Profil | ${user?.fullName || "Akun"}`}
        description={
          siteData.aboutParagraph
            ? siteData.aboutParagraph.substring(0, 160)
            : "Manajemen profil dan akun Anda."
        }
        url="/profil"
      />
      <div className="max-w-6xl mx-auto">
        <div className="text-sm breadcrumbs mb-8 font-medium text-base-content/60">
          <ul>
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                Beranda
              </Link>
            </li>
            <li className="text-base-content">Profil</li>
          </ul>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="card bg-base-100 border border-base-content/10 shadow-xl shadow-base-content/5 rounded-[2rem] overflow-hidden">
              <div className="h-32 w-full bg-gradient-to-r from-primary/80 to-secondary/80 relative">
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              <div className="px-6 pb-8 pt-0 flex flex-col items-center relative -mt-16">
                <div className="relative group">
                  <div className="avatar">
                    <div className="w-32 h-32 rounded-full ring-4 ring-base-100 shadow-xl bg-base-200">
                      <img
                        src={displayImage}
                        alt="Foto Profil"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                      <Icon icon="mdi:camera-plus" className="w-8 h-8" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/jpeg, image/png, image/webp"
                      />
                    </label>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <h2 className="text-2xl font-black font-display text-base-content">
                    {user?.fullName || "User"}
                  </h2>
                  <p className="text-sm font-medium text-base-content/50 uppercase tracking-widest mt-1">
                    {isAdmin ? "Administrator" : "Member"}
                  </p>
                </div>

                {isEditing && (
                  <p className="text-xs text-base-content/50 mt-4 text-center px-4 bg-base-200/50 py-2 rounded-xl border border-base-content/5">
                    Format: JPG, PNG, WEBP. Maks 4MB.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {isAdmin && (
                <Link
                  to="/dashboard"
                  className="btn bg-gradient-to-br from-accent to-primary text-base-100 w-full rounded-2xl shadow-sm hover:shadow-md transition-all h-14"
                >
                  <Icon icon="solar:widget-5-bold-duotone" className="w-6 h-6 mr-1" />
                  Ke Dashboard
                </Link>
              )}
              <button
                type="button"
                className="btn btn-error btn-outline w-full rounded-2xl hover:!text-base-100 transition-all h-14"
                onClick={handleSignOut}
              >
                <Icon icon="solar:logout-2-bold-duotone" className="w-6 h-6 mr-1" />
                Logout Sistem
              </button>
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            <div className="card bg-base-100 border border-base-content/10 shadow-xl shadow-base-content/5 rounded-[2rem]">
              <form className="card-body p-6 md:p-10" onSubmit={(e) => e.preventDefault()}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black font-display text-base-content">
                      Informasi Pribadi
                    </h2>
                    <p className="text-base-content/60 mt-1 text-sm">
                      Kelola data diri dan preferensi keamanan Anda.
                    </p>
                  </div>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="btn btn-primary btn-circle shadow-lg shadow-primary/30"
                      title="Edit Profil"
                    >
                      <Icon icon="solar:pen-bold" className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <FloatingLabelInput
                    id="fullName"
                    name="fullName"
                    label="Nama Lengkap"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-base-200/30" : ""}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatingLabelInput
                      id="email"
                      name="email"
                      label="Alamat Email"
                      type="text"
                      value={isEditing && showEmail ? profileData.email : "•••••••••••••"}
                      disabled={true}
                      className="bg-base-200/30"
                      rightElement={
                        isEditing ? (
                          <button
                            type="button"
                            className="text-base-content/40 hover:text-primary transition-colors p-2"
                            onClick={() => setShowEmail(!showEmail)}
                          >
                            <Icon icon={showEmail ? "solar:eye-closed-bold" : "solar:eye-bold"} className="w-5 h-5" />
                          </button>
                        ) : null
                      }
                    />

                    <FloatingLabelInput
                      id="phone"
                      name="phone"
                      label="Nomor Telepon"
                      type="tel"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-base-200/30" : ""}
                    />
                  </div>

                  <FloatingLabelSelect
                    id="gender"
                    name="gender"
                    label="Jenis Kelamin"
                    value={profileData.gender || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-base-200/70" : "bg-base-100"}
                  >
                    <option className="bg-base-100" value="" disabled hidden>-- Pilih --</option>
                    <option className="bg-base-100" value="Laki-laki">Laki-laki</option>
                    <option className="bg-base-100" value="Perempuan">Perempuan</option>
                  </FloatingLabelSelect>
                </div>

                {isEditing ? (
                  <div className="mt-10 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-[1px] flex-1 bg-base-content/10"></div>
                      <span className="text-xs font-bold uppercase tracking-widest text-base-content/40">Keamanan (Opsional)</span>
                      <div className="h-[1px] flex-1 bg-base-content/10"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FloatingLabelInput
                        id="oldPassword"
                        label="Kata Sandi Lama"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />

                      <FloatingLabelInput
                        id="newPassword"
                        label="Kata Sandi Baru"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        rightElement={
                          <button
                            type="button"
                            className="text-base-content/40 hover:text-primary transition-colors p-2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? "solar:eye-closed-bold" : "solar:eye-bold"} className="w-5 h-5" />
                          </button>
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-6">
                    <FloatingLabelInput
                      id="dummyPassword"
                      label="Kata Sandi"
                      type="password"
                      value="********"
                      disabled={true}
                      className="bg-base-200/30"
                    />
                  </div>
                )}

                {isEditing && (
                  <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-base-content/10">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="btn btn-ghost rounded-xl h-12 px-8"
                      disabled={isUpdating}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      className="btn btn-primary rounded-xl h-12 px-8 shadow-lg shadow-primary/30"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <span className="loading loading-ring loading-md"></span>
                      ) : (
                        <Icon icon="solar:diskette-bold" className="w-5 h-5 mr-2" />
                      )}
                      Simpan Perubahan
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
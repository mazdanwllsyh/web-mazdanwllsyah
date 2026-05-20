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
            <div className="card bg-base-100 shadow-md border border-base-content/20 p-4 items-center text-center">
              <div className="skeleton w-36 h-36 rounded-full shrink-0"></div>
              <div className="skeleton h-4 w-2/3 mt-3"></div>
              <div className="skeleton h-10 w-full mt-4"></div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <div className="card bg-base-100 shadow-md border border-base-content/20">
              <div className="card-body">
                <div className="skeleton h-6 w-1/3 mb-2"></div>
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
      // FIX: AOS.refresh() sudah dihapus dari sini
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
          {/* FIX: data-aos dihapus dari breadcrumbs */}
          <div className="text-sm breadcrumbs mb-4">
            <ul>
              <li>
                <Link to="/">Beranda</Link>
              </li>
              <li>Profil</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 mb-4 lg:mb-0 order-1 lg:order-1">
              {/* FIX: data-aos dihapus dari card Foto Profil */}
              <div className="card bg-base-100 shadow-md border border-base-content/20">
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
                  className="btn btn-error w-full text-base-100"
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
                    className="btn btn-error w-full text-base-100"
                    onClick={handleSignOut}
                  >
                    <Icon icon="mdi:logout" className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-8 order-2 lg:order-2">
              {/* FIX: data-aos dihapus dari card Data Diri */}
              <div className="card bg-base-100 shadow-md border border-base-content/20">
                <form
                  className="card-body"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <h2 className="text-3xl font-bold font-display text-center">
                    Data Diri
                  </h2>
                  <div className="divider my-2"></div>

                  <div className="mt-4">
                    <FloatingLabelInput
                      id="fullName"
                      name="fullName"
                      label="Nama Lengkap"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FloatingLabelInput
                      id="email"
                      name="email"
                      label="Email"
                      type="text"
                      value={isEditing && showEmail ? profileData.email : "•••••••••••••"}
                      disabled={true}
                      rightElement={
                        isEditing ? (
                          <button
                            type="button"
                            className="text-base-content/50 hover:text-primary transition-colors cursor-pointer"
                            onClick={() => setShowEmail(!showEmail)}
                          >
                            <Icon icon={showEmail ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5" />
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
                    />
                  </div>

                  <div className="mt-4">
                    <FloatingLabelSelect
                      id="gender"
                      name="gender"
                      label="Jenis Kelamin"
                      value={profileData.gender || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="bg-base-100"
                    >
                      <option value="" disabled hidden className="bg-base-100 text-base-content">-- Pilih Jenis Kelamin --</option>
                      <option value="Laki-laki" className="bg-base-100 text-base-content">Laki-laki</option>
                      <option value="Perempuan" className="bg-base-100 text-base-content">Perempuan</option>
                    </FloatingLabelSelect>
                  </div>

                  {isEditing ? (
                    <>
                      <div className="divider my-4">
                        Ubah Password <strong>(Opsional)</strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              className="text-base-content/50 hover:text-primary transition-colors cursor-pointer"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5" />
                            </button>
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <div className="mt-4">
                      <FloatingLabelInput
                        id="dummyPassword"
                        label="Password"
                        type="password"
                        value="********"
                        disabled={true}
                      />
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
                            <span className="loading loading-ring loading-sm"></span>
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
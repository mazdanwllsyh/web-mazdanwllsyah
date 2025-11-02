import React, { useState, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useUser } from "../../context/UserContext";
import { usePagination } from "../../hooks/usePagination";
import useCustomSwals from "../../hooks/useCustomSwals";
import { useCustomToast } from "../../hooks/useCustomToast";
import instance from "../../utils/axios";

const FloatingLabelInput = ({
  id,
  label,
  value,
  onChange,
  name,
  type = "text",
  icon,
  onIconClick,
}) => (
  <div className="relative form-control">
    <input
      type={type}
      id={id}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder=" "
      className={`input input-bordered w-full pt-4 peer text-base ${
        icon ? "pr-10" : ""
      }`}
    />
    <label
      htmlFor={id}
      className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary pointer-events-none z-10"
    >
      {label}
    </label>
    {icon && (
      <button
        type="button"
        onClick={onIconClick}
        className="btn btn-ghost btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2 text-base-content/70 hover:bg-base-200 z-10"
        aria-label="Toggle password visibility"
      >
        <Icon icon={icon} className="h-5 w-5" />
      </button>
    )}
  </div>
);

const SuperAdminGate = ({ children }) => {
  const { user } = useUser();

  if (user.role !== "superAdmin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <span className="loading loading-ring loading-lg text-error py-6"></span>
        <h2 className="text-4xl font-bold font-display text-error my-3">
          Akses Ditolak
        </h2>
        <p className="text-md text-base-content/80">
          Eits, mau apa? Halaman ini khusus untuk Super Admin.
        </p>
        <span className="loading loading-dots loading-xl py-8"></span>
      </div>
    );
  }

  return children;
};

function UserDashboard() {
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showConfirmSwal, showSuccessSwal } = useCustomSwals();
  const { error: errorToast } = useCustomToast();

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const { user } = useUser();

  const [newAdminForm, setNewAdminForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user.role === "superAdmin") {
        setIsLoading(true);
        try {
          const manageRes = await instance.get("/users/management/users");
          const usersRes = await instance.get("/users/users");

          const combinedUsers = [
            ...manageRes.data.superAdmins,
            ...manageRes.data.admins,
            ...usersRes.data.users,
          ];

          setAllUsers(combinedUsers);
        } catch (err) {
          errorToast(
            "Gagal Memuat Data",
            err.response?.data?.message || "Tidak dapat terhubung ke server."
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, errorToast]);

  const filteredUsers = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return allUsers.filter(
      (user) =>
        (user.fullName && user.fullName.toLowerCase().includes(lowerSearch)) ||
        (user.email && user.email.toLowerCase().includes(lowerSearch))
    );
  }, [allUsers, searchTerm]);

  const superAdminUser = useMemo(
    () => filteredUsers.find((user) => user.role === "superAdmin"),
    [filteredUsers]
  );
  const adminUsers = useMemo(
    () => filteredUsers.filter((user) => user.role === "admin"),
    [filteredUsers]
  );
  const regularUsers = useMemo(
    () => filteredUsers.filter((user) => user.role === "user"),
    [filteredUsers]
  );

  // --- Pagination untuk Admin & User ---
  const paginationConfig = { sm: 3, md: 4, lg: 5 };
  const { currentItems: currentAdmins, PaginationComponent: AdminPagination } =
    usePagination(adminUsers, paginationConfig);
  const { currentItems: currentUsers, PaginationComponent: UserPagination } =
    usePagination(regularUsers, paginationConfig);

  const handleRoleChangeConfirm = async (userId, newRole, userName) => {
    const isConfirmed = await showConfirmSwal(
      `Ubah Peran ${userName}?`,
      `Anda yakin ingin mengubah peran ${userName} menjadi ${newRole}?`
    );
    if (isConfirmed) {
      try {
        await instance.put(`/users/role/${userId}`, { role: newRole });
        setAllUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
        showSuccessSwal("Berhasil!", "Peran pengguna telah diubah.");
      } catch (err) {
        errorToast(
          "Gagal Mengubah Peran",
          err.response?.data?.message || "Terjadi kesalahan."
        );
      }
    }
  };

  // Fungsi untuk menghapus pengguna
  const handleDeleteUser = async (userId, userName, userRole) => {
    const isConfirmed = await showConfirmSwal(
      `Hapus "${userName}"?`,
      "Tindakan ini tidak dapat dibatalkan. Anda yakin?"
    );
    if (isConfirmed) {
      try {
        const endpoint =
          userRole === "admin"
            ? `/users/admins/${userId}`
            : `/users/users/${userId}`;

        await instance.delete(endpoint);

        setAllUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
        showSuccessSwal("Berhasil Dihapus!", `"${userName}" telah dihapus.`);
      } catch (err) {
        errorToast(
          "Gagal Menghapus",
          err.response?.data?.message || "Terjadi kesalahan."
        );
      }
    }
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => {
    document.getElementById("add_admin_modal").showModal();
  };

  const handleCloseModal = () => {
    document.getElementById("add_admin_modal").close();
    setNewAdminForm({ fullName: "", email: "", password: "" });
  };

  const handleAddNewAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.post("/users/admins", newAdminForm);
      const newAdmin = response.data;

      setAllUsers((prev) => [newAdmin, ...prev]);
      showSuccessSwal(
        `Admin baru "${newAdmin.fullName}" berhasil ditambahkan.`
      );
      handleCloseModal();
    } catch (err) {
      errorToast(
        "Gagal Menambah Admin",
        err.response?.data?.message || "Terjadi kesalahan."
      );
    }
  };

  return (
    <SuperAdminGate>
      <div className="md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-auto">
            {allUsers.filter((u) => u.role === "admin").length < 3 && (
              <button
                className="btn btn-primary w-full"
                onClick={handleOpenModal}
              >
                <Icon icon="mdi:account-plus-outline" className="w-5 h-5" />
                Tambah Admin Baru
              </button>
            )}
          </div>
          <div className="w-full md:w-1/3">
            <input
              type="search"
              placeholder="Cari (nama atau email)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* --- CARD 1: SUPERADMIN --- */}
        <div className="card bg-base-100 shadow-md border border-base-200">
          <div className="card-body">
            <h2 className="card-title text-2xl font-display">Super Admin</h2>
            <div className="divider my-0"></div>
            {superAdminUser ? (
              <div className="flex items-center gap-4 p-4">
                <div className="avatar">
                  <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {superAdminUser.profilePicture ? (
                      <img
                        src={superAdminUser.profilePicture}
                        alt={superAdminUser.fullName}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary text-primary-content">
                        <span className="text-xl">
                          {superAdminUser.fullName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="font-bold">{superAdminUser.fullName}</div>
                  <div className="text-sm opacity-70">
                    {superAdminUser.email}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-base-content/60 italic p-4">
                Tidak ada Super Admin.
              </p>
            )}
          </div>
        </div>

        {/* --- CARD 2: ADMINS --- */}
        <div className="card bg-base-100 shadow-md border border-base-200">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title text-xl font-display">
                Administrator ({adminUsers.length})
              </h2>
              <AdminPagination />
            </div>
            <div className="divider my-0"></div>
            <div className="overflow-x-auto border border-base-300 rounded-lg">
              <table className="table table-zebra table-hover w-full">
                <thead className="bg-neutral text-neutral-content text-center">
                  <tr>
                    <th className="px-4 py-3">Pengguna</th>
                    <th className="px-4 py-3 border-l border-base-300">
                      Peran
                    </th>
                    <th className="px-4 py-3 border-l border-base-300">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAdmins.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-base-300 last:border-b-0 hover"
                    >
                      <td className="px-4 py-2 border-l border-base-300 align-top">
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-10 h-10">
                              {user.profilePicture ? (
                                <img
                                  src={user.profilePicture}
                                  alt={user.fullName}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-base-300">
                                  <Icon
                                    icon="mdi:account"
                                    className="w-6 h-6"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{user.fullName}</div>
                            <div className="text-sm opacity-70">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 border-l border-base-300 text-center align-middle">
                        <select
                          className="select select-bordered select-sm w-full max-w-xs"
                          value={user.role} // Terikat pada state
                          onChange={(e) =>
                            handleRoleChangeConfirm(
                              user._id,
                              e.target.value,
                              user.fullName
                            )
                          }
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 border-l border-base-300 text-center align-middle">
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() =>
                            handleDeleteUser(user._id, user.fullName, user.role)
                          }
                        >
                          <Icon icon="mdi:delete-outline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {adminUsers.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center italic p-4">
                        {searchTerm
                          ? "Admin tidak ditemukan."
                          : "Tidak ada Admin."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- CARD 3: USERS --- */}
        <div className="card bg-base-100 shadow-md border border-base-200">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title text-xl font-display">
                Pengguna ({regularUsers.length})
              </h2>
              <UserPagination />
            </div>
            <div className="divider my-0"></div>
            <div className="overflow-x-auto border border-base-300 rounded-lg">
              <table className="table table-zebra table-hover w-full">
                <thead className="bg-neutral text-neutral-content text-center">
                  <tr>
                    <th className="px-4 py-3">Pengguna</th>
                    <th className="px-4 py-3 border-l border-base-300">
                      Peran
                    </th>
                    <th className="px-4 py-3 border-l border-base-300">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-base-300 last:border-b-0 hover"
                    >
                      <td className="px-4 py-2 border-l border-base-300 align-top">
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-10 h-10">
                              {user.profilePicture ? (
                                <img
                                  src={user.profilePicture}
                                  alt={user.fullName}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-base-300">
                                  <Icon
                                    icon="mdi:account"
                                    className="w-6 h-6"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{user.fullName}</div>
                            <div className="text-sm opacity-70">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 border-l border-base-300 text-center align-middle">
                        <select
                          className="select select-bordered select-sm w-full max-w-xs"
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChangeConfirm(
                              user._id,
                              e.target.value,
                              user.fullName
                            )
                          }
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 border-l border-base-300 text-center align-middle">
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() =>
                            handleDeleteUser(user._id, user.fullName, user.role)
                          }
                        >
                          <Icon icon="mdi:delete-outline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {regularUsers.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center italic p-4">
                        {searchTerm
                          ? "Pengguna tidak ditemukan."
                          : "Tidak ada pengguna."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- MODAL: TAMBAH ADMIN --- */}
        <dialog id="add_admin_modal" className="modal modal-middle">
          <div className="modal-box w-11/12 max-w-lg">
            <h3 className="font-bold text-lg font-display">
              Tambah Admin Baru
            </h3>
            <form onSubmit={handleAddNewAdminSubmit} className="space-y-5 pt-4">
              <FloatingLabelInput
                id="admin_name"
                name="fullName"
                label="Nama Lengkap"
                value={newAdminForm.fullName}
                onChange={handleModalInputChange}
                required
              />
              <FloatingLabelInput
                id="admin_email"
                name="email"
                label="Email"
                type="email"
                value={newAdminForm.email}
                onChange={handleModalInputChange}
                required
              />
              <FloatingLabelInput
                id="admin_password"
                name="password"
                label="Password Admin"
                type={showPassword ? "text" : "password"}
                value={newAdminForm.password}
                onChange={handleModalInputChange}
                required
                icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                onIconClick={toggleShowPassword}
                minLength={8}
              />
              <div className="modal-action mt-6">
                <button
                  type="button"
                  className="btn"
                  onClick={handleCloseModal}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Icon icon="mdi:content-save" className="mr-1" />
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </SuperAdminGate>
  );
}

export default UserDashboard;

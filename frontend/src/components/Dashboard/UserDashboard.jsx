import React, { useState, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../hooks/useAuth";
import useCustomSwals from "../../hooks/useCustomSwals";
import { useCustomToast } from "../../hooks/useCustomToast";
import instance from "../../utils/axios";
import FloatingLabelInput from "../FloatingLabelInput";
import { TableContainer, THead, TRow, TCell, TableFooter } from "../StylingTable";
import ModalDashboard from "../ModalDashboard";

const SuperAdminGate = ({ children }) => {
  const { user } = useAuth();

  if (user?.role !== "superAdmin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] text-center p-10">
        <div className="p-6 bg-error/10 text-error rounded-full mb-4 shadow-lg shadow-error/20">
          <Icon icon="solar:shield-warning-bold-duotone" className="w-20 h-20" />
        </div>
        <h2 className="text-3xl font-black font-display text-error">Akses Ditolak!</h2>
        <p className="mt-2 opacity-60 font-medium max-w-md">
          Halaman ini hanya dapat diakses oleh tingkat akun <strong>Super Admin</strong>. Silakan hubungi pengelola utama jika ini adalah kesalahan.
        </p>
      </div>
    );
  }

  return children;
};

function UserDashboard() {
  const { user: currentUser } = useAuth();
  const { showConfirmSwal, showSuccessSwal } = useCustomSwals();
  const { error: errorToast } = useCustomToast();

  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [newAdminForm, setNewAdminForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // State Pagination Terpisah
  const [adminLimit, setAdminLimit] = useState(5);
  const [adminPage, setAdminPage] = useState(1);
  const [userLimit, setUserLimit] = useState(5);
  const [userPage, setUserPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.role === "superAdmin") {
        setIsLoading(true);
        try {
          const manageRes = await instance.get("/users/management/users");
          const usersRes = await instance.get("/users/users");

          const combinedUsers = [
            ...(manageRes.data.superAdmins || []),
            ...(manageRes.data.admins || []),
            ...(usersRes.data.users || []),
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
  }, [currentUser, errorToast]);

  useEffect(() => {
    setAdminPage(1);
    setUserPage(1);
  }, [searchTerm]);

  const filteredUsers = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return allUsers.filter(
      (user) =>
        (user.fullName && user.fullName.toLowerCase().includes(lowerSearch)) ||
        (user.email && user.email.toLowerCase().includes(lowerSearch))
    );
  }, [allUsers, searchTerm]);

  // Pemisahan Kategori Pengguna Sesuai Logika Asli
  const superAdminUser = useMemo(() => filteredUsers.find((user) => user.role === "superAdmin"), [filteredUsers]);
  const adminUsers = useMemo(() => filteredUsers.filter((user) => user.role === "admin"), [filteredUsers]);
  const regularUsers = useMemo(() => filteredUsers.filter((user) => user.role === "user"), [filteredUsers]);

  // Logika Slicing Pagination
  const totalAdminData = adminUsers.length;
  const totalAdminPages = Math.ceil(totalAdminData / adminLimit) || 1;
  const paginatedAdmins = useMemo(() => {
    const startIndex = (adminPage - 1) * adminLimit;
    return adminUsers.slice(startIndex, startIndex + adminLimit);
  }, [adminUsers, adminPage, adminLimit]);

  const totalUserData = regularUsers.length;
  const totalUserPages = Math.ceil(totalUserData / userLimit) || 1;
  const paginatedUsers = useMemo(() => {
    const startIndex = (userPage - 1) * userLimit;
    return regularUsers.slice(startIndex, startIndex + userLimit);
  }, [regularUsers, userPage, userLimit]);

  const handleRoleChangeConfirm = async (userId, newRole, userName) => {
    const isConfirmed = await showConfirmSwal(
      `Ubah Peran ${userName}?`,
      `Anda yakin ingin mengubah peran ${userName} menjadi ${newRole}?`
    );
    if (isConfirmed) {
      try {
        await instance.put(`/users/role/${userId}`, { role: newRole });
        setAllUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? { ...user, role: newRole } : user))
        );
        showSuccessSwal("Berhasil!", "Peran pengguna telah diubah.");
      } catch (err) {
        errorToast("Gagal Mengubah Peran", err.response?.data?.message || "Terjadi kesalahan.");
      }
    }
  };

  const handleDeleteUser = async (userId, userName, userRole) => {
    const isConfirmed = await showConfirmSwal(
      `Hapus "${userName}"?`,
      "Tindakan ini tidak dapat dibatalkan. Anda yakin?"
    );
    if (isConfirmed) {
      try {
        const endpoint = userRole === "admin" ? `/users/admins/${userId}` : `/users/users/${userId}`;
        await instance.delete(endpoint);

        setAllUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        showSuccessSwal("Berhasil Dihapus!", `"${userName}" telah dihapus.`);
      } catch (err) {
        errorToast("Gagal Menghapus", err.response?.data?.message || "Terjadi kesalahan.");
      }
    }
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewAdminSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await instance.post("/users/admins", newAdminForm);
      const newAdmin = response.data;

      setAllUsers((prev) => [newAdmin, ...prev]);
      showSuccessSwal("Berhasil!", `Admin baru "${newAdmin.fullName}" berhasil ditambahkan.`);
      document.getElementById("add_admin_modal").close();
      setNewAdminForm({ fullName: "", email: "", password: "" });
    } catch (err) {
      errorToast("Gagal Menambah Admin", err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <span className="loading loading-ring w-16 h-16 text-primary"></span>
      <p className="font-bold opacity-60 animate-pulse tracking-widest text-sm uppercase">Memuat Data...</p>
    </div>
  );

  return (
    <SuperAdminGate>
      <div className="space-y-6">
        {/* HEADER & PENCARIAN */}
        <div className="card bg-base-100 shadow-sm border border-base-content/20 rounded-[2.5rem]">
          <div className="card-body p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto">
              <h1 className="text-3xl font-black font-display flex items-center gap-3">
                <Icon icon="solar:shield-user-bold-duotone" className="text-primary" /> Manajemen Akses
              </h1>
              <p className="text-sm opacity-60 font-medium mt-1 uppercase tracking-widest">Super Admin Control Panel</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <input
                  type="search"
                  placeholder="Cari (nama atau email)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered w-full rounded-xl pl-10 border-base-content/20 bg-base-200/50 focus:bg-base-100"
                />
                <Icon icon="mdi:magnify" className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 w-5 h-5" />
              </div>
              {allUsers.filter((u) => u.role === "admin").length < 3 && (
                <button
                  className="btn btn-primary rounded-xl shadow-lg shadow-primary/20 w-full sm:w-auto"
                  onClick={() => document.getElementById("add_admin_modal").showModal()}
                >
                  <Icon icon="mdi:account-plus" className="w-5 h-5" />
                  Tambah Admin
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-content/20 rounded-[2rem] overflow-hidden">
          <div className="p-5 border-b border-base-content/10 bg-base-200/50 flex items-center gap-3">
            <div className="p-2 bg-secondary/10 text-secondary rounded-xl"><Icon icon="solar:crown-star-bold-duotone" className="w-6 h-6" /></div>
            <h2 className="text-xl font-black font-display">Super Admin</h2>
          </div>
          <div className="card-body p-6">
            {superAdminUser ? (
              <div className="flex items-center gap-5 p-4 bg-base-200/30 rounded-2xl border border-base-content/10">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-2xl shadow-md ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                    {superAdminUser.profilePicture ? (
                      <img src={superAdminUser.profilePicture} alt={superAdminUser.fullName} className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary text-primary-content font-black text-2xl uppercase">
                        {superAdminUser.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="font-black text-lg text-base-content flex items-center gap-2">
                    {superAdminUser.fullName}
                    <span className="badge badge-secondary badge-sm font-bold tracking-wider">ROOT</span>
                  </div>
                  <div className="text-sm font-medium opacity-60 flex items-center gap-1 mt-1">
                    <Icon icon="mdi:email-outline" /> {superAdminUser.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 opacity-50 italic font-medium">Tidak ada Super Admin ditemukan.</div>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-content/20 rounded-[2rem] overflow-hidden">
          <div className="p-5 border-b border-base-content/10 bg-base-200/50 flex justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 text-info rounded-xl"><Icon icon="solar:user-id-bold-duotone" className="w-6 h-6" /></div>
              <h2 className="text-xl font-black font-display">Administrator ({adminUsers.length})</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col border border-base-content/20 rounded-2xl overflow-hidden shadow-sm">
              <TableContainer maxHeight="400px">
                <THead>
                  <th className="w-16">No</th>
                  <th>Pengguna</th>
                  <th className="w-48 text-center">Peran</th>
                  <th className="w-32 text-center">Aksi</th>
                </THead>
                <tbody>
                  {paginatedAdmins.map((user, idx) => (
                    <TRow key={user._id}>
                      <TCell className="text-center font-mono opacity-50">{(adminPage - 1) * adminLimit + idx + 1}</TCell>
                      <TCell>
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-xl bg-base-200 border border-base-content/10 flex items-center justify-center overflow-hidden shadow-sm">
                              {user.profilePicture ? (
                                <img src={user.profilePicture} alt={user.fullName} className="object-cover" />
                              ) : (
                                <Icon icon="mdi:account" className="w-6 h-6 opacity-30" />
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-base text-base-content">{user.fullName}</div>
                            <div className="text-xs opacity-60 font-medium mt-0.5">{user.email}</div>
                          </div>
                        </div>
                      </TCell>
                      <TCell className="text-center align-middle">
                        <select
                          className="select select-bordered select-sm w-full font-bold bg-base-100"
                          value={user.role}
                          onChange={(e) => handleRoleChangeConfirm(user._id, e.target.value, user.fullName)}
                        >
                          <option value="admin" className="text-base-content bg-base-100">Admin</option>
                          <option value="user" className="text-base-content bg-base-100">User</option>
                        </select>
                      </TCell>
                      <TCell className="text-center align-middle">
                        <button className="btn btn-sm btn-outline btn-error hover:text-error-content w-full" onClick={() => handleDeleteUser(user._id, user.fullName, user.role)}>
                          <Icon icon="mdi:trash-can-outline" className="w-4 h-4" /> Hapus
                        </button>
                      </TCell>
                    </TRow>
                  ))}
                  {paginatedAdmins.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-10 opacity-50 italic">Admin tidak ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </TableContainer>
              <TableFooter
                limit={adminLimit}
                setLimit={(val) => { setAdminLimit(val); setAdminPage(1); }}
                totalData={totalAdminData}
                currentDataCount={paginatedAdmins.length}
                onNext={() => adminPage < totalAdminPages && setAdminPage(p => p + 1)}
                onPrev={() => adminPage > 1 && setAdminPage(p => p - 1)}
              />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-content/20 rounded-[2rem] overflow-hidden">
          <div className="p-5 border-b border-base-content/10 bg-base-200/50 flex justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 text-success rounded-xl"><Icon icon="solar:users-group-two-rounded-bold-duotone" className="w-6 h-6" /></div>
              <h2 className="text-xl font-black font-display">Pengguna Biasa ({regularUsers.length})</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col border border-base-content/20 rounded-2xl overflow-hidden shadow-sm">
              <TableContainer maxHeight="400px">
                <THead>
                  <th className="w-16">No</th>
                  <th>Pengguna</th>
                  <th className="w-48 text-center">Peran</th>
                  <th className="w-32 text-center">Aksi</th>
                </THead>
                <tbody>
                  {paginatedUsers.map((user, idx) => (
                    <TRow key={user._id}>
                      <TCell className="text-center font-mono opacity-50">{(userPage - 1) * userLimit + idx + 1}</TCell>
                      <TCell>
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-xl bg-base-200 border border-base-content/10 flex items-center justify-center overflow-hidden shadow-sm">
                              {user.profilePicture ? (
                                <img src={user.profilePicture} alt={user.fullName} className="object-cover" />
                              ) : (
                                <Icon icon="mdi:account" className="w-6 h-6 opacity-30" />
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-base text-base-content">{user.fullName}</div>
                            <div className="text-xs opacity-60 font-medium mt-0.5">{user.email}</div>
                          </div>
                        </div>
                      </TCell>
                      <TCell className="text-center align-middle">
                        <select
                          className="select select-bordered select-sm w-full font-bold bg-base-100"
                          value={user.role}
                          onChange={(e) => handleRoleChangeConfirm(user._id, e.target.value, user.fullName)}
                        >
                          <option value="admin" className="text-base-content bg-base-100">Admin</option>
                          <option value="user" className="text-base-content bg-base-100">User</option>
                        </select>
                      </TCell>
                      <TCell className="text-center align-middle">
                        <button className="btn btn-sm btn-outline btn-error hover:text-error-content w-full" onClick={() => handleDeleteUser(user._id, user.fullName, user.role)}>
                          <Icon icon="mdi:trash-can-outline" className="w-4 h-4" /> Hapus
                        </button>
                      </TCell>
                    </TRow>
                  ))}
                  {paginatedUsers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-10 opacity-50 italic">Pengguna tidak ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </TableContainer>
              <TableFooter
                limit={userLimit}
                setLimit={(val) => { setUserLimit(val); setUserPage(1); }}
                totalData={totalUserData}
                currentDataCount={paginatedUsers.length}
                onNext={() => userPage < totalUserPages && setUserPage(p => p + 1)}
                onPrev={() => userPage > 1 && setUserPage(p => p - 1)}
              />
            </div>
          </div>
        </div>

        <ModalDashboard
          id="add_admin_modal"
          title="Daftarkan Admin Baru"
          icon="solar:user-plus-bold-duotone"
          isSaving={isSaving}
          onSave={handleAddNewAdminSubmit}
          onCancel={() => { document.getElementById("add_admin_modal").close(); setNewAdminForm({ fullName: "", email: "", password: "" }); }}
          saveLabel="Daftarkan Admin"
        >
          <div className="space-y-6 mt-2">
            <FloatingLabelInput id="admin_name" name="fullName" label="Nama Lengkap" value={newAdminForm.fullName} onChange={handleModalInputChange} required />
            <FloatingLabelInput id="admin_email" name="email" label="Alamat Email" type="email" value={newAdminForm.email} onChange={handleModalInputChange} required />
            <div className="relative">
              <FloatingLabelInput id="admin_password" name="password" label="Password (Min. 8 Karakter)" type={showPassword ? "text" : "password"} value={newAdminForm.password} onChange={handleModalInputChange} required minLength={8} />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 z-20 hover:opacity-100 transition-opacity" onClick={() => setShowPassword(!showPassword)}>
                <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </ModalDashboard>

      </div>
    </SuperAdminGate>
  );
}

export default UserDashboard;
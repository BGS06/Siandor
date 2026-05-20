"use client";
import { useState } from "react";

export default function PenggunaPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mengubah data statis menjadi State agar bisa dimanipulasi (dihapus/diedit)
  const [users, setUsers] = useState([
    { nama: "Sumardi, S.Sos", jabatan: "Kepala Desa", username: "kepala_desa", role: "Eksekutif", color: "bg-emas" },
    { nama: "Endang Susanti", jabatan: "Sekretaris Desa", username: "sekretaris", role: "Operasional", color: "bg-biru" },
    { nama: "Admin", jabatan: "Operator Administrasi", username: "admin", role: "Admin", color: "bg-hijau-muda" },
  ]);

  // LOGIKA PENCARIAN
  const filteredUsers = users.filter((user) => 
    user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // FUNGSI AKSI: EDIT PASSWORD
  const handleEditPassword = (user) => {
    // Menggunakan prompt bawaan browser untuk kemudahan MVP
    const newPassword = prompt(`Masukkan password baru untuk akun @${user.username}:`);
    
    if (newPassword) {
      // Di sistem aslinya, di sini kamu akan melakukan fetch/axios ke backend
      alert(`✅ Password untuk @${user.username} berhasil diperbarui!\n\n(Catatan : Karena sistem login masih hardcoded, perubahan ini bersifat simulasi UI)`);
    }
  };

  // FUNGSI AKSI: NONAKTIFKAN PENGGUNA
  const handleNonaktifkan = (user) => {
    // Mencegah admin menghapus dirinya sendiri
    if (user.username === "admin") {
      alert("❌ Akses ditolak: Anda tidak dapat menonaktifkan akun Administrator utama.");
      return;
    }

    const confirmDelete = confirm(`⚠️ PERINGATAN!\nApakah Anda yakin ingin menonaktifkan akun @${user.username}?\nMereka tidak akan bisa masuk ke sistem lagi.`);
    
    if (confirmDelete) {
      // Menghapus user dari state tabel
      const newUsersList = users.filter((u) => u.username !== user.username);
      setUsers(newUsersList);
      alert(`🚫 Akun @${user.username} berhasil dinonaktifkan.`);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-hitam tracking-tight">Manajemen Pengguna</h1>
        <p className="text-sm text-abu mt-1 font-medium">Atur hak akses dan akun untuk aplikasi SIANDOR.</p>
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        
        {/* Search Bar Header (Tombol Tambah Pengguna Dihapus) */}
        <div className="p-4 lg:p-5 border-b border-border flex items-center justify-between gap-4 flex-wrap bg-white">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-abu" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-latar border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-hijau transition" 
              placeholder="Cari nama, jabatan, atau username..." 
            />
          </div>
          {/* Tombol + Tambah Pengguna sudah dihilangkan dari sini */}
        </div>

        {/* Tabel Pengguna */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-latar border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-abu uppercase tracking-widest">Profil Pengguna</th>
                <th className="px-6 py-4 text-xs font-bold text-abu uppercase tracking-widest">Username Login</th>
                <th className="px-6 py-4 text-xs font-bold text-abu uppercase tracking-widest">Akses Role</th>
                <th className="px-6 py-4 text-xs font-bold text-abu uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
                <tr key={i} className="border-b border-border hover:bg-[#FAFCFB] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${user.color} flex items-center justify-center font-bold text-sm text-white shrink-0`}>
                        {user.nama.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-hitam">{user.nama}</div>
                        <div className="text-xs text-abu font-medium">{user.jabatan}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-hitam">
                    <span className="bg-latar px-3 py-1 rounded-md border border-border">@{user.username}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-hitam font-bold">
                    {user.role}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      
                      {/* Tombol Edit Password */}
                      <button 
                        onClick={() => handleEditPassword(user)}
                        className="w-9 h-9 rounded-lg border border-border bg-white flex items-center justify-center hover:bg-latar hover:text-hijau transition cursor-pointer text-hitam shadow-sm" 
                        title="Edit Password"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      </button>

                      {/* Tombol Nonaktifkan */}
                      <button 
                        onClick={() => handleNonaktifkan(user)}
                        className="w-9 h-9 rounded-lg border border-border bg-white flex items-center justify-center hover:bg-[#FDECEA] hover:border-[#FCA5A5] hover:text-merah transition cursor-pointer text-hitam shadow-sm" 
                        title="Nonaktifkan"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                      </button>

                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-sm font-medium text-abu">
                    Tidak ada pengguna yang cocok dengan pencarian "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
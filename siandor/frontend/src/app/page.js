"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi Logika Login (Di-setting langsung di dalam code / Hardcoded)
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulasi loading 1 detik agar terasa seperti sistem profesional
    setTimeout(() => {
      // Daftar Akun yang diizinkan (Kepala Desa, Sekdes, Admin)
      const isValidKepalaDesa = username === "kepala_desa" && password === "desa123";
      const isValidSekdes = username === "sekretaris" && password === "desa123";
      const isValidAdmin = username === "admin" && password === "admin123";

      if (isValidKepalaDesa || isValidSekdes || isValidAdmin) {
        // Simpan data role sementara di Local Storage agar nanti Dashboard tahu siapa yang login
        localStorage.setItem("siandor_active_user", username);
        
        // Pindah ke halaman Dashboard
        router.push("/dashboard");
      } else {
        setError("Username atau password tidak ditemukan.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-latar flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      
      {/* Ornamen Background Estetik */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-hijau-light rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-emas-pale rounded-full blur-[100px] opacity-80"></div>

      <div className="w-full max-w-5xl flex bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 min-h-[550px]">
        
        {/* BAGIAN KIRI: Branding SIANDOR */}
        <div className="hidden lg:flex flex-col justify-between w-5/12 bg-hijau-tua p-12 relative overflow-hidden">
          {/* Ornamen Gelombang */}
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-hijau rounded-full opacity-50 blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
                  <rect x="4" y="8" width="16" height="20" rx="2" fill="var(--color-hijau-tua)" opacity="0.2" stroke="var(--color-hijau-tua)" strokeWidth="1.5"/>
                  <rect x="8" y="4" width="16" height="20" rx="2" fill="var(--color-hijau-tua)" opacity="0.35" stroke="var(--color-hijau-tua)" strokeWidth="1.5"/>
                  <rect x="12" y="0" width="16" height="20" rx="2" fill="var(--color-hijau-tua)"/>
                  <line x1="16" y1="6" x2="24" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="16" y1="9.5" x2="24" y2="9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="16" y1="13" x2="21" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 30 L18 34 L28 30 L18 26 Z" fill="var(--color-emas)"/>
                </svg>
              </div>
              <div>
                <div className="font-display text-2xl font-black text-white leading-none tracking-tight">SIANDOR</div>
              </div>
            </div>

            <h1 className="text-4xl font-black text-white leading-tight tracking-tight mb-4">
              Sistem Informasi<br/>Arsip Desa
            </h1>
            <p className="text-white/70 font-medium text-sm leading-relaxed max-w-sm">
              Kelola dokumen, surat masuk, dan surat keluar Desa Ngrandulor dengan cepat, aman, dan terintegrasi dalam satu platform cerdas.
            </p>
          </div>

          <div className="relative z-10 text-xs text-white/50 font-medium">
            &copy; 2024 Pemerintah Desa Ngrandulor
          </div>
        </div>

        {/* BAGIAN KANAN: Form Login */}
        <div className="w-full lg:w-7/12 p-8 lg:p-16 flex flex-col justify-center">
          
          <div className="max-w-md mx-auto w-full">
            {/* Munculkan logo di HP karena sidebar kirinya disembunyikan */}
            <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
              <div className="w-10 h-10 rounded-xl bg-hijau-tua flex items-center justify-center">
                <span className="text-white font-black text-lg">S</span>
              </div>
              <div className="font-display text-2xl font-black text-hitam tracking-tight">SIANDOR</div>
            </div>

            <h2 className="text-3xl font-black text-hitam tracking-tight mb-2">Selamat Datang</h2>
            <p className="text-abu font-medium text-sm mb-8">Silakan masuk menggunakan akun yang telah terdaftar.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Input Username */}
              <div>
                <label className="text-sm font-bold text-hitam mb-1.5 block">Username</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-abu">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-latar border-2 border-transparent focus:bg-white focus:border-hijau rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium outline-none transition-all text-hitam" 
                    placeholder="Masukkan username" 
                  />
                </div>
              </div>

              {/* Input Password */}
              <div>
                <label className="text-sm font-bold text-hitam mb-1.5 block">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-abu">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-latar border-2 border-transparent focus:bg-white focus:border-hijau rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium outline-none transition-all text-hitam" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              {/* Teks Error */}
              {error && (
                <div className="p-3 bg-[#FDECEA] border border-[#FCA5A5] text-merah text-xs font-bold rounded-lg flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              {/* Tombol Login */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-hijau hover:bg-hijau-tua text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  "Masuk ke Dashboard"
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-latar text-center">
              <p className="text-xs text-abu font-medium">
                Sistem ini dikhususkan untuk perangkat Desa Ngrandulor.<br/>Lupa password? Silakan hubungi Administrator.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
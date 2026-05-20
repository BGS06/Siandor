"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (username === "kepala_desa" && password === "desa123") {
        localStorage.setItem("siandor_active_user", "kepala_desa");
        router.push("/dashboard/kades");
      } 
      else if (username === "sekretaris" && password === "desa123") {
        localStorage.setItem("siandor_active_user", "sekretaris");
        router.push("/dashboard/sekdes");
      } 
      else if (username === "admin" && password === "admin123") {
        localStorage.setItem("siandor_active_user", "admin");
        router.push("/dashboard");
      } 
      else {
        setError("Username atau password tidak ditemukan.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-latar flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-hijau-light rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-emas-pale rounded-full blur-[100px] opacity-80"></div>

      <div className="w-full max-w-5xl flex bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 min-h-[550px]">
        
        {/* BAGIAN KIRI: Branding SIANDOR - DESKTOP */}
        <div className="hidden lg:flex flex-col justify-between w-5/12 bg-hijau-tua p-12 relative overflow-hidden">
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-hijau rounded-full opacity-50 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              
              {/* LOGO KABUPATEN - STANDALONE ON GREEN */}
              <img 
                src="/logo-kabupaten.png" 
                alt="Logo Kabupaten Jombang" 
                className="w-16 h-16 object-contain rounded-md shadow-lg shrink-0"
              />

              <div>
                <div className="font-display text-3xl font-black text-white leading-none tracking-tight">SIANDOR</div>
              </div>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight tracking-tight mb-4">Sistem Informasi<br/>Arsip Desa</h1>
            <p className="text-white/80 font-medium text-sm leading-relaxed max-w-sm">Kelola dokumen, surat masuk, dan surat keluar Desa Ngrandulor dengan cepat, aman, dan terintegrasi dalam satu platform cerdas.</p>
          </div>
          <div className="relative z-10 text-xs text-white/60 font-medium">&copy; 2024 Pemerintah Desa Ngrandulor</div>
        </div>

        {/* BAGIAN KANAN: Form Login */}
        <div className="w-full lg:w-7/12 p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            
            {/* BRANDING LOGO - MOBILE VIEW */}
            <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
              
              {/* LOGO KABUPATEN - STANDALONE ON WHITE */}
              <img 
                src="/logo-kabupaten.png" 
                alt="Logo Kabupaten Jombang" 
                className="w-12 h-12 object-contain rounded-md shadow-md shrink-0"
              />

              <div className="font-display text-2xl font-black text-hitam tracking-tight">SIANDOR</div>
            </div>

            <h2 className="text-3xl font-black text-hitam tracking-tight mb-2">Selamat Datang</h2>
            <p className="text-abu font-medium text-sm mb-8">Silakan masuk menggunakan akun yang telah terdaftar.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm font-bold text-hitam mb-1.5 block">Username</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-abu">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-latar border border-border border-2 border-transparent focus:bg-white focus:border-hijau rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium outline-none transition-all text-hitam" placeholder="Masukkan username" />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-hitam mb-1.5 block">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-abu">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-latar border border-border border-2 border-transparent focus:bg-white focus:border-hijau rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium outline-none transition-all text-hitam" placeholder="••••••••" />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-[#FDECEA] border border-[#FCA5A5] text-merah text-xs font-bold rounded-lg flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <button type="submit" disabled={isLoading} className="w-full bg-hijau hover:bg-hijau-tua text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-latar text-center">
              <p className="text-xs text-abu font-medium">Sistem ini dikhususkan untuk perangkat Desa Ngrandulor.<br/>Lupa password? Silakan hubungi Administrator.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
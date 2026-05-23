"use client";
import { useState, useEffect } from "react";

const BACKEND = "http://127.0.0.1:8001";

export default function DashboardAdminPage() {
  const [statistik, setStatistik] = useState({
    total_surat: 0,
    total_masuk: 0,
    total_keluar: 0,
    terbaru: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStatistik();
  }, []);

  const fetchStatistik = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/statistik`);
      if (res.ok) {
        const data = await res.json();
        setStatistik(data);
      }
    } catch (err) {
      console.error("Gagal memuat statistik", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-hitam tracking-tight">Selamat datang, Admin 👋</h1>
        <p className="text-sm text-abu mt-1 font-medium">Ringkasan cepat arsip Desa Ngrandulor.</p>
      </div>

      {/* Kartu Statistik Dinamis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
          <div className="text-[32px] font-black text-hitam leading-none tracking-tighter">{isLoading ? "..." : statistik.total_surat}</div>
          <div className="text-[13px] text-abu font-semibold">Total Surat Tersimpan</div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
          <div className="text-[32px] font-black text-hitam leading-none tracking-tighter">{isLoading ? "..." : statistik.total_masuk}</div>
          <div className="text-[13px] text-abu font-semibold">Surat Masuk (2026)</div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
          <div className="text-[32px] font-black text-hitam leading-none tracking-tighter">{isLoading ? "..." : statistik.total_keluar}</div>
          <div className="text-[13px] text-abu font-semibold">Surat Keluar (2026)</div>
        </div>
      </div>

      {/* Tabel Surat Terbaru Dinamis */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div className="text-base font-bold text-hitam">Surat Terbaru</div>
          <button onClick={fetchStatistik} className="text-xs font-bold text-hijau hover:underline cursor-pointer">Refresh</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-latar border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-abu uppercase">No Agenda</th>
                <th className="px-6 py-4 text-xs font-bold text-abu uppercase">Nama / Asal</th>
                <th className="px-6 py-4 text-xs font-bold text-abu uppercase">Perihal</th>
                <th className="px-6 py-4 text-xs font-bold text-abu uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-abu">Memuat data...</td></tr>
              ) : statistik.terbaru.length > 0 ? (
                statistik.terbaru.map((row, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-6 py-4 text-sm font-bold text-hijau-tua">{row.agenda}</td>
                    <td className="px-6 py-4 text-sm text-hitam">{row.asal}</td>
                    <td className="px-6 py-4 text-sm text-hitam">{row.perihal}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.b}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-abu">Belum ada surat terbaru.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";

const BACKEND = "https://9a6d-2001-448a-c030-ac9-61b1-d317-ad55-8a3c.ngrok-free.app/api/surat";

// Template 19 Jenis Surat
const JENIS_SURAT_TEMPLATE = [
  "Surat Keterangan Kelahiran", "Surat Keterangan Kematian", "Surat Keterangan Usaha",
  "Surat Keterangan Domisili", "Surat Keterangan Belum Pernah Nikah", "Surat Keterangan Sudah Menikah",
  "Surat Keterangan Kepemilikan Kendaraan", "Surat Keterangan Catatan Kepolisian", "Surat Keterangan Penduduk",
  "Surat Keterangan Pengantar BBM", "Surat Keterangan Penghasilan", "Surat Keterangan Tidak Mampu",
  "Surat Keterangan Kehilangan", "Surat Keterangan Umum / Yanma", "Surat Keterangan Bepergian",
  "Surat Pernyataan dan Kuasa", "Surat Dinas Keluar", "Surat Dinas Datang", "Yamkesmaskin"
];

export default function LaporanPage() {
  const [statistik, setStatistik] = useState(null);
  const [rekapData, setRekapData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch data kartu
      const resStat = await fetch(`${BACKEND}/api/statistik`);
      const statData = await resStat.json();
      setStatistik(statData);

      // Fetch semua surat untuk dihitung di tabel
      const resSurat = await fetch(`${BACKEND}/api/surat`);
      const suratData = await resSurat.json();

      // Hitung otomatis berdasarkan database asli
      const rekapHitung = JENIS_SURAT_TEMPLATE.map((jenis) => {
        // Cari semua surat yang jenisnya cocok
        const suratTerkait = suratData.filter(s => s.jenis_surat && s.jenis_surat.toLowerCase().includes(jenis.toLowerCase()));
        
        let janJun = 0;
        let julDes = 0;

        suratTerkait.forEach(s => {
          if (s.tanggal) {
            const bulan = parseInt(s.tanggal.split("-")[1], 10);
            if (bulan >= 1 && bulan <= 6) janJun++;
            else if (bulan >= 7 && bulan <= 12) julDes++;
          }
        });

        // Logika trend sederhana
        let trend = "Stabil";
        let trendColor = "text-emas bg-emas-pale";
        if (julDes > janJun) { trend = "Naik"; trendColor = "text-hijau bg-hijau-pale"; }
        else if (julDes < janJun) { trend = "Turun"; trendColor = "text-merah bg-merah/10"; }

        return { jenis, janJun, julDes, total: janJun + julDes, trend, trendColor };
      });

      setRekapData(rekapHitung);

    } catch {
      setStatistik(null);
      setRekapData(JENIS_SURAT_TEMPLATE.map(jenis => ({ jenis, janJun: 0, julDes: 0, total: 0, trend: "Stabil", trendColor: "text-emas bg-emas-pale" })));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackup = async (tipe = null) => {
    setIsBackingUp(true);
    try {
      const url = tipe ? `${BACKEND}/api/backup?tipe=${tipe}` : `${BACKEND}/api/backup`;
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();
      alert(`✅ ${data.pesan}`);
    } catch {
      alert("❌ Gagal menghubungi backend untuk backup.");
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Kartu Statistik Utama */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Surat", key: "total_surat", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "bg-hijau-pale text-hijau-tua", border: "border-hijau-muda" },
          { label: "Surat Masuk", key: "total_masuk", icon: "M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11zM22 12H16l-2 3h-4l-2-3H2", color: "bg-emas-pale text-emas", border: "border-emas/30" },
          { label: "Surat Keluar", key: "total_keluar", icon: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z", color: "bg-biru-muda text-biru", border: "border-biru/30" },
          { label: "Sedang Proses", key: "total_proses", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-[#FFF3E0] text-[#E65100]", border: "border-[#FFB74D]/40" },
        ].map((item) => (
          <div key={item.label} className={`${item.color} rounded-2xl p-5 border ${item.border} flex items-start justify-between`}>
            <div>
              <div className="text-3xl font-black leading-none">
                {isLoading ? "—" : (statistik?.[item.key] ?? 0)}
              </div>
              <div className="text-xs font-bold mt-2 opacity-80">{item.label}</div>
            </div>
            <div className="opacity-40">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Tabel Rekap Per Jenis Surat */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-hitam text-lg font-normal">Rekap Per Jenis Surat – 2026</h3>
          <button className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-latar transition font-normal cursor-pointer">Export PDF</button>
        </div>
        
        <table className="w-full text-left text-sm text-hitam whitespace-nowrap">
          <thead>
            <tr className="border-b border-border text-abu">
              <th className="py-4 px-4 font-normal">#</th>
              <th className="py-4 px-4 font-normal uppercase">JENIS SURAT</th>
              <th className="py-4 px-4 font-normal uppercase">JANUARI-JUNI</th>
              <th className="py-4 px-4 font-normal uppercase">JULI-DES</th>
              <th className="py-4 px-4 font-normal uppercase">TOTAL</th>
              <th className="py-4 px-4 font-normal uppercase">TREND</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" className="py-10 text-center text-sm text-abu">Memuat data tabel...</td></tr>
            ) : rekapData.map((item, index) => (
              <tr key={index} className="border-b border-border/50 hover:bg-latar/50 transition">
                <td className="py-4 px-4 font-normal">{index + 1}</td>
                <td className="py-4 px-4 font-normal">{item.jenis}</td>
                <td className="py-4 px-4 font-normal">{item.janJun}</td>
                <td className="py-4 px-4 font-normal">{item.julDes}</td>
                <td className="py-4 px-4 font-normal">{item.total}</td>
                <td className="py-4 px-4 font-normal">
                  <span className={`px-2 py-1 rounded-full text-xs font-normal ${item.trendColor}`}>
                    {item.trend === "Naik" ? "↑" : item.trend === "Turun" ? "↓" : "→"} {item.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Backup Section */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-bold text-hitam text-base mb-1">Backup & Ekspor Data</h3>
        <p className="text-sm text-abu mb-5">Ekspor data arsip ke file Excel dan sinkronisasi ke Google Spreadsheet.</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleBackup()}
            disabled={isBackingUp}
            className="flex items-center gap-2 px-5 py-2.5 bg-hijau text-white rounded-xl font-bold text-sm hover:bg-hijau-tua shadow-md transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isBackingUp
              ? <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Memproses...</>
              : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Backup Semua Surat</>
            }
          </button>
          <button onClick={() => handleBackup("masuk")} disabled={isBackingUp} className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-hijau text-hijau rounded-xl font-bold text-sm hover:bg-hijau-pale transition cursor-pointer disabled:opacity-60">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Backup Surat Masuk
          </button>
          <button onClick={() => handleBackup("keluar")} disabled={isBackingUp} className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-biru text-biru rounded-xl font-bold text-sm hover:bg-biru-muda transition cursor-pointer disabled:opacity-60">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Backup Surat Keluar
          </button>
        </div>
      </div>

    </div>
  );
}
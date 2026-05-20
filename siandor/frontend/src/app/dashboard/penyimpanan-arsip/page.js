"use client";
import { useState, useEffect } from "react";

export default function PenyimpananArsipPage() {
  const [activeTab, setActiveTab] = useState("Semua Arsip");
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("admin");
  const [selectedSurat, setSelectedSurat] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("siandor_active_user") || "admin");
  }, []);

  const tabs = ["Semua Arsip", "Surat Keterangan", "Surat Pengantar", "Surat Undangan"];

  const masterData = [
    { agenda: "AG-001/2026", jenis: "Surat Keterangan", asal: "Budi Santoso", perihal: "Pengantar Domisili", nik: "3521xxxx", no: "001/SK-DOM", tgl: "09/05/2026", disp: "Kepala Desa", file: "PDF", status: "Selesai", statusColor: "hijau" },
    { agenda: "AG-002/2026", jenis: "Surat Undangan", asal: "Kecamatan", perihal: "Rapat Koordinasi", nik: "-", no: "400/12/KEC", tgl: "08/05/2026", disp: "Sekretaris", file: "PDF", status: "Proses", statusColor: "emas" },
    { agenda: "AG-003/2026", jenis: "Surat Pengantar", asal: "Siti Aminah", perihal: "Pengantar SKCK", nik: "3521yyyy", no: "002/SKCK", tgl: "07/05/2026", disp: "Kaur Umum", file: "PDF", status: "Selesai", statusColor: "hijau" },
  ];

  // LOGIKA PENCARIAN GANDA: Filter Tab + Filter Search Bar
  const filteredData = masterData.filter((item) => {
    // 1. Cek Tab
    const matchTab = activeTab === "Semua Arsip" || item.jenis === activeTab;
    // 2. Cek Search Term
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = 
      item.agenda.toLowerCase().includes(searchLower) ||
      item.asal.toLowerCase().includes(searchLower) ||
      item.perihal.toLowerCase().includes(searchLower);

    return matchTab && matchSearch;
  });

  const handleExportExcel = () => { alert("Mengunduh data arsip dalam format .xlsx..."); };
  const handlePrint = (surat) => { alert(`Menyiapkan dokumen ${surat.agenda} untuk dicetak...`); window.print(); };

  const handleExport3Lapis = async () => {
    alert("⏳ Mengamankan Database SIANDOR...");
    try {
      const response = await fetch("http://localhost:8001/api/backup", { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.pesan}\n\nLangkah selanjutnya:\nMohon unggah folder fisik (PDF) ke Google Drive Desa secara manual.`);
        if(confirm("Buka Google Drive sekarang?")) window.open("https://drive.google.com/", "_blank");
      } else {
        alert("❌ Gagal terhubung ke server Backend.");
      }
    } catch (error) {
      alert("❌ Error: Tidak dapat menghubungi Backend (http://localhost:8001).");
    }
  };

  return (
    <div>
      <div className="flex gap-1 mb-5 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button 
            key={tab} onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeTab === tab ? "bg-white text-hijau-tua shadow-sm" : "text-abu hover:text-hitam"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 lg:p-5 border-b border-border flex items-center justify-between gap-4 flex-wrap bg-white">
          
          {/* SEARCH BAR TERHUBUNG DENGAN STATE */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-abu" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-latar border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-hijau transition" 
              placeholder="Cari No Agenda, Nama, atau Perihal..." 
            />
          </div>
          
          <div className="flex gap-3 flex-wrap w-full sm:w-auto">
            <select className="px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-hitam outline-none focus:border-hijau cursor-pointer transition flex-1 sm:flex-none">
              <option>Semua Tahun</option><option>2026</option>
            </select>
            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <button onClick={handleExportExcel} className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-hijau-light text-hijau font-bold rounded-xl text-sm hover:bg-hijau-pale transition cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span className="hidden md:inline">Export Excel</span>
              </button>
              {role === "admin" && (
                <button onClick={handleExport3Lapis} className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-hijau text-white font-bold rounded-xl text-sm hover:bg-hijau-tua shadow-sm transition cursor-pointer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M12 12v9"/></svg>
                  Backup Cloud
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead className="bg-latar border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">No Agenda</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">Jenis Surat</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">Nama / Asal</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">Perihal</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">NIK</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">No Surat</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">Disposisi</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">File</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? filteredData.map((row, i) => (
                <tr key={i} className="border-b border-border hover:bg-[#FAFCFB] transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-hijau-tua">{row.agenda}</td>
                  <td className="px-6 py-4 text-sm text-hitam">{row.jenis}</td>
                  <td className="px-6 py-4 text-sm text-hitam">{row.asal}</td>
                  <td className="px-6 py-4 text-sm text-hitam">{row.perihal}</td>
                  <td className="px-6 py-4 text-sm text-hitam">{row.nik}</td>
                  <td className="px-6 py-4 text-sm text-hitam">{row.no}</td>
                  <td className="px-6 py-4 text-sm text-hitam">{row.tgl}</td>
                  <td className="px-6 py-4 text-sm text-hitam">{row.disp}</td>
                  <td className="px-6 py-4">
                    <span onClick={() => setSelectedSurat(row)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-biru-muda/40 text-biru cursor-pointer hover:bg-biru-muda transition">PDF</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-${row.statusColor}-pale text-${row.statusColor === 'emas' ? '[#7A5400]' : 'hijau-tua'}`}>● {row.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setSelectedSurat(row)} className="w-9 h-9 rounded-lg border border-border bg-white flex items-center justify-center hover:bg-latar hover:text-hijau transition cursor-pointer text-hitam shadow-sm" title="Lihat"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                      <button onClick={() => handlePrint(row)} className="w-9 h-9 rounded-lg border border-border bg-white flex items-center justify-center hover:bg-latar hover:text-hijau transition cursor-pointer text-hitam shadow-sm" title="Cetak"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="11" className="px-6 py-10 text-center text-sm font-medium text-abu">
                    Tidak ada arsip yang cocok dengan pencarian "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PREVIEW DOKUMEN (Kompak) */}
      {selectedSurat && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-latar rounded-t-2xl">
              <div>
                <h2 className="text-base font-bold text-hitam">Detail Dokumen</h2>
                <p className="text-xs text-hijau-tua font-bold mt-0.5">{selectedSurat.agenda}</p>
              </div>
              <button onClick={() => setSelectedSurat(null)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-white bg-latar cursor-pointer transition text-abu">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-5">
              <div className="w-full h-[220px] bg-abu-muda rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-abu p-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-border"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <p className="font-bold text-hitam text-sm">Preview Dokumen</p>
                <p className="text-xs mt-1 text-center line-clamp-2">{selectedSurat.asal} - {selectedSurat.jenis}.pdf</p>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-border flex justify-end gap-3 bg-latar rounded-b-2xl">
              <button onClick={() => setSelectedSurat(null)} className="px-4 py-2 border-2 border-border text-hitam rounded-lg font-bold text-xs hover:bg-white transition cursor-pointer">Tutup</button>
              <button onClick={() => alert("Mengunduh PDF...")} className="px-4 py-2 bg-hijau text-white rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-hijau-tua shadow-md transition cursor-pointer">
                Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
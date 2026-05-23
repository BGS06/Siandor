"use client";
import { useState, useEffect } from "react";

const BACKEND = "https://9a6d-2001-448a-c030-ac9-61b1-d317-ad55-8a3c.ngrok-free.app";

export default function PenyimpananArsipPage() {
  const [suratData, setSuratData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipe, setFilterTipe] = useState("semua"); // semua | masuk | keluar
  const [selectedSurat, setSelectedSurat] = useState(null);

  useEffect(() => { fetchArsip(); }, []);

  const fetchArsip = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/surat`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      const formattedData = data.map(item => ({
        id: item.id,
        agenda: item.no_agenda,
        jenis: item.jenis_surat,
        asal: item.nama_pemohon,
        perihal: item.perihal,
        nik: item.nik || "-",
        no: item.no_surat_asli || "-",
        tgl: item.tanggal,
        disp: item.disposisi,
        status: item.status,
        file_path: item.file_path,
        tipe: item.jenis_surat.toLowerCase().includes("keluar") ? "keluar" : "masuk"
      }));

      setSuratData(formattedData);
    } catch {
      setSuratData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = suratData.filter((row) => {
    const matchTipe = filterTipe === "semua" || row.tipe === filterTipe;
    const matchSearch = [row.agenda, row.asal, row.perihal, row.jenis]
      .join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    return matchTipe && matchSearch;
  });

  const renderPreview = (surat) => {
    if (!surat.file_path) return (
      <div className="w-full h-[160px] bg-latar rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-abu">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2 text-border"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <p className="font-bold text-hitam text-sm">Tidak Ada File</p>
        <p className="text-xs mt-1 text-abu">Dokumen tidak diupload</p>
      </div>
    );
    const url = `${BACKEND}${surat.file_path}`;
    const ext = surat.file_path.split(".").pop().toLowerCase();
    if (["jpg","jpeg","png","webp"].includes(ext))
      return <div className="w-full rounded-xl overflow-hidden border border-border bg-latar"><img src={url} alt="Dokumen" className="w-full max-h-[260px] object-contain" /></div>;
    if (ext === "pdf")
      return <div className="w-full h-[260px] rounded-xl overflow-hidden border border-border"><iframe src={url} className="w-full h-full" title="Preview PDF" /></div>;
    return (
      <div className="w-full h-[100px] bg-latar rounded-xl border border-border flex flex-col items-center justify-center gap-2">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-abu"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <p className="text-xs text-abu font-medium">{surat.file_path.split("/").pop()}</p>
      </div>
    );
  };

  const handleUnduh = (surat) => {
    if (!surat.file_path) { alert("Tidak ada file untuk diunduh."); return; }
    const link = document.createElement("a");
    link.href = `${BACKEND}${surat.file_path}`;
    link.setAttribute("download", surat.file_path.split("/").pop());
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackup = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/backup`, { method: "POST" });
      const data = await res.json();
      alert(data.pesan || "Backup dimulai!");
    } catch {
      alert("Gagal menghubungi backend untuk backup.");
    }
  };

  return (
    <div className="space-y-6">

      {/* Header Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Arsip", val: suratData.length, color: "text-hijau-tua", bg: "bg-hijau-pale" },
          { label: "Surat Masuk", val: suratData.filter(s => s.tipe === "masuk").length, color: "text-biru", bg: "bg-biru-muda" },
          { label: "Surat Keluar", val: suratData.filter(s => s.tipe === "keluar").length, color: "text-emas", bg: "bg-emas-pale" },
          { label: "Ada File", val: suratData.filter(s => s.file_path).length, color: "text-hijau", bg: "bg-hijau-pale" },
        ].map((item) => (
          <div key={item.label} className={`${item.bg} rounded-2xl p-4 border border-border`}>
            <div className={`text-2xl font-black ${item.color}`}>{isLoading ? "—" : item.val}</div>
            <div className="text-xs font-semibold text-abu mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Tabel Arsip */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 lg:p-5 border-b border-border flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-abu" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-latar border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-hijau transition" placeholder="Cari No. Agenda, Nama, atau Perihal..." />
          </div>

          {/* Filter Tipe */}
          <div className="flex gap-2">
            {["semua","masuk","keluar"].map((t) => (
              <button key={t} onClick={() => setFilterTipe(t)} className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition ${filterTipe === t ? "bg-hijau text-white shadow" : "bg-latar border border-border text-abu hover:bg-white"}`}>
                {t === "semua" ? "Semua" : t === "masuk" ? "Surat Masuk" : "Surat Keluar"}
              </button>
            ))}
          </div>

          <div className="text-xs text-abu font-medium ml-auto">{filteredData.length} dokumen</div>

          {/* Tombol Backup */}
          <button onClick={handleBackup} className="flex items-center gap-2 px-4 py-2 bg-hijau-tua text-white rounded-xl font-bold text-xs hover:opacity-90 transition cursor-pointer shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Backup Excel
          </button>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[1100px]">
            <thead className="bg-latar border-b border-border">
              <tr>
                {["No Agenda","Tipe","Jenis Surat","Nama / Asal","Perihal","NIK","No Surat","Tanggal","Status","Disposisi","Aksi"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-abu uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="11" className="px-4 py-10 text-center text-sm text-abu">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin text-hijau" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    Memuat arsip...
                  </div>
                </td></tr>
              ) : filteredData.length > 0 ? filteredData.map((row, i) => (
                <tr key={`${row.id}-${i}`} className="border-b border-border hover:bg-latar transition-colors">
                  <td className="px-4 py-3 font-bold text-hijau-tua whitespace-nowrap">{row.agenda}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.tipe === "keluar" ? "bg-biru-muda text-biru" : "bg-emas-pale text-emas"}`}>
                      {row.tipe === "keluar" ? "Keluar" : "Masuk"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm max-w-[180px] truncate" title={row.jenis_surat}>{row.jenis}</td>
                  <td className="px-4 py-3 text-sm font-medium">{row.asal}</td>
                  <td className="px-4 py-3 text-sm">{row.perihal}</td>
                  <td className="px-4 py-3 text-sm text-abu">{row.nik}</td>
                  <td className="px-4 py-3 text-sm text-abu whitespace-nowrap">{row.no}</td>
                  <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap">{row.tgl}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.b || (row.status === "Selesai" ? "bg-hijau-pale text-hijau-tua" : "bg-emas-pale text-[#7A5400]")}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{row.disp}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setSelectedSurat(row)} className="text-biru text-sm font-bold hover:underline cursor-pointer">Lihat</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="11" className="px-4 py-10 text-center text-sm font-medium text-abu">
                  {searchTerm || filterTipe !== "semua" ? "Tidak ada arsip yang cocok." : "Belum ada data arsip."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL */}
      {selectedSurat && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center bg-latar rounded-t-2xl shrink-0">
              <div>
                <h2 className="text-lg font-bold text-hitam">Detail Arsip</h2>
                <p className="text-sm font-bold text-hijau-tua mt-0.5">{selectedSurat.agenda}</p>
              </div>
              <button onClick={() => setSelectedSurat(null)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-white bg-latar cursor-pointer transition text-abu">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {renderPreview(selectedSurat)}
              <div className="bg-latar border border-border rounded-xl p-4 space-y-2.5 text-sm">
                {[["Asal/Tujuan", selectedSurat.asal], ["Perihal", selectedSurat.perihal], ["No. Surat", selectedSurat.no], ["Tanggal", selectedSurat.tgl], ["Disposisi", selectedSurat.disp]].map(([l,v]) => (
                  <div key={l} className="flex justify-between gap-4">
                    <span className="text-abu font-medium shrink-0">{l}:</span>
                    <span className="font-bold text-hitam text-right">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center gap-4">
                  <span className="text-abu font-medium shrink-0">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedSurat.b || "bg-hijau-pale text-hijau-tua"}`}>{selectedSurat.status}</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-border flex justify-end gap-3 bg-latar rounded-b-2xl shrink-0">
              <button onClick={() => setSelectedSurat(null)} className="px-4 py-2 border-2 border-border text-hitam rounded-lg font-bold text-xs hover:bg-white transition cursor-pointer">Tutup</button>
              <button
                onClick={() => handleUnduh(selectedSurat)}
                disabled={!selectedSurat.file_path}
                className="px-4 py-2 bg-hijau text-white rounded-lg font-bold text-xs hover:bg-hijau-tua shadow-md transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Unduh File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
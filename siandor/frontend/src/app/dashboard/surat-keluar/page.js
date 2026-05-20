"use client";
import { useState } from "react";

export default function SuratKeluarPage() {
  const [searchTerm, setSearchTerm] = useState("");
  // STATE UNTUK MODAL PREVIEW SURAT
  const [selectedSurat, setSelectedSurat] = useState(null);

  const tableData = [
    { agenda: "AG-003", jenis: "Keterangan", asal: "Budi Santoso", perihal: "Keterangan Domisili", nik: "3521xxx", no: "045/SK-DOM/2026", tgl: "09/05/2026", disp: "Kepala Desa", status: "Selesai", b: "bg-hijau-pale text-hijau-tua" },
    { agenda: "AG-004", jenis: "Undangan", asal: "Kecamatan Paron", perihal: "Rapat Koordinasi", nik: "-", no: "046/UND/2026", tgl: "10/05/2026", disp: "Sekretaris", status: "Proses", b: "bg-emas-pale text-[#7A5400]" },
    { agenda: "AG-005", jenis: "Pengantar", asal: "Siti Aminah", perihal: "Pengantar SKCK", nik: "3521yyy", no: "047/SKCK/2026", tgl: "11/05/2026", disp: "Kaur Umum", status: "Selesai", b: "bg-hijau-pale text-hijau-tua" },
  ];

  // LOGIKA PENCARIAN REAL-TIME
  const filteredData = tableData.filter((row) => 
    row.agenda.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.asal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.jenis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm relative">
      
      {/* Search Bar Header */}
      <div className="p-4 lg:p-5 border-b border-border flex items-center justify-between gap-4 bg-white">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-abu" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-latar border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-hijau transition" 
            placeholder="Cari No. Agenda, Nama, atau Perihal..." 
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead className="bg-latar border-b border-border">
            <tr>
              <th className="px-4 py-4 text-xs font-bold text-abu uppercase">No Agenda</th>
              <th className="px-4 py-4 text-xs font-bold text-abu uppercase">Jenis</th>
              <th className="px-4 py-4 text-xs font-bold text-abu uppercase">Nama / Asal Surat</th>
              <th className="px-4 py-4 text-xs font-bold text-abu uppercase">Perihal</th>
              <th className="px-4 py-4 text-xs font-bold text-abu uppercase">NIK</th>
              <th className="px-4 py-4 text-xs font-bold text-abu uppercase">No Surat</th>
              {/* Warna biru pada Tanggal Kirim dihapus */}
              <th className="px-4 py-4 text-xs font-bold text-abu uppercase">Tanggal Kirim</th>
              <th className="px-4 py-4 text-xs font-bold text-abu uppercase">Disposisi</th>
              <th className="px-4 py-4 text-xs font-bold text-abu uppercase">Status</th>
              <th className="px-4 py-4 text-xs font-bold text-abu uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? filteredData.map((row, i) => (
              <tr key={i} className="border-b border-border hover:bg-latar transition-colors">
                <td className="px-4 py-3 text-sm font-bold text-hijau-tua">{row.agenda}</td>
                <td className="px-4 py-3 text-sm">{row.jenis}</td>
                <td className="px-4 py-3 text-sm">{row.asal}</td>
                <td className="px-4 py-3 text-sm">{row.perihal}</td>
                <td className="px-4 py-3 text-sm">{row.nik}</td>
                <td className="px-4 py-3 text-sm">{row.no}</td>
                <td className="px-4 py-3 text-sm font-semibold">{row.tgl}</td>
                <td className="px-4 py-3 text-sm">{row.disp}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${row.b}`}>{row.status}</span></td>
                <td className="px-4 py-3 text-center">
                  {/* Fungsi onClick ditambahkan untuk membuka Modal */}
                  <button 
                    onClick={() => setSelectedSurat(row)} 
                    className="text-biru text-sm font-bold hover:underline transition cursor-pointer"
                  >
                    Lihat
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="10" className="px-4 py-10 text-center text-sm font-medium text-abu">
                  Tidak ada surat keluar yang cocok dengan pencarian "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL PREVIEW DOKUMEN */}
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
                <p className="text-xs mt-1 text-center line-clamp-2">Surat Keluar - {selectedSurat.jenis}.pdf</p>
              </div>

              {/* Rincian Tambahan */}
              <div className="mt-4 space-y-2 bg-latar p-3 rounded-xl border border-border">
                 <div className="flex justify-between text-sm">
                    <span className="text-abu font-medium">Tujuan:</span>
                    <span className="text-hitam font-bold text-right">{selectedSurat.asal}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-abu font-medium">Perihal:</span>
                    <span className="text-hitam font-bold text-right">{selectedSurat.perihal}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-abu font-medium">No. Surat:</span>
                    <span className="text-hitam font-bold text-right">{selectedSurat.no}</span>
                 </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-border flex justify-end gap-3 bg-latar rounded-b-2xl">
              <button onClick={() => setSelectedSurat(null)} className="px-4 py-2 border-2 border-border text-hitam rounded-lg font-bold text-xs hover:bg-white transition cursor-pointer">Tutup</button>
              <button onClick={() => {alert("Mencetak dokumen..."); window.print();}} className="px-4 py-2 bg-white border border-border text-hitam rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-latar shadow-sm transition cursor-pointer">
                Cetak
              </button>
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
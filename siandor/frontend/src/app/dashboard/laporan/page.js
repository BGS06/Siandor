"use client";

export default function LaporanPage() {
  const tableData = [
    { no: 1, jenis: "Surat Keterangan Domisili", smt1: 78, smt2: 78, total: 156, trend: "Naik", trendColor: "hijau" },
    { no: 2, jenis: "Surat Keterangan Penghasilan", smt1: 52, smt2: 51, total: 103, trend: "Naik", trendColor: "hijau" },
    { no: 3, jenis: "Surat Pengantar SKCK", smt1: 45, smt2: 46, total: 91, trend: "Stabil", trendColor: "emas" },
    { no: 4, jenis: "Surat Keterangan Tidak Mampu", smt1: 49, smt2: 49, total: 98, trend: "Stabil", trendColor: "emas" },
    { no: 5, jenis: "Surat Keterangan Kelahiran", smt1: 40, smt2: 42, total: 82, trend: "Naik", trendColor: "hijau" },
  ];

  const handleExportPDF = () => {
    alert("Menyiapkan dokumen Laporan Rekapitulasi 2024 dalam format PDF...");
  };

  return (
    <div>
      {/* Grid Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        
        {/* Card 1: Surat Keluar */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-3 hover:shadow-md transition duration-300">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-hijau-pale">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-hijau-tua)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <div className="text-[40px] font-black text-hitam leading-none mb-2 tracking-tight">342</div>
            <div className="text-sm text-abu font-medium">Total Surat Keluar 2024</div>
          </div>
        </div>

        {/* Card 2: Surat Masuk */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-3 hover:shadow-md transition duration-300">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emas-pale">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-emas)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
          </div>
          <div>
            <div className="text-[40px] font-black text-hitam leading-none mb-2 tracking-tight">87</div>
            <div className="text-sm text-abu font-medium">Total Surat Masuk 2024</div>
          </div>
        </div>

        {/* Card 3: Jenis Surat Aktif */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-3 hover:shadow-md transition duration-300">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-biru-muda">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-biru)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div>
            <div className="text-[40px] font-black text-hitam leading-none mb-2 tracking-tight">15</div>
            <div className="text-sm text-abu font-medium">Jenis Surat Aktif</div>
          </div>
        </div>
      </div>

      {/* Tabel Laporan Rekapitulasi */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        
        {/* Header Tabel */}
        <div className="p-5 border-b border-border flex items-center justify-between gap-4 flex-wrap bg-white">
          <div className="text-lg font-bold text-hitam">Rekap Per Jenis Surat – 2024</div>
          <button onClick={handleExportPDF} className="px-5 py-2.5 bg-white border-2 border-border text-hijau font-bold rounded-xl text-sm hover:bg-latar hover:border-hijau-light transition cursor-pointer">
            Export PDF
          </button>
        </div>
        
        {/* Isi Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-latar border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase w-16">#</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">Jenis Surat</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">Januari–Juni</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">Juli–Des</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">Trend</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.no} className="border-b border-border hover:bg-[#FAFCFB] transition-colors">
                  <td className="px-6 py-4 text-sm text-hitam">{row.no}</td>
                  <td className="px-6 py-4 text-sm font-medium text-hitam">{row.jenis}</td>
                  <td className="px-6 py-4 text-sm text-hitam">{row.smt1}</td>
                  <td className="px-6 py-4 text-sm text-hitam">{row.smt2}</td>
                  <td className="px-6 py-4 text-sm font-bold text-hitam">{row.total}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-${row.trendColor}-pale text-${row.trendColor === 'emas' ? '[#7A5400]' : 'hijau-tua'}`}>
                      {row.trend === "Naik" ? "↑" : "→"} {row.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
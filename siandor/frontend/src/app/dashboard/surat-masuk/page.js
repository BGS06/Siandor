"use client";

export default function DashboardPage() {
  const stats = [
    { label: "Total Arsip Tersimpan", value: "1.248", trend: "+12%", color: "hijau", bg: "hijau-pale" },
    { label: "Surat Masuk (Bulan Ini)", value: "87", trend: "+5%", color: "emas", bg: "emas-pale" },
    { label: "Surat Keluar (Bulan Ini)", value: "342", trend: "-2%", color: "biru", bg: "biru-muda" }
  ];

  const tableData = [
    { noAg: "AG-001/2026", jenis: "Domisili", nama: "Budi Santoso", perihal: "Pengantar Domisili", status: "Selesai", badge: "bg-hijau-pale text-hijau-tua" },
    { noAg: "AG-002/2026", jenis: "SKTM", nama: "Siti Aminah", perihal: "Keterangan Tidak Mampu", status: "Proses", badge: "bg-emas-pale text-[#7A5400]" },
    { noAg: "AG-003/2026", jenis: "Undangan", nama: "Kecamatan Paron", perihal: "Rapat Koordinasi", status: "Selesai", badge: "bg-hijau-pale text-hijau-tua" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-hitam tracking-tight">Beranda Administrasi</h1>
        <p className="text-sm text-abu mt-1 font-medium">Ringkasan cepat pengelolaan arsip Desa Ngrandulor.</p>
      </div>

      {/* Grid Statistik UI Asli */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map((item, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${item.bg} text-${item.color === 'emas' ? '[#7A5400]' : item.color}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.trend.includes('+') ? 'bg-hijau-pale text-hijau-tua' : 'bg-[#FDECEA] text-merah'}`}>
                {item.trend}
              </div>
            </div>
            <div>
              <div className="text-[32px] font-black text-hitam leading-none mb-2 tracking-tighter">{item.value}</div>
              <div className="text-[13px] text-abu font-semibold">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabel UI Asli */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div className="text-base font-bold text-hitam">Surat Terbaru Ditambahkan</div>
          <button className="text-sm font-bold text-hijau hover:text-hijau-tua transition">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-latar border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">No Agenda</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">Nama / Asal</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">Perihal</th>
                <th className="px-6 py-4 text-xs font-bold text-abu tracking-widest uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i} className="border-b border-border hover:bg-[#FAFCFB] transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-hijau-tua">{row.noAg}</td>
                  <td className="px-6 py-4 text-sm font-medium text-hitam">{row.nama}</td>
                  <td className="px-6 py-4 text-sm text-hitam">{row.perihal}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${row.badge}`}>
                      ● {row.status}
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
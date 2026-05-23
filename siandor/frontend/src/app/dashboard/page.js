"use client";

export default function DashboardAdminPage() {
  const stats = [
    { label: "Total Surat Tersimpan", value: "1.248", color: "hijau", bg: "hijau-pale" },
    { label: "Surat Masuk (2026)", value: "87", color: "emas", bg: "emas-pale" },
    { label: "Surat Keluar (2026)", value: "342", color: "biru", bg: "biru-muda" }
  ];

  const tableData = [
    { noAg: "AG-001/2026", jenis: "Domisili", nama: "Budi Santoso", perihal: "Pengantar Domisili", status: "Selesai", badge: "bg-hijau-pale text-hijau-tua" },
    { noAg: "AG-002/2026", jenis: "SKTM", nama: "Siti Aminah", perihal: "Keterangan Tidak Mampu", status: "Proses", badge: "bg-emas-pale text-[#7A5400]" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-hitam tracking-tight">Selamat datang, Admin 👋</h1>
        <p className="text-sm text-abu mt-1 font-medium">Ringkasan cepat arsip Desa Ngrandulor.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map((item, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
            <div className="text-[32px] font-black text-hitam leading-none tracking-tighter">{item.value}</div>
            <div className="text-[13px] text-abu font-semibold">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div className="text-base font-bold text-hitam">Surat Terbaru</div>
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
              {tableData.map((row, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="px-6 py-4 text-sm font-bold text-hijau-tua">{row.noAg}</td>
                  <td className="px-6 py-4 text-sm text-hitam">{row.nama}</td>
                  <td className="px-6 py-4 text-sm text-hitam">{row.perihal}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${row.badge}`}>{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
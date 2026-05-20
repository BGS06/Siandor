"use client";

export default function DashboardSekdesPage() {
  const stats = [
    { label: "Arsip Belum di-Backup", value: "0", color: "hijau", bg: "hijau-pale" },
    { label: "Surat Masuk Belum Disposisi", value: "3", color: "emas", bg: "emas-pale" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-hitam tracking-tight">Dashboard Operasional Sekretaris</h1>
        <p className="text-sm text-abu mt-1 font-medium">Pantauan lalu lintas administrasi Desa Ngrandulor.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {stats.map((item, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm border-l-4" style={{borderLeftColor: `var(--color-${item.color})`}}>
            <div className="flex justify-between items-center">
              <div className="text-[14px] text-abu font-bold uppercase tracking-wider">{item.label}</div>
              <div className={`text-3xl font-black text-${item.color} leading-none tracking-tighter`}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border bg-white">
          <div className="text-base font-bold text-hitam">Log Aktivitas Operator (Admin) Terkini</div>
        </div>
        <div className="p-6">
           <div className="flex items-center gap-4 mb-4 border-b border-latar pb-4">
              <div className="w-2 h-2 rounded-full bg-hijau shrink-0"></div>
              <div className="flex-1 text-sm font-medium text-hitam">Admin mengunggah 5 dokumen ke Google Drive.</div>
              <div className="text-xs text-abu whitespace-nowrap">10:45 WIB</div>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emas shrink-0"></div>
              <div className="flex-1 text-sm font-medium text-hitam">Admin mencetak Laporan Bulanan November.</div>
              <div className="text-xs text-abu whitespace-nowrap">09:15 WIB</div>
           </div>
        </div>
      </div>
    </div>
  );
}
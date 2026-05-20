"use client";

export default function DashboardKadesPage() {
  const stats = [
    { label: "Surat Menunggu Tanda Tangan", value: "8", color: "merah", bg: "[#FDECEA]" },
    { label: "Total Surat Keluar (Bulan Ini)", value: "145", color: "biru", bg: "biru-muda" },
    { label: "Total Surat Masuk (Bulan Ini)", value: "32", color: "emas", bg: "emas-pale" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-hitam tracking-tight">Pantauan Eksekutif Kepala Desa</h1>
        <p className="text-sm text-abu mt-1 font-medium">Ringkasan aktivitas persuratan Pemerintah Desa Ngrandulor.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map((item, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition">
            <div>
              <div className="text-[40px] font-black text-hitam leading-none mb-2 tracking-tighter">
                {item.value}
              </div>
              <div className="text-[13px] text-abu font-semibold">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border bg-white">
          <div className="text-base font-bold text-hitam">Dokumen Menunggu Persetujuan / Tanda Tangan</div>
        </div>
        <div className="p-10 text-center text-abu font-medium text-sm">
          Semua dokumen saat ini sudah ditandatangani dan diverifikasi.
        </div>
      </div>
    </div>
  );
}
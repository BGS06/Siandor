"use client";
import { useContext } from "react";
import { ModalContext } from "../layout"; // Memanggil Context dari file layout.js

export default function JenisSuratPage() {
  const { openModal } = useContext(ModalContext);

  const jenisSuratData = [
    { title: "Surat Keterangan Domisili", count: "156 dokumen", icon: "🏠", bg: "bg-[#E8F7F1]" },
    { title: "Surat Keterangan Tidak Mampu (SKTM)", count: "98 dokumen", icon: "📋", bg: "bg-[#FDF3E0]" },
    { title: "Surat Keterangan Usaha", count: "74 dokumen", icon: "🏪", bg: "bg-[#EFF6FF]" },
    { title: "Surat Keterangan Belum Menikah", count: "63 dokumen", icon: "💍", bg: "bg-[#FDF2F8]" },
    { title: "Surat Keterangan Kematian", count: "45 dokumen", icon: "🕊️", bg: "bg-[#FEF2F2]" },
    { title: "Surat Keterangan Kelahiran", count: "82 dokumen", icon: "👶", bg: "bg-[#ECFDF5]" },
    { title: "Surat Keterangan Ahli Waris", count: "37 dokumen", icon: "⚖️", bg: "bg-[#FFFBEB]" },
    { title: "Surat Pengantar SKCK", count: "91 dokumen", icon: "👮", bg: "bg-[#EFF6FF]" },
    { title: "Surat Pengantar Nikah (N1/N2/N4)", count: "58 dokumen", icon: "💒", bg: "bg-[#FDF2F8]" },
    { title: "Surat Pindah Penduduk", count: "43 dokumen", icon: "🚚", bg: "bg-[#F0FDF4]" },
    { title: "Surat Datang Penduduk", count: "31 dokumen", icon: "📍", bg: "bg-[#E8F7F1]" },
    { title: "Surat Izin Keramaian", count: "26 dokumen", icon: "🎉", bg: "bg-[#FFF7ED]" },
    { title: "Surat Keterangan Janda/Duda", count: "19 dokumen", icon: "📄", bg: "bg-[#FEF2F2]" },
    { title: "Surat Keterangan Kehilangan", count: "22 dokumen", icon: "🔍", bg: "bg-[#FFFBEB]" },
    { title: "Surat Keterangan Penghasilan / Serbaguna", count: "103 dokumen", icon: "💰", bg: "bg-[#F0FDF4]" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-hitam font-display">Jenis Surat</h1>
        <p className="text-sm text-abu mt-1">15 jenis surat tersedia dalam sistem arsip SIANDOR</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jenisSuratData.map((item, i) => (
          <div 
            key={i} 
            onClick={() => openModal(item.title)}
            className="bg-white border-2 border-border rounded-2xl p-5 flex items-start gap-4 cursor-pointer hover:border-hijau hover:shadow-md transition-all group hover:-translate-y-1"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${item.bg}`}>
              {item.icon}
            </div>
            <div>
              <div className="text-sm font-bold text-hitam mb-1 leading-snug group-hover:text-hijau transition-colors">
                {item.title}
              </div>
              <div className="text-xs text-abu">
                {item.count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
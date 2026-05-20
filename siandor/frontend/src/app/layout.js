import "./globals.css";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";

// Setup Font
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-jakarta" 
});

const fraunces = Fraunces({ 
  subsets: ["latin"], 
  variable: "--font-fraunces" 
});

export const metadata = {
  title: "SIANDOR - Sistem Informasi Arsip Desa",
  description: "Aplikasi pengelolaan arsip dan dokumen Desa Ngrandulor",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased bg-latar text-hitam">
        {children}
      </body>
    </html>
  );
}
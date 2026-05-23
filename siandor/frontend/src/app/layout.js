import "./globals.css";

export const metadata = {
  title: "SIANDOR - Arsip Desa Ngrandulor",
  description: "Sistem Administrasi dan Arsip Desa Ngrandulor",
  icons: {
    icon: '/logo-kabupaten.png', // Sesuaikan dengan nama file yang kamu taruh di folder public
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
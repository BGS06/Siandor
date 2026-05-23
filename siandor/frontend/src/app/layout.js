import "./globals.css";

export const metadata = {
  title: "SIANDOR - Arsip Desa Ngrandulor",
  description: "Sistem Administrasi dan Arsip Desa Ngrandulor",
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
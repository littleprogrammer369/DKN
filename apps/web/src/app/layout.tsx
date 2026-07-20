import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "داده کشت نوین",
  description: "هوش مصنوعی در خدمت کشاورزی",
  manifest: "/manifest.json",
  icons: { icon: "/icons/icon-192.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body><div className="max-w-[420px] mx-auto relative">{children}</div></body>
    </html>
  );
}

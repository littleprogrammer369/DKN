import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from '@/lib/toast';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.FRONTEND_URL || 'http://localhost:3000'),
  title: "داده کشت نوین",
  description: "هوش مصنوعی در خدمت کشاورزی",
  themeColor: "#2BB673",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/brand/icon.png", type: "image/png" }],
    apple: [{ url: "/brand/icon.png" }],
  },
  openGraph: { title: "داده کشت نوین", description: "هوش مصنوعی در خدمت کشاورزی", images: ["/brand/icon.png"] },
  twitter: { card: "summary", title: "داده کشت نوین", images: ["/brand/icon.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body><div className="relative">{children}<ToastProvider /></div></body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'داده کشت نوین',
  description: 'هوش مصنوعی در خدمت کشاورزی — اولین پلتفرم بومی هوشمند کشاورزی ایران',
  manifest: '/manifest.json',
  icons: { icon: '/icons/icon-192.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2BB673',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen overflow-hidden"
            style={{ background: 'linear-gradient(160deg,#F7FBF8 0%,#EEF8F3 50%,#F5FAFA 100%)' }}>
        <div id="app" className="max-w-[420px] mx-auto h-screen relative overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}

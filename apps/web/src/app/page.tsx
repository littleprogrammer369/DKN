import { Metadata } from 'next';
import { ThemeProvider } from '@/lib/theme';
import LandingClient from '@/components/LandingClient';

export const metadata: Metadata = {
  title: 'داده کشت نوین | مدیریت هوشمند مزرعه',
  description: 'پلتفرم فارسی مدیریت هوشمند مزرعه، آب‌وهوا، آبیاری، آفات و مشاوره کشاورزی با هوش مصنوعی',
};

export default function RootLandingPage() {
  return (
    <ThemeProvider>
      <LandingClient />
    </ThemeProvider>
  );
}

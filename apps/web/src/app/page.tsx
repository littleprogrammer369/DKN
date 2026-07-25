import { Metadata } from 'next';
import LandingClient from '@/components/LandingClient';

export const metadata: Metadata = {
  title: 'داده کشت نوین | مدیریت هوشمند مزرعه',
  description: 'پلتفرم فارسی مدیریت هوشمند مزرعه، آب‌وهوا، آبیاری، آفات و مشاوره کشاورزی با هوش مصنوعی',
};

export default function RootLandingPage() {
  return <LandingClient />;
}

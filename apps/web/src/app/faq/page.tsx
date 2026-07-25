'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { ThemeProvider, useTheme } from '@/lib/theme';
import { Moon, Sun } from 'lucide-react';

function ThemeToggleInline() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="absolute top-4 left-4 w-10 h-10 rounded-full glass dark:bg-night-card/80 dark:border-night-border/60 flex items-center justify-center text-lg z-20 transition-all hover:scale-110">
      {theme === 'day' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}

const FAQ_ITEMS = [
  {
    q: 'داده کشت نوین چه خدماتی ارائه می‌دهد؟',
    a: 'داده کشت نوین یک پلتفرم هوشمند کشاورزی است که خدماتی مانند پایش ماهواره‌ای مزارع، پیش‌بینی هواشناسی، مشاوره هوش مصنوعی، مدیریت آبیاری، تشخیص آفات و بیماری‌ها و گزارش‌گیری حرفه‌ای ارائه می‌دهد.',
  },
  {
    q: 'آیا استفاده از پلتفرم رایگان است؟',
    a: 'بله، ثبت‌نام و استفاده از امکانات پایه رایگان است. برای دسترسی به قابلیت‌های پیشرفته مانند تحلیل‌های دقیق ماهواره‌ای، گزارش‌های حرفه‌ای و مشاوره نامحدود AI، می‌توانید از طرح‌های اشتراک استفاده کنید.',
  },
  {
    q: 'داده‌های ماهواره‌ای چقدر دقیق هستند؟',
    a: 'ما از تصاویر ماهواره‌ای با وضوح بالا استفاده می‌کنیم. شاخص‌هایی مانند NDVI (سلامت پوشش گیاهی) با دقت بالایی محاسبه می‌شوند. البته عوامل جوی و جغرافیایی ممکن است بر دقت تأثیر بگذارند.',
  },
  {
    q: 'چگونه می‌توانم مزرعه خود را ثبت کنم؟',
    a: 'پس از ورود به حساب کاربری، از منوی «زمین‌ها» گزینه «ساخت مزرعه جدید» را انتخاب کنید. می‌توانید موقعیت مکانی را روی نقشه مشخص کنید و اطلاعات محصول، مساحت و نوع خاک را وارد کنید.',
  },
  {
    q: 'آیا امکان ویرایش اطلاعات مزرعه وجود دارد؟',
    a: 'بله، از صفحه جزئیات مزرعه می‌توانید اطلاعات را ویرایش کنید. همچنین امکان حذف مزرعه نیز وجود دارد.',
  },
  {
    q: 'تشخیص آفات چگونه کار می‌کند؟',
    a: 'پلتفرم ما با ترکیب داده‌های هواشناسی، تصاویر ماهواره‌ای و گزارش‌های کاربران، ریسک شیوع آفات و بیماری‌ها را پیش‌بینی می‌کند. همچنین می‌توانید عکس آفت را آپلود کنید تا با استفاده از هوش مصنوعی شناسایی شود.',
  },
  {
    q: 'توصیه‌های آبیاری بر چه اساسی است؟',
    a: 'سیستم هوشمند آبیاری با توجه به داده‌های هواشناسی (دما، رطوبت، بارش)، نوع محصول، مرحله رشد و نوع خاک، بهترین زمان و مقدار آبیاری را توصیه می‌کند.',
  },
  {
    q: 'آیا اطلاعات من محرمانه می‌ماند؟',
    a: 'تمام اطلاعات شخصی و داده‌های مزارع شما به صورت محرمانه نگهداری می‌شود. برای اطلاعات بیشتر صفحه «قوانین و مقررات» را مطالعه کنید.',
  },
  {
    q: 'چگونه می‌توانم اشتراک خود را ارتقا دهم؟',
    a: 'از صفحه «پروفایل» و سپس بخش «اشتراک و پلن» می‌توانید طرح مورد نظر خود را انتخاب کنید. درگاه پرداخت امن برای خرید اشتراک در دسترس است.',
  },
  {
    q: 'در صورت مشکل فنی چه کنم؟',
    a: 'می‌توانید از بخش «چت آنلاین» در پروفایل با پشتیبانی در ارتباط باشید یا به آدرس ایمیل support@dkn.ir پیام دهید.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const filtered = FAQ_ITEMS.filter(item =>
    item.q.includes(search) || item.a.includes(search)
  );

  return (
    <ThemeProvider>
      <div className="min-h-screen px-4 py-6 transition-colors duration-300 dark:bg-night-bg">
        <ThemeToggleInline />
        <div className="max-w-[420px] mx-auto">
          <Link href="/profile" className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-night-muted mb-4 hover:text-brand-green transition-colors">
            <ArrowRight size={16} /> بازگشت
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <HelpCircle className="text-amber-600 dark:text-amber-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-800 dark:text-night-text">سوالات متداول</h1>
              <p className="text-xs text-gray-500 dark:text-night-muted">پاسخ به سوالات شما</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="جستجوی سوال..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              dir="rtl"
              className="input-glass pr-11 pl-4 text-sm text-right"
            />
          </div>

          {/* FAQ List */}
          <div className="space-y-2">
            {filtered.map((item, i) => (
              <div key={i} className="card shadow-glow !p-0 overflow-hidden transition-all duration-300">
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-right">
                  <span className="text-sm font-medium text-gray-800 dark:text-night-text flex-1">{item.q}</span>
                  {openIndex === i
                    ? <ChevronUp size={18} className="text-brand-green flex-shrink-0 mr-2" />
                    : <ChevronDown size={18} className="text-gray-400 flex-shrink-0 mr-2" />}
                </button>
                {openIndex === i && (
                  <div className="px-4 pb-4 text-xs text-gray-600 dark:text-night-muted/90 leading-relaxed border-t border-gray-100 dark:border-night-border/50 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-xs text-gray-400 py-8">نتیجه‌ای یافت نشد</p>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

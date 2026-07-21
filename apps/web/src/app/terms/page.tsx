'use client';

import Link from 'next/link';
import { ArrowRight, Sprout, Shield, FileText, Mail, Phone } from 'lucide-react';
import { ThemeProvider, useTheme } from '@/lib/theme';
import { Moon, Sun } from 'lucide-react';

function ThemeToggleInline() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="absolute top-4 left-4 w-10 h-10 rounded-full glass dark:bg-night-card/80 dark:border-night-border/60 flex items-center justify-center text-lg z-20 transition-all hover:scale-110" aria-label="toggle theme">
      {theme === 'day' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}

export default function TermsPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen px-4 py-6 transition-colors duration-300 dark:bg-night-bg">
        <ThemeToggleInline />

        <div className="max-w-[420px] mx-auto">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-night-muted mb-4 hover:text-brand-green transition-colors">
            <ArrowRight size={16} /> بازگشت
          </Link>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <FileText className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-800 dark:text-night-text">قوانین و مقررات</h1>
              <p className="text-xs text-gray-500 dark:text-night-muted">آخرین بروزرسانی: تیر ۱۴۰۵</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 leading-relaxed text-sm text-gray-700 dark:text-night-text/90">

            <div className="card shadow-glow">
              <h2 className="text-sm font-bold text-gray-800 dark:text-night-text mb-2 flex items-center gap-2">
                <Shield size={16} className="text-brand-green" /> حریم خصوصی
              </h2>
              <p className="text-xs text-gray-600 dark:text-night-muted/90 mb-2">
                پلتفرم «داده کشت نوین» متعهد به حفظ حریم خصوصی کاربران خود است. اطلاعات شخصی شما شامل نام، شماره تماس، آدرس ایمیل و موقعیت جغرافیایی مزارع تنها با رضایت شما جمع‌آوری و پردازش می‌شود.
              </p>
              <p className="text-xs text-gray-600 dark:text-night-muted/90">
                داده‌های کشاورزی شما (از جمله اطلاعات مزارع، محصولات، و سوابق آبیاری) به صورت محرمانه نگهداری شده و بدون اجازه شما در اختیار شخص ثالث قرار نخواهد گرفت.
              </p>
            </div>

            <div className="card shadow-glow">
              <h2 className="text-sm font-bold text-gray-800 dark:text-night-text mb-2">۱. پذیرش قوانین</h2>
              <p className="text-xs text-gray-600 dark:text-night-muted/90">
                با ثبت‌نام و استفاده از سرویس‌های «داده کشت نوین»، شما تمامی شرایط و قوانین زیر را به طور کامل پذیرفته‌اید. در صورت عدم موافقت با هر یک از بندها، امکان استفاده از سرویس وجود ندارد.
              </p>
            </div>

            <div className="card shadow-glow">
              <h2 className="text-sm font-bold text-gray-800 dark:text-night-text mb-2">۲. ثبت‌نام و حساب کاربری</h2>
              <ul className="list-disc list-inside text-xs text-gray-600 dark:text-night-muted/90 space-y-1">
                <li>کاربر مسئول حفظ محرمانگی رمز عبور خود است.</li>
                <li>اطلاعات وارد شده در زمان ثبت‌نام باید صحیح و کامل باشد.</li>
                <li>هر کاربر تنها می‌تواند یک حساب کاربری داشته باشد.</li>
                <li>در صورت مشاهده هرگونه سوءاستفاده، حساب کاربری بدون هشدار قبلی مسدود خواهد شد.</li>
              </ul>
            </div>

            <div className="card shadow-glow">
              <h2 className="text-sm font-bold text-gray-800 dark:text-night-text mb-2">۳. خدمات و تعهدات</h2>
              <ul className="list-disc list-inside text-xs text-gray-600 dark:text-night-muted/90 space-y-1">
                <li>خدمات ارائه شده شامل مشاوره هوشمند کشاورزی، پایش ماهواره‌ای، پیش‌بینی آب‌وهوا و مدیریت مزارع است.</li>
                <li>توصیه‌های ارائه شده توسط هوش مصنوعی صرفاً جنبه مشاوره‌ای داشته و تصمیم نهایی بر عهده کاربر است.</li>
                <li>دقت داده‌های ماهواره‌ای و هواشناسی به عوامل مختلفی بستگی دارد و پلتفرم مسئولیتی در قبال خطاهای احتمالی ندارد.</li>
                <li>تلاش می‌شود سرویس‌ها با حداکثر در دسترس بودن ارائه شوند، اما پلتفرم تضمین ۱۰۰٪ uptime را نمی‌دهد.</li>
              </ul>
            </div>

            <div className="card shadow-glow">
              <h2 className="text-sm font-bold text-gray-800 dark:text-night-text mb-2">۴. طرح‌های اشتراک و پرداخت</h2>
              <p className="text-xs text-gray-600 dark:text-night-muted/90 mb-2">
                استفاده از امکانات پایه پلتفرم رایگان است. برای دسترسی به قابلیت‌های پیشرفته‌تر، طرح‌های اشتراک (BASIC، PREMIUM، ENTERPRISE) ارائه می‌شود.
              </p>
              <ul className="list-disc list-inside text-xs text-gray-600 dark:text-night-muted/90 space-y-1">
                <li>هزینه اشتراک‌ها مطابق تعرفه‌های اعلام شده در پنل کاربری محاسبه می‌شود.</li>
                <li>امکان بازگشت وجه پس از فعال‌سازی اشتراک وجود ندارد مگر در موارد خاص.</li>
                <li>پلتفرم مجاز به تغییر قیمت‌ها با اطلاع قبلی است.</li>
              </ul>
            </div>



            <div className="card shadow-glow">
              <h2 className="text-sm font-bold text-gray-800 dark:text-night-text mb-2">۵. محتوای تولید شده توسط کاربر</h2>
              <p className="text-xs text-gray-600 dark:text-night-muted/90">
                کاربران می‌توانند تصاویر، یادداشت‌ها و گزارش‌های خود را در پلتفرم ثبت کنند. مسئولیت قانونی محتوای بارگذاری شده بر عهده کاربر است و پلتفرم حق حذف محتوای نامناسب را دارد.
              </p>
            </div>

            <div className="card shadow-glow">
              <h2 className="text-sm font-bold text-gray-800 dark:text-night-text mb-2">۶. مالکیت فکری</h2>
              <p className="text-xs text-gray-600 dark:text-night-muted/90">
                تمامی حقوق مادی و معنوی پلتفرم «داده کشت نوین»، شامل طراحی، کد، الگوریتم‌های هوش مصنوعی و محتوای آموزشی، متعلق به این مجموعه است.
              </p>
            </div>

            <div className="card shadow-glow">
              <h2 className="text-sm font-bold text-gray-800 dark:text-night-text mb-2">۷. تغییرات در قوانین</h2>
              <p className="text-xs text-gray-600 dark:text-night-muted/90">
                این مجموعه حق تغییر قوانین را در هر زمان دارد. تغییرات از طریق پلتفرم به اطلاع کاربران می‌رسد و ادامه استفاده به منزله پذیرش قوانین جدید است.
              </p>
            </div>

            <div className="card shadow-glow">
              <h2 className="text-sm font-bold text-gray-800 dark:text-night-text mb-2 flex items-center gap-2">
                <Mail size={16} className="text-brand-green" /> تماس با ما
              </h2>
              <p className="text-xs text-gray-600 dark:text-night-muted/90 mb-1">
                برای هرگونه سوال، پیشنهاد یا شکایت می‌توانید از راه‌های زیر با ما در تماس باشید:
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-night-muted/90 mt-2">
                <Phone size={14} className="text-brand-green" /> ۰۲۱-۱۲۳۴۵۶۷۸
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-night-muted/90 mt-1">
                <Mail size={14} className="text-brand-green" /> support@dkn.ir
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="text-center mt-6 mb-8">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-brand-green hover:text-brand-green/80 transition-colors font-medium">
              <ArrowRight size={16} /> بازگشت به صفحه ورود
            </Link>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

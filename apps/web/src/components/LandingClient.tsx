'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sprout, Bot, Map, CloudSun, Droplets, Bug, Satellite, Bell, BarChart3, CheckCircle, ChevronDown, ChevronUp, Menu, X, ArrowRight } from 'lucide-react';

export default function LandingClient() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-white dark:from-night-bg dark:to-night-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 glass dark:bg-night-card/60 border-b border-green-100/50 dark:border-night-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2BB673, #22C55E)' }}>
                <Sprout className="text-white" size={18} />
              </div>
              <span className="font-bold text-gray-800 dark:text-night-text">داده کشت نوین</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-gray-600 dark:text-night-muted hover:text-brand-green transition">امکانات</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-night-muted hover:text-brand-green transition">روش کار</a>
              <a href="#about" className="text-sm font-medium text-gray-600 dark:text-night-muted hover:text-brand-green transition">درباره ما</a>
              <a href="#faq" className="text-sm font-medium text-gray-600 dark:text-night-muted hover:text-brand-green transition">سوالات متداول</a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth?mode=login" className="px-5 py-2 rounded-full text-sm font-bold text-brand-green hover:bg-green-50 dark:hover:bg-green-900/20 transition">ورود</Link>
              <Link href="/auth?mode=register" className="px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#2BB673] to-[#22C55E] shadow-lg shadow-green-500/20 hover:opacity-90 transition">ثبت‌نام رایگان</Link>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl glass">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-green-100/50 dark:border-night-border/40">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-night-text py-2">امکانات</a>
              <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-night-text py-2">روش کار</a>
              <a href="#about" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-night-text py-2">درباره ما</a>
              <a href="#faq" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-night-text py-2">سوالات متداول</a>
              <div className="flex gap-2 pt-2">
                <Link href="/auth?mode=login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-brand-green border border-green-200 dark:border-night-border">ورود</Link>
                <Link href="/auth?mode=register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#2BB673] to-[#22C55E]">ثبت‌نام رایگان</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-right">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                مدیریت هوشمند مزرعه با داده، هوش مصنوعی و پیش‌بینی دقیق
              </h1>
              <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-night-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
                داده کشت نوین به کشاورزان و مدیران مزارع کمک می‌کند وضعیت زمین، آب‌وهوا، آبیاری، آفات و توصیه‌های تخصصی را در یک پنل ساده و فارسی مدیریت کنند.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/auth?mode=register" className="px-8 py-3.5 rounded-full text-base font-bold text-white bg-gradient-to-r from-[#2BB673] to-[#22C55E] shadow-lg shadow-green-500/20 hover:opacity-90 transition text-center">
                  شروع رایگان
                </Link>
                <Link href="/auth?mode=login" className="px-8 py-3.5 rounded-full text-base font-bold text-brand-green border-2 border-brand-green/20 hover:bg-green-50 dark:hover:bg-green-900/20 transition text-center">
                  ورود به حساب
                </Link>
              </div>
              <p className="mt-4 text-xs text-gray-500 dark:text-night-muted">نسخه MVP برای پایش مزرعه، مشاوره هوشمند و تصمیم‌گیری سریع‌تر</p>
            </div>

            {/* Hero visual */}
            <div className="relative max-w-md mx-auto w-full">
              <div className="glass dark:bg-night-card/80 rounded-3xl p-6 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="card rounded-2xl p-4">
                    <div className="text-xs text-gray-500 dark:text-night-muted mb-1">سلامت مزرعه</div>
                    <div className="text-2xl font-bold text-brand-green">%۸۷</div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-night-border mt-2 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#2BB673] to-[#22C55E]" style={{ width: '87%' }} />
                    </div>
                  </div>
                  <div className="card rounded-2xl p-4">
                    <div className="text-xs text-gray-500 dark:text-night-muted mb-1">دما (امروز)</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-night-text">۲۴°C</div>
                    <div className="flex gap-1 mt-2">
                      {[60, 80, 95, 70, 85].map((h, i) => (
                        <div key={i} className="flex-1 rounded-lg bg-gray-100 dark:bg-night-border" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="card rounded-2xl p-4 col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-night-muted mb-1">توصیه هوش مصنوعی</div>
                        <div className="text-sm font-semibold text-gray-700 dark:text-night-text">آبیاری سیستم قطره‌ای زودتر از موعد</div>
                      </div>
                      <Bot className="text-brand-green" size={24} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-400/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-500/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">امکانات داده کشت نوین</h2>
            <p className="mt-3 text-gray-600 dark:text-night-muted">ابزارهای لازم برای مدیریت هوشمند مزرعه در یک پنل</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Bot, title: 'دستیار هوشمند کشاورزی', desc: 'مشاوره فارسی بر اساس اطلاعات مزرعه، محصول و شرایط آب‌وهوا' },
              { icon: Map, title: 'مدیریت مزارع', desc: 'ثبت زمین، محصول، مرز مزرعه، نوع خاک و روش آبیاری' },
              { icon: CloudSun, title: 'آب‌وهوا و پیش‌بینی', desc: 'نمایش وضعیت فعلی و پیش‌بینی چندروزه برای تصمیم‌گیری بهتر' },
              { icon: Droplets, title: 'برنامه‌ریزی آبیاری', desc: 'ثبت و پیگیری آبیاری و دریافت پیشنهادهای کاربردی' },
              { icon: Bug, title: 'گزارش آفات و بیماری‌ها', desc: 'ثبت گزارش، شدت، تصویر و پیگیری وضعیت هر مزرعه' },
              { icon: Satellite, title: 'داده‌های ماهواره‌ای و سلامت مزرعه', desc: 'مشاهده شاخص‌هایی مثل NDVI برای بررسی روند سلامت پوشش گیاهی' },
            ].map((feature, i) => (
              <div key={i} className="card p-6 rounded-2xl hover:shadow-glow transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-4 group-hover:bg-brand-green/10 transition">
                  <feature.icon className="text-brand-green" size={22} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-night-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-gradient-to-b from-transparent to-green-50/50 dark:to-night-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">روش کار</h2>
            <p className="mt-3 text-gray-600 dark:text-night-muted">سه مرحله ساده برای شروع مدیریت مزرعه</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '۱', title: 'مزرعه‌ات را ثبت کن', desc: 'موقعیت، محصول، خاک و روش آبیاری را وارد کن.' },
              { step: '۲', title: 'داده‌ها را یکجا ببین', desc: 'داشبورد وضعیت مزرعه، آب‌وهوا، هشدارها و شاخص‌های سلامت را نمایش می‌دهد.' },
              { step: '۳', title: 'تصمیم بهتر بگیر', desc: 'با کمک دستیار هوشمند و گزارش‌ها، سریع‌تر و دقیق‌تر اقدام کن.' },
            ].map((item, i) => (
              <div key={i} className="relative card p-8 rounded-2xl text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2BB673] to-[#22C55E] text-white font-bold text-xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/20">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-night-muted leading-relaxed">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -left-4 text-gray-300 dark:text-night-border">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-6">درباره داده کشت نوین</h2>
            <p className="text-gray-600 dark:text-night-muted leading-relaxed text-base">
              داده کشت نوین با هدف ساده‌تر کردن کشاورزی داده‌محور طراحی شده است؛ جایی که کشاورز، کارشناس و مدیر مزرعه بتوانند بدون پیچیدگی فنی، اطلاعات مهم زمین را ببینند، گزارش ثبت کنند و از پیشنهادهای هوشمند برای مدیریت بهتر مزرعه استفاده کنند.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-8 text-right">
              {['فارسی و قابل فهم', 'مناسب شرایط کشاورزی ایران', 'تمرکز روی تصمیم‌گیری عملی', 'قابل توسعه برای پلن‌های آینده'].map((val, i) => (
                <div key={i} className="flex items-center gap-3 card p-4 rounded-xl">
                  <CheckCircle className="text-brand-green flex-shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700 dark:text-night-text">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plans Teaser */}
      <section id="plans" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center glass p-8 sm:p-12 rounded-3xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4">شروع با پلن رایگان</h2>
            <p className="text-gray-600 dark:text-night-muted mb-8 leading-relaxed">
              در نسخه فعلی می‌توانید با پلن رایگان از امکانات پایه استفاده کنید. پلن‌های حرفه‌ای‌تر برای گزارش‌های پیشرفته، تحلیل‌های اختصاصی و امکانات سازمانی در نسخه‌های بعدی اضافه می‌شوند.
            </p>
            <Link href="/auth?mode=register" className="inline-block px-10 py-3.5 rounded-full text-base font-bold text-white bg-gradient-to-r from-[#2BB673] to-[#22C55E] shadow-lg shadow-green-500/20 hover:opacity-90 transition">
              ثبت‌نام رایگان
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 bg-gradient-to-b from-transparent to-green-50/50 dark:to-night-surface/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">سوالات متداول</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'آیا استفاده از داده کشت نوین نیاز به دانش فنی دارد؟', a: 'خیر، پنل به زبان فارسی و با مسیرهای ساده طراحی شده است.' },
              { q: 'آیا می‌توانم چند مزرعه ثبت کنم؟', a: 'بله، امکان مدیریت چند مزرعه در پنل وجود دارد.' },
              { q: 'آیا توصیه‌های هوش مصنوعی جایگزین کارشناس حضوری است؟', a: 'خیر، توصیه‌ها برای کمک به تصمیم‌گیری هستند و در موارد حساس باید با کارشناس محلی تطبیق داده شوند.' },
              { q: 'آیا نسخه رایگان فعال است؟', a: 'بله، در نسخه فعلی پلن رایگان برای شروع استفاده در نظر گرفته شده است.' },
            ].map((item, i) => (
              <div key={i} className="card rounded-2xl overflow-hidden">
                <button onClick={() => toggleFaq(i)} className="w-full flex items-center justify-between p-5 text-right">
                  <span className="font-bold text-gray-900 dark:text-white text-sm pr-2">{item.q}</span>
                  {openFaq === i ? <ChevronUp className="text-brand-green flex-shrink-0" size={20} /> : <ChevronDown className="text-gray-400 dark:text-night-muted flex-shrink-0" size={20} />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-gray-600 dark:text-night-muted leading-relaxed border-t border-gray-100 dark:border-night-border/40 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-night-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2BB673, #22C55E)' }}>
                  <Sprout className="text-white" size={16} />
                </div>
                <span className="font-bold text-gray-800 dark:text-night-text">داده کشت نوین</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-night-muted">هوش مصنوعی در خدمت کشاورزی</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/auth?mode=login" className="text-sm text-gray-600 dark:text-night-muted hover:text-brand-green transition">ورود</Link>
              <Link href="/auth?mode=register" className="text-sm text-gray-600 dark:text-night-muted hover:text-brand-green transition">ثبت‌نام</Link>
              <Link href="/auth?mode=login" className="text-sm text-gray-600 dark:text-night-muted hover:text-brand-green transition">داشبورد</Link>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-night-border/40 text-center">
            <p className="text-xs text-gray-400 dark:text-night-muted">&copy; داده کشت نوین — همه حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

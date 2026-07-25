'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sprout, Bot, Map, CloudSun, Droplets, Bug, Satellite,
  ChevronDown, ChevronUp, Menu, X, ArrowLeft, Sun, Moon,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '@/lib/theme';

function ThemeToggleInline() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-emerald-100 dark:bg-emerald-950/80 dark:border-emerald-900 flex items-center justify-center text-lg z-20 transition-all hover:scale-110"
      aria-label="toggle theme"
    >
      {theme === 'day' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

export default function LandingClient() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden bg-[#F6FBF7] text-slate-900 dark:bg-[#04130B] dark:text-slate-50">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-300/20 dark:bg-emerald-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-green-200/25 dark:bg-emerald-800/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-emerald-100 dark:bg-emerald-950/60 dark:border-emerald-900/60">
        <ThemeToggleInline />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-emblem-light.svg" alt="داده کشت نوین" className="h-10 w-auto shrink-0 object-contain select-none pointer-events-none dark:hidden" draggable={false} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-emblem-dark.svg" alt="داده کشت نوین" className="h-10 w-auto shrink-0 object-contain select-none pointer-events-none hidden dark:block" draggable={false} />
              <span className="font-extrabold text-gray-900 dark:text-white">داده کشت نوین</span>
            </Link>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">امکانات</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">روش کار</a>
              <a href="#about" className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">درباره ما</a>
              <a href="#faq" className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">سوالات متداول</a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth?mode=login" className="px-5 py-2 rounded-full text-sm font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition">ورود</Link>
              <Link href="/auth?mode=register" className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 transition-all">ثبت‌نام رایگان</Link>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 dark:bg-emerald-950/80 border border-emerald-100 dark:border-emerald-900">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-emerald-100 dark:border-emerald-900/60">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-slate-200 py-2">امکانات</a>
              <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-slate-200 py-2">روش کار</a>
              <a href="#about" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-slate-200 py-2">درباره ما</a>
              <a href="#faq" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-slate-200 py-2">سوالات متداول</a>
              <div className="flex gap-2 pt-2">
                <Link href="/auth?mode=login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">ورود</Link>
                <Link href="/auth?mode=register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600">ثبت‌نام رایگان</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-right">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                مدیریت هوشمند مزرعه با داده، هوش مصنوعی و پیش‌بینی دقیق
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                داده کشت نوین به کشاورزان و مدیران مزارع کمک می‌کند وضعیت زمین، آب‌وهوا، آبیاری، آفات و توصیه‌های تخصصی را در یک پنل ساده و فارسی مدیریت کنند.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/auth?mode=register" className="px-8 py-3.5 rounded-full text-base font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 transition-all text-center">
                  شروع رایگان
                </Link>
                <Link href="/auth?mode=login" className="px-8 py-3.5 rounded-full text-base font-bold text-emerald-700 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition text-center">
                  ورود به حساب
                </Link>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative max-w-md mx-auto w-full">
              <div className="bg-white/80 dark:bg-emerald-950/60 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 shadow-2xl shadow-emerald-950/10 border border-emerald-100 dark:border-emerald-900/60">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-emerald-900/30 rounded-2xl p-4 border border-emerald-50 dark:border-emerald-800/60">
                    <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">سلامت مزرعه</div>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">%۸۷</div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-emerald-800 mt-2 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600" style={{ width: '87%' }} />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-emerald-900/30 rounded-2xl p-4 border border-emerald-50 dark:border-emerald-800/60">
                    <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">دما (امروز)</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">۲۴°C</div>
                    <div className="flex gap-1 mt-2">
                      {[60, 80, 95, 70, 85].map((h, i) => (
                        <div key={i} className="flex-1 rounded-lg bg-gray-100 dark:bg-emerald-800" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 bg-white dark:bg-emerald-900/30 rounded-2xl p-4 border border-emerald-50 dark:border-emerald-800/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">توصیه هوش مصنوعی</div>
                        <div className="text-sm font-semibold text-gray-700 dark:text-slate-200">آبیاری سیستم قطره‌ای زودتر از موعد</div>
                      </div>
                      <Bot className="text-emerald-600 dark:text-emerald-400" size={24} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-300/30 dark:bg-emerald-600/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-300/30 dark:bg-emerald-600/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">امکانات داده کشت نوین</h2>
            <p className="mt-3 sm:mt-4 text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">ابزارهای لازم برای مدیریت هوشمند مزرعه در یک پنل</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              { icon: Bot, title: 'دستیار هوشمند کشاورزی', desc: 'مشاوره فارسی بر اساس اطلاعات مزرعه، محصول و شرایط آب‌وهوا' },
              { icon: Map, title: 'مدیریت مزارع', desc: 'ثبت زمین، محصول، مرز مزرعه، نوع خاک و روش آبیاری' },
              { icon: CloudSun, title: 'آب‌وهوا و پیش‌بینی', desc: 'نمایش وضعیت فعلی و پیش‌بینی چندروزه برای تصمیم‌گیری بهتر' },
              { icon: Droplets, title: 'برنامه‌ریزی آبیاری', desc: 'ثبت و پیگیری آبیاری و دریافت پیشنهادهای کاربردی' },
              { icon: Bug, title: 'گزارش آفات و بیماری‌ها', desc: 'ثبت گزارش، شدت، تصویر و پیگیری وضعیت هر مزرعه' },
              { icon: Satellite, title: 'داده‌های ماهواره‌ای و سلامت مزرعه', desc: 'مشاهده شاخص‌هایی مثل NDVI برای بررسی روند سلامت پوشش گیاهی' },
            ].map((feature, i) => (
              <div key={i} className="bg-white/80 dark:bg-emerald-950/60 backdrop-blur rounded-[1.5rem] p-6 sm:p-8 border border-emerald-100 dark:border-emerald-900/60 shadow-lg shadow-emerald-950/5 hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center mb-5">
                  <feature.icon className="text-emerald-600 dark:text-emerald-400" size={24} />
                </div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/30 dark:to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">روش کار</h2>
            <p className="mt-3 sm:mt-4 text-gray-600 dark:text-slate-300">سه مرحله ساده برای شروع مدیریت مزرعه</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '۱', title: 'مزرعه‌ات را ثبت کن', desc: 'موقعیت، محصول، خاک و روش آبیاری را وارد کن.' },
              { step: '۲', title: 'داده‌ها را یکجا ببین', desc: 'داشبورد وضعیت مزرعه، آب‌وهوا، هشدارها و شاخص‌های سلامت را نمایش می‌دهد.' },
              { step: '۳', title: 'تصمیم بهتر بگیر', desc: 'با کمک دستیار هوشمند و گزارش‌ها، سریع‌تر و دقیق‌تر اقدام کن.' },
            ].map((item, i) => (
              <div key={i} className="relative bg-white/80 dark:bg-emerald-950/60 backdrop-blur rounded-[1.5rem] p-8 border border-emerald-100 dark:border-emerald-900/60 shadow-lg text-center group hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20">
                  {item.step}
                </div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -left-4 text-emerald-200 dark:text-emerald-800">
                    <ArrowLeft size={24} />
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">درباره داده کشت نوین</h2>
            <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
              داده کشت نوین با هدف ساده‌تر کردن کشاورزی داده‌محور طراحی شده است؛ جایی که کشاورز، کارشناس و مدیر مزرعه بتوانند بدون پیچیدگی فنی، اطلاعات مهم زمین را ببینند، گزارش ثبت کنند و از پیشنهادهای هوشمند برای مدیریت بهتر مزرعه استفاده کنند.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-8 text-right">
              {['فارسی و قابل فهم', 'مناسب شرایط کشاورزی ایران', 'تمرکز روی تصمیم‌گیری عملی', 'قابل توسعه برای پلن‌های آینده'].map((val, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/80 dark:bg-emerald-950/60 backdrop-blur rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/60">
                  <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-200">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plans teaser */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4">پلن‌های اشتراک</h2>
            <p className="text-gray-600 dark:text-slate-300 mb-8">با پلن رایگان شروع کنید و در صورت نیاز به امکانات پیشرفته‌تر، یکی از طرح‌های مناسب را انتخاب کنید.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth?mode=register" className="px-8 py-3.5 rounded-full text-base font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 transition-all text-center">ثبت‌نام رایگان</Link>
              <Link href="/subscription" className="px-8 py-3.5 rounded-full text-base font-bold text-emerald-700 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition text-center">مشاهده پلن‌ها</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 bg-gradient-to-b from-transparent to-green-50/50 dark:to-night-surface/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">سوالات متداول</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'آیا استفاده از داده کشت نوین نیاز به دانش فنی دارد؟', a: 'خیر، پنل به زبان فارسی و با مسیرهای ساده طراحی شده است.' },
              { q: 'آیا می‌توانم چند مزرعه ثبت کنم؟', a: 'بله، امکان مدیریت چند مزرعه در پنل وجود دارد.' },
              { q: 'آیا توصیه‌های هوش مصنوعی جایگزین کارشناس حضوری است؟', a: 'خیر، توصیه‌ها برای کمک به تصمیم‌گیری هستند و در موارد حساس باید با کارشناس محلی تطبیق داده شوند.' },
              { q: 'آیا نسخه رایگان فعال است؟', a: 'بله، در نسخه فعلی پلن رایگان برای شروع استفاده در نظر گرفته شده است.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/80 dark:bg-emerald-950/60 backdrop-blur rounded-2xl border border-emerald-100 dark:border-emerald-900/60 overflow-hidden">
                <button onClick={() => toggleFaq(i)} className="w-full flex items-center justify-between p-5 text-right">
                  <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base pr-2">{item.q}</span>
                  {openFaq === i ? <ChevronUp className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" size={20} /> : <ChevronDown className="text-gray-400 dark:text-slate-500 flex-shrink-0" size={20} />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-gray-600 dark:text-slate-300 leading-relaxed border-t border-emerald-50 dark:border-emerald-900/60 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/faq" className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 dark:text-emerald-300 hover:underline">
              مشاهده همه سوالات <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-emerald-950/40 border-t border-emerald-100 dark:border-emerald-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/logo-emblem-light.svg" alt="داده کشت نوین" className="h-10 w-auto shrink-0 object-contain select-none pointer-events-none dark:hidden" draggable={false} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/logo-emblem-dark.svg" alt="داده کشت نوین" className="h-10 w-auto shrink-0 object-contain select-none pointer-events-none hidden dark:block" draggable={false} />
                <span className="font-extrabold text-gray-900 dark:text-white">داده کشت نوین</span>
              </Link>
              <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">هوش مصنوعی در خدمت کشاورزی</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">لینک‌های سریع</h4>
              <div className="space-y-2">
                <Link href="/auth?mode=login" className="block text-sm text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">ورود</Link>
                <Link href="/auth?mode=register" className="block text-sm text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">ثبت‌نام</Link>
                <Link href="/faq" className="block text-sm text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">سوالات متداول</Link>
                <Link href="/support/contact" className="block text-sm text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">تماس با پشتیبانی</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">محصول</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-sm text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">امکانات</a>
                <a href="#how-it-works" className="block text-sm text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">روش کار</a>
                <Link href="/subscription" className="block text-sm text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">اشتراک و پلن</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">قوانین</h4>
              <div className="space-y-2">
                <Link href="/terms" className="block text-sm text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">قوانین و مقررات</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-emerald-100 dark:border-emerald-900/60 text-center">
            <p className="text-xs text-gray-500 dark:text-slate-400">© {new Date().getFullYear()} داده کشت نوین. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

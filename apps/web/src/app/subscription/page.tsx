'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, Crown, Sparkles, Star, Zap, Sprout, Droplets, Satellite, Bug, Shield, Headphones, X } from 'lucide-react';
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

const PLANS = [
  {
    id: 'FREE',
    name: 'رایگان',
    desc: 'برای شروع و آشنایی با پلتفرم',
    price: '۰',
    unit: 'تومان / ماه',
    color: 'from-gray-400 to-gray-500',
    icon: Sprout,
    popular: false,
    features: [
      { text: 'ثبت تا ۲ مزرعه', ok: true },
      { text: 'داده‌های پایه هواشناسی', ok: true },
      { text: 'مشاوره AI (محدود)', ok: true },
      { text: 'گزارش‌های ساده', ok: true },
      { text: 'پایش ماهواره‌ای', ok: false },
      { text: 'تشخیص آفات با AI', ok: false },
      { text: 'پشتیبانی آنلاین', ok: false },
    ],
  },
  {
    id: 'BASIC',
    name: 'پایه',
    desc: 'برای کشاورزان حرفه‌ای',
    price: '۲۹۹,۰۰۰',
    unit: 'تومان / ماه',
    color: 'from-brand-green to-green-600',
    icon: Star,
    popular: true,
    features: [
      { text: 'ثبت تا ۱۰ مزرعه', ok: true },
      { text: 'داده‌های کامل هواشناسی', ok: true },
      { text: 'مشاوره AI نامحدود', ok: true },
      { text: 'گزارش‌های حرفه‌ای', ok: true },
      { text: 'پایش ماهواره‌ای (پایه)', ok: true },
      { text: 'تشخیص آفات با AI', ok: false },
      { text: 'پشتیبانی آنلاین', ok: true },
    ],
  },
  {
    id: 'PREMIUM',
    name: 'پیشرفته',
    desc: 'برای شرکت‌های کشاورزی',
    price: '۶۹۹,۰۰۰',
    unit: 'تومان / ماه',
    color: 'from-amber-500 to-orange-600',
    icon: Crown,
    popular: false,
    features: [
      { text: 'مزرعه نامحدود', ok: true },
      { text: 'داده‌های کامل + پیش‌بینی ۳۰ روزه', ok: true },
      { text: 'مشاوره AI نامحدود', ok: true },
      { text: 'گزارش‌های سفارشی', ok: true },
      { text: 'پایش ماهواره‌ای پیشرفته', ok: true },
      { text: 'تشخیص آفات با AI', ok: true },
      { text: 'پشتیبانی اختصاصی', ok: true },
    ],
  },
  {
    id: 'ENTERPRISE',
    name: 'سازمانی',
    desc: 'سفارشی برای سازمان‌های بزرگ',
    price: 'تماس بگیرید',
    unit: '',
    color: 'from-purple-500 to-purple-700',
    icon: Zap,
    popular: false,
    features: [
      { text: 'همه امکانات پیشرفته', ok: true },
      { text: 'API اختصاصی', ok: true },
      { text: 'داشبورد سفارشی', ok: true },
      { text: 'داده‌های چند منبع ماهواره‌ای', ok: true },
      { text: 'پشتیبانی ۲۴/۷', ok: true },
      { text: 'مشاوره حضوری', ok: true },
      { text: 'قرارداد سالانه', ok: true },
    ],
  },
];

export default function SubscriptionPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <ThemeProvider>
      <div className="min-h-screen px-4 py-6 transition-colors duration-300 dark:bg-night-bg">
        <ThemeToggleInline />
        <div className="max-w-[420px] mx-auto">
          <Link href="/profile" className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-night-muted mb-4 hover:text-brand-green transition-colors">
            <ArrowRight size={16} /> بازگشت
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Crown className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-800 dark:text-night-text">اشتراک و پلن</h1>
              <p className="text-xs text-gray-500 dark:text-night-muted">طرح مناسب خود را انتخاب کنید</p>
            </div>
          </div>

          <div className="space-y-4">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selected === plan.id;
              return (
                <div key={plan.id}
                  onClick={() => setSelected(plan.id)}
                  className={`card cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    isSelected ? 'ring-2 ring-brand-green shadow-glow-lg scale-[1.02]' : 'shadow-glow hover:shadow-glow-lg'
                  } ${plan.popular ? 'border-brand-green' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-1 -right-8 bg-brand-green text-white text-[8px] font-bold px-8 py-1 rotate-45">
                      محبوب‌ترین
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-night-text">{plan.name}</h3>
                        <p className="text-[10px] text-gray-500 dark:text-night-muted">{plan.desc}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-extrabold text-gray-800 dark:text-night-text">{plan.price}</div>
                      {plan.unit && <div className="text-[8px] text-gray-400">{plan.unit}</div>}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-night-border/50">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        {f.ok
                          ? <Check size={14} className="text-brand-green flex-shrink-0" />
                          : <X size={14} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />}
                        <span className={f.ok ? 'text-gray-700 dark:text-night-text/90' : 'text-gray-400 dark:text-night-muted/60'}>{f.text}</span>
                      </div>
                    ))}
                  </div>

                  {isSelected && (
                    plan.id === 'ENTERPRISE' ? (
                      <Link href="/support/contact?type=enterprise" className="btn-primary mt-4 flex items-center justify-center gap-2">
                        <Zap size={16} />
                        تماس با ما
                      </Link>
                    ) : (
                      <button className="btn-primary mt-4 flex items-center justify-center gap-2">
                        <Zap size={16} />
                        خرید اشتراک
                      </button>
                    )
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-gray-400 dark:text-night-muted/60 text-center mt-6 leading-relaxed">
            قیمت‌ها و امکانات ممکن است تغییر کنند. برای اطلاعات دقیق‌تر با پشتیبانی تماس بگیرید.
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}

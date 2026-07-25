'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, Mail, Send, ChevronDown } from 'lucide-react';
import { ThemeProvider, useTheme } from '@/lib/theme';
import { Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';

function ThemeToggleInline() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="absolute top-4 left-4 w-10 h-10 rounded-full glass dark:bg-night-card/80 dark:border-night-border/60 flex items-center justify-center text-lg z-20 transition-all hover:scale-110">
      {theme === 'day' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}

const REQUEST_TYPES = [
  { value: 'enterprise', label: 'پلن سازمانی' },
  { value: 'technical', label: 'پشتیبانی فنی' },
  { value: 'other', label: 'سایر' },
];

export default function SupportContactPage({ searchParams }: { searchParams?: { type?: string } }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState(searchParams?.type || '');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const entry = {
      name,
      phone,
      type,
      note,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('support_contacts') || '[]');
      existing.push(entry);
      localStorage.setItem('support_contacts', JSON.stringify(existing));
      toast.success('درخواست شما با موفقیت ثبت شد. تیم پشتیبانی به زودی با شما تماس خواهد گرفت.');
      setName('');
      setPhone('');
      setType(searchParams?.type || '');
      setNote('');
    } catch (err) {
      toast.error('خطا در ذخیره درخواست. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen px-4 py-6 transition-colors duration-300 dark:bg-night-bg">
        <ThemeToggleInline />
        <div className="max-w-[420px] mx-auto">
          <Link href="/profile" className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-night-muted mb-4 hover:text-brand-green transition-colors">
            <ArrowRight size={16} /> بازگشت
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Mail className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-800 dark:text-night-text">تماس با پشتیبانی</h1>
              <p className="text-xs text-gray-500 dark:text-night-muted">برای دریافت پلن سازمانی یا پشتیبانی اختصاصی، اطلاعات تماس خود را ارسال کنید.</p>
            </div>
          </div>

          <div className="card shadow-glow mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-night-text mb-2">
              <Phone size={16} className="text-brand-green" />
              ۰۲۱-۱۲۳۴۵۶۷۸
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-night-text">
              <Mail size={16} className="text-brand-green" />
              support@dkn.ir
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card shadow-glow space-y-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-night-muted mb-1 block">نام و نام خانوادگی</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="نام و نام خانوادگی" className="input-glass text-sm text-right" />
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-night-muted mb-1 block">شماره موبایل</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="۰۹۱۲۳۴۵۶۷۸۹" className="input-glass text-sm text-left" dir="ltr" />
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-night-muted mb-1 block">نوع درخواست</label>
              <div className="relative">
                <select value={type} onChange={(e) => setType(e.target.value)} required className="input-glass text-sm text-right appearance-none">
                  <option value="" disabled>نوع درخواست را انتخاب کنید</option>
                  {REQUEST_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-night-muted mb-1 block">توضیحات</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="/details..." className="input-glass text-sm text-right resize-none" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
              {loading ? <span className="animate-spin">...</span> : <Send size={18} />}
              {loading ? 'در حال ارسال...' : 'ارسال درخواست'}
            </button>
          </form>

          <p className="text-[10px] text-gray-400 dark:text-night-muted/60 text-center mt-4 leading-relaxed">
            اطلاعات شما در دستگاه شما ذخیره می‌شود و در نسخه بعدی به API متصل خواهد شد.
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}

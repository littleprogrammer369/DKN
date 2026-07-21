'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Send, Headphones, Clock, User, Bot, Loader2 } from 'lucide-react';
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

interface ChatMessage {
  role: 'user' | 'support';
  text: string;
  time: Date;
}

export default function SupportChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'support', text: 'سلام! به پشتیبانی آنلاین داده کشت نوین خوش آمدید. چطور می‌توانم به شما کمک کنم؟', time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const AUTO_REPLIES: Record<string, string> = {
    'سلام': 'سلام! خوش آمدید. چطور می‌توانم کمک کنم؟',
    'مشکل': 'لطفاً مشکل خود را با جزئیات توضیح دهید. تیم پشتیبانی در اسرع وقت بررسی خواهد کرد.',
    'اشتراک': 'برای اطلاعات درباره طرح‌های اشتراک به صفحه "اشتراک و پلن" در پروفایل مراجعه کنید.',
    'مزرعه': 'می‌توانید از منوی "زمین‌ها" مزرعه جدید ثبت کنید یا مزارع موجود را مدیریت کنید.',
    'تشکر': 'خواهش می‌کنم! همیشه در خدمت شما هستیم 😊',
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || typing) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text, time: new Date() }]);

    // Auto reply (temporary - will be replaced with real support)
    setTyping(true);
    setTimeout(() => {
      let reply = 'پیام شما ثبت شد. تیم پشتیبانی به زودی پاسخ خواهد داد.';
      for (const [key, val] of Object.entries(AUTO_REPLIES)) {
        if (text.includes(key)) { reply = val; break; }
      }
      setMessages(prev => [...prev, { role: 'support', text: reply, time: new Date() }]);
      setTyping(false);
    }, 1000);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen px-4 py-6 transition-colors duration-300 dark:bg-night-bg">
        <ThemeToggleInline />
        <div className="max-w-[420px] mx-auto flex flex-col h-[calc(100vh-3rem)]">
          <Link href="/profile" className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-night-muted mb-4 hover:text-brand-green transition-colors">
            <ArrowRight size={16} /> بازگشت
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <MessageCircle className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-800 dark:text-night-text">چت آنلاین</h1>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                آنلاین
              </p>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-1 mb-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    msg.role === 'user' ? 'bg-brand-green text-white' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  }`}>
                    {msg.role === 'user' ? <User size={14} /> : <Headphones size={14} />}
                  </div>
                  <div>
                    <div className={`text-xs px-3 py-2 rounded-2xl leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-brand-green text-white rounded-bl-sm'
                        : 'bg-white dark:bg-night-card border border-gray-100 dark:border-night-border/50 text-gray-700 dark:text-night-text/90 rounded-br-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`text-[8px] text-gray-400 mt-1 ${msg.role === 'user' ? 'text-left' : 'text-right'}`}>
                      {new Date(msg.time).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Headphones size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="bg-white dark:bg-night-card border border-gray-100 dark:border-night-border/50 rounded-2xl rounded-br-sm px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Info banner */}
          <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-night-muted/70 mb-2 bg-gray-50 dark:bg-night-surface rounded-lg px-3 py-2">
            <Clock size={12} />
            پاسخگویی در اسرع وقت انجام می‌شود (این نسخه اولیه چت است)
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="پیام خود را بنویسید..." className="input-glass flex-1 text-sm" />
            <button onClick={handleSend} disabled={!input.trim() || typing}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #2BB673, #22C55E)' }}>
              {typing ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

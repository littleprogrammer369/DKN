'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Send, Headphones, Clock, User, Loader2 } from 'lucide-react';
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
  id?: string;
  role: 'user' | 'support';
  text: string;
  time: Date;
}

async function api(token: string, path: string, init?: RequestInit) {
  const res = await fetch(`/api/v1${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'خطا در ارتباط با سرور');
  }
  return res.json();
}

export default function SupportChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const loadMessages = useCallback(async (cid: string) => {
    const data = await api(token!, `/support/conversations/${cid}/messages`);
    const mapped = (data || []).map((m: any) => ({
      id: m.id,
      role: m.senderRole === 'admin' ? 'support' : 'user',
      text: m.text,
      time: new Date(m.createdAt),
    }));
    setMessages(mapped);
  }, [token]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    (async () => {
      try {
        let conversations = await api(token, '/support/conversations');
        let conv = conversations.items?.[0];

        if (!conv) {
          conv = await api(token, '/support/conversations', {
            method: 'POST',
            body: JSON.stringify({ subject: 'چت آنلاین' }),
          });
        }

        if (!cancelled) {
          setConversationId(conv.id);
          await loadMessages(conv.id);
        }
      } catch (e) {
        const welcome: ChatMessage = {
          role: 'support',
          text: 'سلام! به پشتیبانی آنلاین داده کشت نوین خوش آمدید. چطور می‌توانم به شما کمک کنم؟',
          time: new Date(),
        };
        if (!cancelled) {
          setMessages([welcome]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, loadMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !conversationId || sending) return;

    const optimistic: ChatMessage = { role: 'user', text, time: new Date() };
    setMessages((prev) => [...prev, optimistic]);
    setInput('');
    setSending(true);

    try {
      const saved = await api(token!, `/support/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      setMessages((prev) =>
        prev.map((m) => (m === optimistic ? { ...m, id: saved.id, time: new Date(saved.createdAt) } : m)),
      );
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m !== optimistic));
      setInput(text);
    } finally {
      setSending(false);
    }
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

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-gray-400" size={24} />
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-3 pb-2">
                {messages.map((msg, i) => (
                  <div key={msg.id || i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                <div ref={chatEndRef} />
              </div>

              <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-night-muted/70 mb-2 bg-gray-50 dark:bg-night-surface rounded-lg px-3 py-2">
                <Clock size={12} />
                پیام‌های شما در پایگاه داده ذخیره می‌شود و تیم پشتیبانی به زودی پاسخ می‌دهد.
              </div>

              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="پیام خود را بنویسید..."
                  className="input-glass flex-1 text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #2BB673, #22C55E)' }}
                >
                  {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

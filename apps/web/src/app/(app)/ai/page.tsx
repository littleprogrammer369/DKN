'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Send, Sparkles, User, Bot, Loader2, Plus, History, Sprout, ChevronDown, Trash2, Calendar, MessageSquare } from 'lucide-react';
import { ChatInput } from '@/components/ChatInput';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from '@/lib/toast';

interface Message { role: 'user' | 'ai'; content: string; time?: Date; id?: string }

const WELCOME_MSG = 'سلام! من دستیار هوشمند مزرعه شما هستم. هر سوالی درباره کشاورزی، آبیاری، آفات یا مدیریت مزرعه داری بپرس.';

// Group messages into sessions (30 min gap = new session)
function groupIntoSessions(msgs: Message[]): Message[][] {
  if (msgs.length === 0) return [];
  const sessions: Message[][] = [];
  let current: Message[] = [msgs[0]];
  for (let i = 1; i < msgs.length; i++) {
    const prev = msgs[i - 1].time ? new Date(msgs[i - 1].time!).getTime() : 0;
    const curr = msgs[i].time ? new Date(msgs[i].time!).getTime() : 0;
    if (curr - prev > 30 * 60 * 1000) { sessions.push(current); current = []; }
    current.push(msgs[i]);
  }
  if (current.length > 0) sessions.push(current);
  return sessions;
}

function getSessionTitle(session: Message[]): string {
  const firstUser = session.find(m => m.role === 'user');
  return firstUser ? firstUser.content.slice(0, 40) + (firstUser.content.length > 40 ? '...' : '') : 'مکالمه جدید';
}

function getSessionDate(session: Message[]): string {
  const t = session[0]?.time;
  if (!t) return '';
  const d = new Date(t);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 24 * 60 * 60 * 1000) return 'امروز';
  if (diff < 48 * 60 * 60 * 1000) return 'دیروز';
  if (diff < 7 * 24 * 60 * 60 * 1000) return 'این هفته';
  return d.toLocaleDateString('fa-IR');
}

function AiChatInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const farmParam = searchParams.get('farm');
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<string>('');
  const [showFarmPicker, setShowFarmPicker] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [allHistory, setAllHistory] = useState<Message[]>([]);
  const [activeSessionIdx, setActiveSessionIdx] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const STORAGE_KEY = 'dkn-ai-chat';
  const STORAGE_ALL_KEY = 'dkn-ai-all-history';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }

    // Load farms
    fetch('/api/v1/farms', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
.then((d) => {
        const fl = Array.isArray(d) ? d : [];
        setFarms(fl);
        if (fl.length > 0) {
          if (farmParam && fl.some(f => f.id === farmParam)) {
            setSelectedFarm(farmParam);
          } else {
            setSelectedFarm(fl[0].id);
          }
        }
      })
      .catch(() => {});

    // Load history from server
    fetch('/api/v1/ai/history?limit=100', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then((history) => {
        if (Array.isArray(history) && history.length > 0) {
          const all: Message[] = history.reverse().map((h: any) => ({
            role: h.role as 'user' | 'ai', content: h.content, time: new Date(h.createdAt), id: h.id,
          }));
          setAllHistory(all);
          localStorage.setItem(STORAGE_ALL_KEY, JSON.stringify(all));
          // Show latest session
          const sessions = groupIntoSessions(all);
          if (sessions.length > 0) {
            setMessages(sessions[sessions.length - 1]);
            setActiveSessionIdx(sessions.length - 1);
          }
        } else {
          // Try localStorage
          const saved = localStorage.getItem(STORAGE_ALL_KEY);
          if (saved) {
            const all: Message[] = JSON.parse(saved);
            setAllHistory(all);
            const sessions = groupIntoSessions(all);
            if (sessions.length > 0) { setMessages(sessions[sessions.length - 1]); setActiveSessionIdx(sessions.length - 1); }
          }
        }
        setLoadingHistory(false);
      })
      .catch(() => {
        const saved = localStorage.getItem(STORAGE_ALL_KEY);
        if (saved) {
          const all: Message[] = JSON.parse(saved);
          setAllHistory(all);
          const sessions = groupIntoSessions(all);
          if (sessions.length > 0) { setMessages(sessions[sessions.length - 1]); setActiveSessionIdx(sessions.length - 1); }
        }
        setLoadingHistory(false);
      });
  }, [router]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Update allHistory with current messages
      setAllHistory(prev => {
        const updated = [...prev];
        const sessions = groupIntoSessions(updated);
        // Replace the active session
        sessions[activeSessionIdx] = messages;
        const flat = sessions.flat();
        localStorage.setItem(STORAGE_ALL_KEY, JSON.stringify(flat));
        return flat;
      });
    }
  }, [messages]);

  const switchToSession = (idx: number) => {
    const sessions = groupIntoSessions(allHistory);
    if (sessions[idx]) {
      setMessages(sessions[idx]);
      setActiveSessionIdx(idx);
      setShowHistory(false);
    }
  };

  const startNewChat = () => {
    const welcome: Message[] = [{ role: 'ai', content: WELCOME_MSG, time: new Date() }];
    setAllHistory(prev => [...prev, ...welcome]);
    setMessages(welcome);
    setActiveSessionIdx(groupIntoSessions([...allHistory, ...welcome]).length - 1);
    toast.success('چت جدید شروع شد');
  };

  const clearHistory = async () => {
    if (!confirm('آیا تاریخچه همه چت‌ها پاک شود؟')) return;
    const token = localStorage.getItem('token');
    try { await fetch('/api/v1/ai/history', { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } }); } catch {}
    setAllHistory([]);
    const welcome: Message[] = [{ role: 'ai', content: WELCOME_MSG, time: new Date() }];
    setMessages(welcome);
    setActiveSessionIdx(0);
    localStorage.removeItem(STORAGE_ALL_KEY);
    toast.success('تاریخچه پاک شد');
  };

  const callAI = async (userMessage: string): Promise<string> => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ message: userMessage, farmId: selectedFarm || undefined }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || 'خطا در ارتباط با سرور');
      return d.response || d.reply || d.message || '⚠️ پاسخی دریافت نشد';
    } catch (err: any) {
      return '⚠️ سرویس موقتاً در دسترس نیست. لطفاً دوباره تلاش کنید.';
    }
  };

  const handleSend = async (message: string) => {
    if (!message.trim() || typing) return;
    setMessages(prev => [...prev, { role: 'user', content: message, time: new Date() }]);
    setTyping(true);
    const reply = await callAI(message);
    setTyping(false);
    setMessages(prev => [...prev, { role: 'ai', content: reply, time: new Date() }]);
  };

  const sessions = groupIntoSessions(allHistory);

  if (loadingHistory) {
    return <div className="flex flex-col h-full"><div className="mb-4"><p className="text-xs text-gray-500 dark:text-night-muted">دستیار هوشمند</p><h1 className="text-lg font-extrabold text-gray-800 dark:text-night-text">از AI بپرس</h1></div><div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-brand-green" size={32} /></div></div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-night-muted">دستیار هوشمند</p>
          <h1 className="text-lg font-extrabold text-gray-800 dark:text-night-text">از AI بپرس</h1>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowHistory(!showHistory)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${showHistory ? 'bg-brand-green text-white' : 'bg-gray-100 dark:bg-night-surface text-gray-500 hover:bg-gray-200 dark:hover:bg-night-border'}`} title="تاریخچه">
            <History size={18} />
          </button>
          <button onClick={startNewChat} className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-brand-green hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors" title="چت جدید">
            <Plus size={18} />
          </button>
          <button onClick={clearHistory} className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors" title="پاک کردن همه">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* History Dropdown Panel */}
      {showHistory && (
        <div className="card shadow-glow mb-3 max-h-60 overflow-y-auto">
          <div className="flex items-center justify-between mb-2 sticky top-0 bg-white dark:bg-night-card z-10 pb-2 border-b border-gray-100 dark:border-night-border/50">
            <h3 className="text-xs font-bold text-gray-600 dark:text-night-muted flex items-center gap-1"><History size={14} /> تاریخچه مکالمات</h3>
            <span className="text-[9px] text-gray-400">{sessions.length} مکالمه</span>
          </div>
          {sessions.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">مکالمه‌ای وجود ندارد</p>
          ) : (
            <div className="space-y-0.5">
              {[...sessions].reverse().map((session, ri) => {
                const idx = sessions.length - 1 - ri;
                return (
                  <button key={idx} onClick={() => switchToSession(idx)}
                    className={`w-full text-right p-2 rounded-lg text-xs transition-colors flex items-start gap-2 ${
                      idx === activeSessionIdx ? 'bg-green-50 dark:bg-green-900/20 text-brand-green' : 'hover:bg-gray-50 dark:hover:bg-night-surface text-gray-700 dark:text-night-text'
                    }`}>
                    <MessageSquare size={14} className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{getSessionTitle(session)}</div>
                      <div className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <Calendar size={9} /> {getSessionDate(session)} · {session.length} پیام
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Farm Selector */}
      {farms.length > 0 && (
        <div className="relative mb-3">
          <button onClick={() => setShowFarmPicker(!showFarmPicker)}
            className="w-full flex items-center justify-between bg-white dark:bg-night-card border border-gray-200 dark:border-night-border rounded-xl px-3 py-2 text-xs text-gray-700 dark:text-night-text hover:border-brand-green transition-colors">
            <div className="flex items-center gap-2"><Sprout size={14} className="text-brand-green" /><span>{farms.find(f => f.id === selectedFarm)?.name || 'انتخاب مزرعه'}</span></div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {showFarmPicker && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-night-card border border-gray-200 dark:border-night-border rounded-xl shadow-xl z-10 overflow-hidden">
              {farms.map((farm: any) => (
                <button key={farm.id} onClick={() => { setSelectedFarm(farm.id); setShowFarmPicker(false); }}
                  className={`w-full text-right px-3 py-2.5 text-xs hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center gap-2 ${selectedFarm === farm.id ? 'bg-green-50 dark:bg-green-900/20 text-brand-green font-bold' : 'text-gray-700 dark:text-night-text'}`}>
                  <Sprout size={14} /> {farm.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-1 mb-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'ai' ? '' : 'flex-row-reverse'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'ai' ? 'bg-brand-green text-white' : 'bg-gray-100 dark:bg-night-surface text-gray-600 dark:text-night-muted'}`}>
              {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={`max-w-[85%] ${msg.role === 'ai' ? '' : 'items-end flex flex-col'}`}>
              {msg.time && <div className={`text-[9px] text-gray-400 mb-0.5 ${msg.role === 'ai' ? 'text-right' : 'text-left'}`}>{new Date(msg.time).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</div>}
              <div className={`text-sm leading-relaxed px-3.5 py-2.5 rounded-2xl ${msg.role === 'ai' ? 'bg-white dark:bg-night-card border border-gray-100 dark:border-night-border/50 text-gray-800 dark:text-night-text rounded-br-sm' : 'bg-brand-green text-white rounded-bl-sm'}`}>
                {msg.role === 'ai' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                    p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc list-inside my-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside my-1">{children}</ol>,
                    code: ({ children }) => <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">{children}</code>,
                  }}>{msg.content}</ReactMarkdown>
                ) : msg.content}
              </div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0"><Bot size={16} className="text-white" /></div>
            <div className="bg-white dark:bg-night-card border border-gray-100 dark:border-night-border/50 rounded-2xl rounded-br-sm px-4 py-3">
              <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:'0ms'}}/><div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:'150ms'}}/><div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:'300ms'}}/></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {['آبیاری گندم', 'آفات رایج', 'کوددهی', 'پیش‌بینی وضعیت'].map(s => (
            <button key={s} onClick={() => handleSend(s)}
              className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-night-surface text-gray-600 dark:text-night-muted hover:bg-brand-green/10 hover:text-brand-green border border-gray-200 dark:border-night-border/50 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input */}
      <ChatInput onSend={handleSend} disabled={typing} placeholder="سوال خود را بپرسید..." />
    </div>
);
}

export default function AiChatPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-10"><p className="text-gray-400 dark:text-night-muted">در حال بارگذاری…</p></div>}>
      <AiChatInner />
    </Suspense>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Sparkles, User, Bot, Loader2, Copy, Check, Plus, History, Sprout, ChevronDown, Trash2, MessageSquare, RefreshCw } from 'lucide-react';
import { ChatInput } from '@/components/ChatInput';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from '@/lib/toast';

interface Message { role: 'user' | 'ai'; content: string; time?: Date; id?: string }

const WELCOME_MSG = 'سلام! من دستیار هوشمند مزرعه شما هستم. هر سوالی درباره کشاورزی، آبیاری، آفات یا مدیریت مزرعه داری بپرس.';

export default function AiChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<string>('');
  const [showFarmPicker, setShowFarmPicker] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const STORAGE_KEY = 'dkn-ai-chat';

  // Load chat history from server + localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }

    // Load saved messages from localStorage first (offline cache)
    const saved = localStorage.getItem(STORAGE_KEY);
    let initialMessages: Message[] = saved ? JSON.parse(saved) : [{ role: 'ai', content: WELCOME_MSG, time: new Date() }];

    // Load farms
    fetch('/api/v1/farms', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then((d) => {
        const fl = Array.isArray(d) ? d : [];
        setFarms(fl);
        if (fl.length > 0) setSelectedFarm(fl[0].id);
      })
      .catch(() => {});

    // Try to load history from server
    fetch('/api/v1/ai/history?limit=50', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then((history) => {
        if (Array.isArray(history) && history.length > 0) {
          // Convert server history to messages format
          const serverMessages: Message[] = history
            .reverse()
            .map((h: any) => ({
              role: h.role as 'user' | 'ai',
              content: h.content,
              time: new Date(h.createdAt),
              id: h.id,
            }));
          setMessages(serverMessages);
          // Save to localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverMessages));
        } else {
          setMessages(initialMessages);
        }
        setLoadingHistory(false);
      })
      .catch(() => {
        // If server fails, use localStorage (offline mode)
        setMessages(initialMessages);
        setLoadingHistory(false);
      });
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Auto-save to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const startNewChat = async () => {
    const welcome = [{ role: 'ai', content: WELCOME_MSG, time: new Date() }] as Message[];
    setMessages(welcome);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(welcome));
    toast.success('چت جدید شروع شد');
  };

  const clearHistory = async () => {
    if (!confirm('آیا تاریخچه چت پاک شود؟')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch('/api/v1/ai/history', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
    } catch {}
    const welcome = [{ role: 'ai', content: WELCOME_MSG, time: new Date() }] as Message[];
    setMessages(welcome);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(welcome));
    toast.success('تاریخچه پاک شد');
  };

  const callAI = async (userMessage: string): Promise<string> => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({
          message: userMessage,
          farmId: selectedFarm || undefined,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || 'خطا در ارتباط با سرور');
      return d.response || d.reply || d.message || 'پاسخی دریافت نشد';
    } catch (err: any) {
      return '⚠️ در حال حاضر دستیار هوشمند در دسترس نیست. لطفاً دوباره تلاش کنید.\n\n**خطا:** ' + (err.message || 'مشکل اتصال');
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

  if (loadingHistory) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-night-muted">دستیار هوشمند</p>
          <h1 className="text-lg font-extrabold text-gray-800 dark:text-night-text">از AI بپرس</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-brand-green" size={32} />
        </div>
      </div>
    );
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
          <button onClick={startNewChat} className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-brand-green hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors" title="چت جدید">
            <Plus size={18} />
          </button>
          <button onClick={clearHistory} className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors" title="پاک کردن تاریخچه">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Farm Selector */}
      {farms.length > 0 && (
        <div className="relative mb-3">
          <button onClick={() => setShowFarmPicker(!showFarmPicker)}
            className="w-full flex items-center justify-between bg-white dark:bg-night-card border border-gray-200 dark:border-night-border rounded-xl px-3 py-2 text-xs text-gray-700 dark:text-night-text hover:border-brand-green transition-colors">
            <div className="flex items-center gap-2">
              <Sprout size={14} className="text-brand-green" />
              <span>{farms.find(f => f.id === selectedFarm)?.name || 'انتخاب مزرعه'}</span>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {showFarmPicker && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-night-card border border-gray-200 dark:border-night-border rounded-xl shadow-xl z-10 overflow-hidden">
              {farms.map((farm: any) => (
                <button key={farm.id} onClick={() => { setSelectedFarm(farm.id); setShowFarmPicker(false); }}
                  className={`w-full text-right px-3 py-2.5 text-xs hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center gap-2 ${
                    selectedFarm === farm.id ? 'bg-green-50 dark:bg-green-900/20 text-brand-green font-bold' : 'text-gray-700 dark:text-night-text'
                  }`}>
                  <Sprout size={14} />
                  {farm.name} <span className="text-gray-400 text-[9px]">({farm.city || 'بدون شهر'})</span>
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
              msg.role === 'ai' ? 'bg-brand-green text-white' : 'bg-gray-100 dark:bg-night-surface text-gray-600 dark:text-night-muted'
            }`}>
              {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={`max-w-[85%] ${msg.role === 'ai' ? '' : 'items-end flex flex-col'}`}>
              {msg.time && (
                <div className={`text-[9px] text-gray-400 mb-0.5 ${msg.role === 'ai' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.time).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
              <div className={`text-sm leading-relaxed px-3.5 py-2.5 rounded-2xl ${
                msg.role === 'ai'
                  ? 'bg-white dark:bg-night-card border border-gray-100 dark:border-night-border/50 text-gray-800 dark:text-night-text rounded-br-sm'
                  : 'bg-brand-green text-white rounded-bl-sm'
              }`}>
                {msg.role === 'ai' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                    p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc list-inside my-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside my-1">{children}</ol>,
                    li: ({ children }) => <li>{children}</li>,
                    code: ({ children }) => <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">{children}</code>,
                  }}>
                    {msg.content}
                  </ReactMarkdown>
                ) : msg.content}
              </div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white dark:bg-night-card border border-gray-100 dark:border-night-border/50 rounded-2xl rounded-br-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {['آبیاری گندم', 'آفات رایج', 'کوددهی', 'پیش‌بینی وضعیت'].map(s => (
            <button key={s} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-night-surface text-gray-600 dark:text-night-muted hover:bg-brand-green/10 hover:text-brand-green border border-gray-200 dark:border-night-border/50 transition-all"
              onClick={() => handleSend(s)}>
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

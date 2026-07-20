'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, Copy, Check, Plus, History, AlertTriangle, Sprout } from 'lucide-react';
import { ChatInput } from '@/components/ChatInput';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message { role: 'user' | 'ai'; content: string; time?: Date }

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'سلام! من دستیار هوشمند مزرعه شما هستم. هر سوالی درباره کشاورزی داری بپرس.' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [chatId, setChatId] = useState(Date.now());
  const startNewChat = () => { setMessages([{ role: 'ai', content: 'Hello! I am your smart farm assistant. Ask me anything about farming! \ud83c\udf3e' }]); setChatId(Date.now()); };
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const callAI = async (userMessage: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ message: userMessage }),
      });
      if (!res.ok) throw new Error('API error');
      const d = await res.json();
      // برای backward compatibility با سرور جدید
      return d.response || d.reply || d.message || 'پاسخی دریافت نشد';
    } catch {
      return '<AlertTriangle size={14} className="inline" /> در حال حاضر دستیار هوشمند در دسترس نیست. لطفاً دوباره تلاش کنید.';
    }
  };

  const handleSend = async () => {
    const q = input.trim();
    if (!q || typing) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q, time: new Date() }]);
    setTyping(true);
    const reply = await callAI(q);
    setTyping(false);
    setMessages(prev => [...prev, { role: 'ai', content: reply, time: new Date() }]);
  };

  const suggestions = ['آبیاری گندم', 'آفات رایج', 'کوددهی', 'پیش‌بینی وضعیت'];

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-night-muted">دستیار هوشمند</p>
        <h1 className="text-lg font-extrabold text-gray-800 dark:text-night-text">از AI بپرس</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-1 mb-3">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'ai' ? 'msg-ai' : 'msg-user'}>
            {msg.role === 'ai' ? (
              <>
                <div className="avatar-ai"><Bot size={16} /></div>
                <div className="bubble-ai text-sm leading-relaxed">
                  {msg.time && <div className="text-[9px] text-gray-400 mb-1 text-left">{new Date(msg.time).toLocaleTimeString('fa-IR', {hour:'2-digit',minute:'2-digit'})}</div>}
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{p:({children})=><p className="mb-1 last:mb-0">{children}</p>,strong:({children})=><strong className="font-bold">{children}</strong>,ul:({children})=><ul className="list-disc list-inside my-1">{children}</ul>,ol:({children})=><ol className="list-decimal list-inside my-1">{children}</ol>,li:({children})=><li>{children}</li>,code:({children})=><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">{children}</code>}}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </>
            ) : (
              <>
                <div className="bubble-user">
              {msg.time && <div className="text-[9px] text-gray-400 mt-1 text-right">{new Date(msg.time).toLocaleTimeString('fa-IR', {hour:'2-digit',minute:'2-digit'})}</div>}{msg.content}</div>
                <div className="avatar-user"><User size={16} /></div>
              </>
            )}
          </div>
        ))}
        {typing && (
          <div className="msg-ai">
            <div className="avatar-ai">✦</div>
            <div className="bubble-ai">
                <div className="flex gap-1 py-1"><div className="dot"/><div className="dot"/><div className="dot"/></div></div>
          </div>
        )}
        <div ref={chatEndRef}/>
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        {suggestions.map(s => (
          <button key={s} className="chip text-xs" onClick={() => setInput(s)}>{s}</button>
        ))}
      </div>

      <div className="flex gap-2 mb-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="سوال خود را بپرسید..." className="input-glass flex-1"/>
        <button onClick={handleSend} disabled={!input.trim() || typing}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #2BB673, #22C55E)' }}><Send size={18} /></button>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';

interface Message { role: 'user' | 'ai'; content: string }

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'سلام! من دستیار هوشمند مزرعه شما هستم. هر سوالی درباره کشاورزی داری بپرس. 🌾' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
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
      return d.reply || d.message || 'پاسخی دریافت نشد';
    } catch {
      return '⚠️ در حال حاضر دستیار هوشمند در دسترس نیست. لطفاً دوباره تلاش کنید.';
    }
  };

  const handleSend = async () => {
    const q = input.trim();
    if (!q || typing) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setTyping(true);
    const reply = await callAI(q);
    setTyping(false);
    setMessages(prev => [...prev, { role: 'ai', content: reply }]);
  };

  const suggestions = ['آبیاری گندم', 'آفات رایج', 'کوددهی', 'زمان برداشت', 'پیش‌بینی وضعیت'];

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
                <div className="avatar-ai">✦</div>
                <div className="bubble-ai">{msg.content.split('\\n').map((line,j,a) => <span key={j}>{line}{j<a.length-1 && <br/>}</span>)}</div>
              </>
            ) : (
              <>
                <div className="bubble-user">{msg.content}</div>
                <div className="avatar-user">👤</div>
              </>
            )}
          </div>
        ))}
        {typing && (
          <div className="msg-ai">
            <div className="avatar-ai">✦</div>
            <div className="bubble-ai"><div className="flex gap-1 py-1"><div className="dot"/><div className="dot"/><div className="dot"/></div></div>
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
          style={{ background: 'linear-gradient(135deg, #2BB673, #22C55E)' }}>➤</button>
      </div>
    </div>
  );
}

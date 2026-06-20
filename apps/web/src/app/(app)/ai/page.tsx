'use client';

import { useState, useRef, useEffect } from 'react';

const aiResponses: Record<string, string> = {
  'بیماری': "براساس تحلیل داده‌های محیطی:\n\n🦠 ریسک بیماری قارچی: ۵۸٪ (متوسط)\n🌡️ دلیل: رطوبت بالا در ۳ روز گذشته\n\n✅ توصیه: استفاده از قارچکش پیشگیرانه در ۴۸ ساعت آینده پیشنهاد می‌شود.",
  'کود': "بر اساس تحلیل خاک مزرعه:\n\n🌱 نیتروژن: کمبود متوسط → ۵۰ kg/ha اوره\n⚡ فسفر: وضعیت مطلوب\n🔵 پتاسیم: کمبود خفیف → ۲۰ kg/ha کلرید پتاسیم\n\nبهترین زمان کوددهی: ۳ روز آینده قبل از بارش.",
  'ndvi': "شاخص NDVI مزرعه شما:\n\n📊 میانگین NDVI: 0.82 (وضعیت عالی)\n🟢 ۸۲٪ مزرعه در وضعیت سالم\n🟡 ۶٪ مزرعه نیاز به توجه دارد\n\nتصاویر ماهواره‌ای ۳ روز پیش دریافت شده.",
  'برداشت': "بر اساس مرحله رشد گندم شما:\n\n📅 تاریخ تقریبی برداشت: ۳۵ روز دیگر\n🌡️ پیش‌بینی دما: مناسب\n💧 نیاز آبیاری: ۲ بار دیگر\n\nتوصیه می‌شود ۱ هفته قبل از برداشت آبیاری متوقف شود.",
  'آبیاری': "توصیه آبیاری بر اساس داده‌های فعلی:\n\n💧 رطوبت خاک: ۶۵٪ (کمتر از حد بهینه)\n🌡️ دمای فعلی: ۳۱°C\n🌙 پیش‌بینی شب: ۱۹°C\n\nبهترین زمان: امشب ساعت ۲۱:۰۰\nمیزان آب توصیه‌شده: ۴.۵ لیتر در متر مربع",
};

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'سلام! من دستیار هوشمند مزرعه شما هستم. هر سوالی دارید بپرسید. 🌾' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const getAIResponse = (q: string): string => {
    const ql = q.toLowerCase();
    for (const [key, val] of Object.entries(aiResponses)) {
      if (ql.includes(key.toLowerCase())) return val;
    }
    return 'بر اساس داده‌های مزرعه شما تحلیل شد. توصیه می‌کنم برنامه منظم پایش هفتگی داشته باشید.';
  };

  const handleSend = () => {
    const q = input.trim();
    if (!q || typing) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'ai', content: getAIResponse(q) }]);
    }, 1200 + Math.random() * 600);
  };

  const suggestionChips = ['وضعیت بیماری', 'توصیه کود', 'تحلیل NDVI', 'پیش‌بینی برداشت', 'برنامه آبیاری'];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <p className="text-xs text-gray-500">دستیار هوشمند</p>
        <h1 className="text-lg font-extrabold text-gray-800">از AI بپرس</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-1 mb-3">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'ai' ? 'msg-ai' : 'msg-user'}>
            {msg.role === 'ai' ? (
              <>
                <div className="avatar-ai">✦</div>
                <div className="bubble-ai">
                  {msg.content.split('\n').map((line, j) => (
                    <span key={j}>
                      {line}{j < msg.content.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
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
            <div className="bubble-ai">
              <div className="flex gap-1 py-1">
                <div className="dot" /><div className="dot" /><div className="dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        {suggestionChips.map((chip) => (
          <button key={chip} className="chip text-xs" onClick={() => { setInput(chip); }}>
            {chip}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="سوال خود را بپرسید..."
          className="input-glass flex-1"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || typing}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #2BB673, #22C55E)' }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

# 🤖 پرامپت Cline — اصلاح UI صفحه AI Assistant (دستیار)

> **این پرامپت را در Cline CLI اجرا کنید.**

---

## 📋 پرامپت اصلی

```
وظیفه: اصلاح ۱۲ مشکل UI در صفحه AI Assistant (apps/web/src/components/screens/ai-chat-screen.tsx).

## Context
- پروژه: DKN
- Frontend: Next.js 14 + Tailwind + TypeScript
- فایل هدف: ai-chat-screen.tsx
- کامپوننت جدید: apps/web/src/components/layout/chat-input.tsx
- کتابخانه: lucide-react, framer-motion, react-markdown

## ❌ مشکلات P0 (بحرانی)

### P0-AI۱: contrast در شب
**راه‌حل:**
```tsx
// در globals.css:
.dark {
  --text-secondary: rgba(255, 255, 255, 0.85);
  --text-tertiary: rgba(255, 255, 255, 0.65);
}

// پیام‌های bot:
<div className="
  bg-bg-elevated dark:bg-blue-900/20
  text-text-primary dark:text-blue-100
  border border-border
  rounded-2xl p-3
">
  {/* محتوا */}
</div>
```

### P0-AI۲: ChatInput ثابت بالای Footer
**راه‌حل:**
```tsx
// apps/web/src/components/layout/chat-input.tsx (جدید)
'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, Mic, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = 'پیامت رو بنویس...' }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!value.trim() || sending) return;
    const message = value.trim();
    setValue('');
    setSending(true);
    try {
      await onSend(message);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  };

  return (
    // sticky بالای bottom-nav (که ۶۴px ارتفاع داره)
    <div className="sticky bottom-16 left-0 right-0 z-20 p-3 bg-gradient-to-t from-bg-base via-bg-base to-transparent">
      <div className="max-w-2xl mx-auto">
        <div className="
          bg-bg-elevated 
          border border-border 
          rounded-2xl 
          shadow-glow
          flex items-end gap-1 
          p-2
        ">
          <button
            type="button"
            className="p-2 text-text-secondary hover:text-primary transition-colors flex-shrink-0"
            aria-label="پیوست فایل"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || sending}
            rows={1}
            className="
              flex-1 bg-transparent border-0 outline-none resize-none
              text-text-primary placeholder:text-text-secondary
              px-2 py-2 max-h-32
              text-sm
            "
            style={{ minHeight: '40px' }}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!value.trim() || sending}
            className="
              p-2 rounded-full 
              bg-primary text-white 
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-primary/90 hover:scale-105
              transition-all
              flex-shrink-0
            "
            aria-label="ارسال"
          >
            {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// استفاده در ai-chat-screen.tsx:
import { ChatInput } from '@/components/layout/chat-input';

<ChatInput onSend={handleSendMessage} />
```

### P0-AI۳: رفع typo "کندم" → "گندم"
```tsx
// در همه جا:
// "آبیاری کندم" → "آبیاری گندم"
// "برنامه آبیاری کندم" → "برنامه آبیاری گندم"
// "نیاز آبی کندم" → "نیاز آبی گندم"
```

### P0-AI۴: ایکون lucide
```tsx
// همه ایموجی:
// ✨ → <Sparkles />
// 🌾 → <Wheat /> یا <Sprout />
// 🤖 → <Bot />
// 💧 → <Droplet />
// 🐛 → <Bug />
// 🌱 → <Sprout />
```

## 🟡 مشکلات P1 (مهم)

### P1-AI۵: Glow effect
```tsx
// همه کارت‌ها:
className="bg-bg-elevated border border-border rounded-2xl shadow-glow"
```

### P1-AI۶: Welcome Card با Avatar
```tsx
import { Sparkles, Bot } from 'lucide-react';

function WelcomeCard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="
        w-20 h-20 rounded-2xl 
        bg-gradient-to-br from-primary to-primary/60
        flex items-center justify-center
        shadow-glow-lg
        mb-4
      ">
        <Bot className="text-white" size={40} />
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-2">
        سلام! من دستیار کشاورزی‌ات هستم
      </h2>
      <p className="text-text-secondary text-center max-w-md mb-8">
        هر سوالی درباره کشاورزی داری از من بپرس. می‌تونم درباره آبیاری، کوددهی، آفات و برداشت کمکت کنم.
      </p>

      {/* Suggested prompts */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => handleSendMessage(prompt.text)}
            className="
              bg-bg-elevated border border-border
              rounded-2xl p-4
              hover:shadow-glow-lg hover:scale-[1.02]
              transition-all
              text-right
            "
          >
            <prompt.icon className="text-primary mb-2" size={24} />
            <p className="font-medium text-text-primary text-sm">{prompt.title}</p>
            <p className="text-xs text-text-secondary mt-1">{prompt.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

const SUGGESTED_PROMPTS = [
  { id: 'irrigation', icon: Droplet, title: 'آبیاری گندم', description: 'بهترین زمان و مقدار' },
  { id: 'pest', icon: Bug, title: 'آفات رایج', description: 'شناسایی و درمان' },
  { id: 'fertilizer', icon: Sprout, title: 'کوددهی', description: 'نوع و زمان مناسب' },
  { id: 'weather', icon: Cloud, title: 'وضعیت آب و هوا', description: 'پیش‌بینی ۷ روز آینده' },
];
```

### P1-AI۷: Typing Indicator
```tsx
function TypingIndicator() {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
        <Bot className="text-primary" size={16} />
      </div>
      <div className="bg-bg-elevated border border-border rounded-2xl px-4 py-3 flex gap-1">
        <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

// استفاده:
{isStreaming && <TypingIndicator />}
```

### P1-AI۸: Streaming Response
```tsx
async function streamChatResponse(prompt: string, onChunk: (text: string) => void) {
  const response = await fetch('/api/v1/ai/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: prompt }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
}

// در screen:
const handleSendMessage = async (message: string) => {
  // اضافه کردن پیام user
  // فراخوانی streamChatResponse با onChunk
  // آپدیت پیام bot به صورت incremental
};
```

### P1-AI۹: Markdown Rendering
```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MessageContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        code: ({ children }) => <code className="bg-bg-base px-1 rounded text-sm">{children}</code>,
        pre: ({ children }) => <pre className="bg-bg-base p-3 rounded-lg overflow-x-auto text-xs">{children}</pre>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

## 🟢 مشکلات P2 (اختیاری)

### P2-AI۱۰: Timestamps
```tsx
function MessageTimestamp({ createdAt }: { createdAt: Date }) {
  const time = new Date(createdAt).toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return <span className="text-xs text-text-tertiary mt-1">{time}</span>;
}
```

### P2-AI۱۱: New Chat Button
```tsx
import { Plus, History } from 'lucide-react';

<div className="flex items-center justify-between p-4 border-b border-border">
  <div>
    <h1 className="text-lg font-semibold">از AI بپرس</h1>
    <p className="text-sm text-text-secondary">دستیار هوشمند</p>
  </div>
  <div className="flex gap-2">
    <button onClick={() => setShowHistory(true)} className="p-2 rounded-lg hover:bg-bg-elevated">
      <History size={20} />
    </button>
    <button onClick={startNewChat} className="p-2 rounded-lg bg-primary text-white">
      <Plus size={20} />
    </button>
  </div>
</div>
```

### P2-AI۱۲: Copy Button
```tsx
import { Copy, Check } from 'lucide-react';

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-text-secondary hover:text-primary"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}
```

## 🔧 دستورالعمل کلی

1. **نصب:** `pnpm --filter web add react-markdown remark-gfm`
2. **ساخت ChatInput component** در layout
3. **استفاده از fetch streaming** با ReadableStream
4. **همه ایموجی lucide**

## ✅ معیار پذیرش

- [ ] در شب، متن‌ها خوانا
- [ ] ChatInput ثابت بالای footer
- [ ] typo "کندم" رفع
- [ ] همه ایموجی lucide
- [ ] Glow effect
- [ ] Welcome card با avatar
- [ ] Typing indicator
- [ ] Streaming response
- [ ] Markdown render
- [ ] Timestamps (اختیاری)
- [ ] New chat button (اختیاری)
- [ ] Copy button (اختیاری)
- [ ] Build بدون خطا

## 📝 خروجی

- Branch: `fix/ui-ai-assistant`
- Commit: `fix(ui): اصلاح ۱۲ مشکل AI Assistant`
- PR
```

---

## 📂 فایل‌های تحت تغییر

| فایل | تغییرات |
|------|---------|
| `ai-chat-screen.tsx` | همه ۱۲ مشکل |
| `chat-input.tsx` (جدید) | کامپوننت ورودی چت |
| `globals.css` | contrast در dark |
| `package.json` | react-markdown, remark-gfm |
```

---

**🚀 این پرامپت را مستقیم به Cline بده!**

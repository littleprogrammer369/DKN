'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

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
    try { await onSend(message); } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 p-3 bg-gradient-to-t from-white dark:from-night-bg via-white/90 dark:via-night-bg/90 to-transparent">
      <div className="bg-white dark:bg-night-card border border-gray-200 dark:border-night-border rounded-2xl shadow-glow flex items-end gap-1 p-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => { setValue(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || sending}
          rows={1}
          className="flex-1 bg-transparent border-0 outline-none resize-none text-gray-800 dark:text-night-text placeholder:text-gray-400 dark:placeholder:text-night-muted px-2 py-2 max-h-32 text-sm"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim() || sending}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #2BB673, #22C55E)' }}
        >
          {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}

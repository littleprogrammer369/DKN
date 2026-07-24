'use client';
import { useState, useRef, useEffect, useLayoutEffect, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { Send, Sparkles, User, Bot, Loader2, Plus, History, Trash2, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from '@/lib/toast';
import Dropdown from '@/components/Dropdown';
import { fa } from '@/lib/jalali';

interface Message { role: 'user' | 'ai'; content: string; time?: Date; id?: string; model?: string; latency?: number; fallback?: boolean; }
const WELCOME = `سلام! 👋 من دستیار هوشمند «داده کشت نوین» هستم. هر سوالی دربارهٔ آبیاری، کوددهی، آفات، هوا، برداشت یا تصاویر ماهواره‌ای داری بپرس — با توجه به اطلاعات مزرعه‌ات پاسخ می‌دم.`;
const SUGGESTIONS = ['الان نیاز به آبیاری دارم؟', 'آفات رایج این فصل و درمانشان', 'برنامه کوددهی پیشنهاد بده', 'پیش‌بینی هوای ۵ روز آینده', 'زمان مناسب برداشت کی است؟', 'وضعیت سلامت مزرعه (NDVI) چطور است؟'];

function groupIntoSessions(msgs: Message[]): Message[][] {
  if (!msgs.length) return [];
  const s: Message[][] = [[msgs[0]]];
  for (let i = 1; i < msgs.length; i++) {
    const prev = msgs[i-1].time ? new Date(msgs[i-1].time!).getTime() : 0;
    const curr = msgs[i].time ? new Date(msgs[i].time!).getTime() : 0;
    if (curr - prev > 30*60*1000) s.push([]);
    s[s.length-1].push(msgs[i]);
  }
  return s;
}
const sTitle = (s: Message[]) => { const u = s.find(m => m.role === 'user'); return u ? u.content.slice(0,32) + (u.content.length>32?'…':'') : 'مکالمه جدید'; };
const sWhen = (s: Message[]) => { const t = s[0]?.time; if (!t) return ''; const d = new Date(t), diff = Date.now()-d.getTime(); if (diff<864e5) return 'امروز'; if (diff<1728e5) return 'دیروز'; return d.toLocaleDateString('fa-IR'); };
const TypingDots = () => (<div className="flex gap-1 items-center px-1">{[0,150,300].map(d => <span key={d} className="w-2 h-2 rounded-full bg-brand-green/70 animate-bounce" style={{ animationDelay: d+'ms' }}/>)}</div>);

function AiChatInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const farmParam = sp.get('farm'); const q = sp.get('q');
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarm, setSelectedFarm] = useState('');
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [allHistory, setAllHistory] = useState<Message[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const endRef = useRef<HTMLDivElement>(null); const taRef = useRef<HTMLTextAreaElement>(null);
  const autoRef = useRef(false); const ALL = 'dkn-ai-all-history';
  const histBtnRef = useRef<HTMLButtonElement>(null);
  const histPanelRef = useRef<HTMLDivElement>(null);
  const [histPos, setHistPos] = useState<{ top: number; left: number } | null>(null);
  const H = () => ({ Authorization: 'Bearer ' + (localStorage.getItem('token') || '') });

  useEffect(() => {
    const token = localStorage.getItem('token'); if (!token) { router.push('/'); return; }
    fetch('/api/v1/farms', { headers: H() }).then(r => r.json()).then((d:any) => {
      const fl = Array.isArray(d)?d:[]; setFarms(fl);
      if (fl.length) setSelectedFarm((farmParam && fl.some((f:any)=>f.id===farmParam)) ? farmParam : fl[0].id);
    }).catch(()=>{});
    fetch('/api/v1/ai/history?limit=100', { headers: H() }).then(r => r.json()).then((h:any) => {
      let all: Message[] = [];
      if (Array.isArray(h) && h.length) all = h.reverse().map((x:any)=>({ role:x.role, content:x.content, time:new Date(x.createdAt), id:x.id }));
      else { try { const s = localStorage.getItem(ALL); if (s) all = JSON.parse(s); } catch {} }
      setAllHistory(all);
      const sess = groupIntoSessions(all);
      if (sess.length) { setMessages(sess[sess.length-1]); setActiveIdx(sess.length-1); }
      else setMessages([{ role:'ai', content: WELCOME, time:new Date() }]);
      setLoadingHistory(false);
    }).catch(()=>{ setMessages([{ role:'ai', content: WELCOME, time:new Date() }]); setLoadingHistory(false); });
  }, [router, farmParam]);

  const callAI = async (text: string) => {
    try {
      const res = await fetch('/api/v1/ai/chat', { method:'POST', headers:{ ...H(), 'Content-Type':'application/json' }, body: JSON.stringify({ message:text, farmId: selectedFarm || undefined }) });
      const d = await res.json(); if (!res.ok) throw new Error(d.message || 'خطا');
      const model = d.model || '';
      const fallback = ['fallback','config-error','offline','rate-limited','error'].includes(model);
      return { text: d.response || d.reply || '⚠️ پاسخی دریافت نشد.', model, latency: d.latency, fallback };
    } catch { return { text:'⚠️ سرویس هوش مصنوعی در دسترس نیست. لطفاً دوباره تلاش کنید.', model:'error', fallback:true }; }
  };
  const handleSend = async (raw?: string) => {
    const message = (raw ?? input).trim(); if (!message || typing) return;
    setInput(''); if (taRef.current) taRef.current.style.height = 'auto';
    setMessages(p => [...p, { role:'user', content:message, time:new Date() }]); setTyping(true);
    const r = await callAI(message); setTyping(false);
    setMessages(p => [...p, { role:'ai', content:r.text, time:new Date(), model:r.model, latency:r.latency, fallback:r.fallback }]);
  };

  useEffect(() => { if (!loadingHistory && q === 'irrigation' && !autoRef.current && messages.length <= 1) { autoRef.current = true; handleSend('بهترین زمان و مقدار آبیاری برای این مزرعه را با توجه به هوا پیشنهاد بده.'); } }, [loadingHistory, q]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, typing]);
  useEffect(() => { if (messages.length) setAllHistory(prev => { const u=[...prev]; const s=groupIntoSessions(u); s[activeIdx]=messages; const flat=s.flat(); try{localStorage.setItem(ALL, JSON.stringify(flat));}catch{} return flat; }); }, [messages]);

  useLayoutEffect(() => {
    if (!showHistory || !histPanelRef.current || !histPos) return;
    const ph = histPanelRef.current.offsetHeight, pw = histPanelRef.current.offsetWidth;
    let { top, left } = histPos;
    if (top + ph > window.innerHeight - 8) { const r = histBtnRef.current?.getBoundingClientRect(); if (r) top = Math.max(8, r.top - ph - 6); }
    if (left + pw > window.innerWidth - 8) left = Math.max(8, window.innerWidth - pw - 8);
    if (left < 8) left = 8;
    if (top !== histPos.top || left !== histPos.left) setHistPos({ top, left });
  }, [showHistory, histPos]);
  useEffect(() => {
    if (!showHistory) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowHistory(false); };
    const onScroll = (e: Event) => { if (histPanelRef.current && e.target instanceof Node && histPanelRef.current.contains(e.target)) return; setShowHistory(false); };
    const onResize = () => setShowHistory(false);
    window.addEventListener('keydown', onKey); window.addEventListener('scroll', onScroll, true); window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', onResize); };
  }, [showHistory]);

  const newChat = () => { const w=[{ role:'ai', content:WELCOME, time:new Date() } as Message]; setAllHistory(p=>[...p,...w]); setMessages(w); setActiveIdx(groupIntoSessions([...allHistory,...w]).length-1); setShowHistory(false); toast.success('گفتگوی جدید'); };
  const clearAll = async () => { if(!confirm('همهٔ تاریخچه پاک شود؟')) return; try{ await fetch('/api/v1/ai/history',{method:'DELETE',headers:H()}); }catch{} setAllHistory([]); const w=[{role:'ai',content:WELCOME,time:new Date()} as Message]; setMessages(w); setActiveIdx(0); localStorage.removeItem(ALL); toast.success('تاریخچه پاک شد'); setShowHistory(false); };
  const switchS = (i:number) => { const s=groupIntoSessions(allHistory); if(s[i]){ setMessages(s[i]); setActiveIdx(i); setShowHistory(false);} };
  const toggleHistory = () => {
    if (!showHistory) { const r = histBtnRef.current?.getBoundingClientRect(); if (r) setHistPos({ top: r.bottom + 6, left: r.left }); }
    setShowHistory(o => !o);
  };

  const sessions = groupIntoSessions(allHistory);
  const farmName = farms.find((f:any)=>f.id===selectedFarm)?.name;
  const showChips = messages.filter(m=>m.role==='user').length === 0;
  const grow = (e: React.ChangeEvent<HTMLTextAreaElement>) => { setInput(e.target.value); const el=e.target; el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,128)+'px'; };
  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  if (loadingHistory) return (<div className="flex flex-col items-center justify-center h-[60vh] gap-2 text-gray-500 dark:text-night-muted"><Loader2 className="animate-spin text-brand-green"/><span>در حال بارگذاری دستیار…</span></div>);

  return (
    <div className="flex flex-col h-[calc(100dvh-9rem)] max-h-[820px] min-h-[420px]">
      <div className="card p-3 mb-3 flex items-center justify-between gap-3">
        <div className="text-right min-w-0">
          <div className="font-extrabold text-gray-900 dark:text-white flex items-center justify-end gap-1"><Sparkles size={16} className="text-brand-green"/>دستیار هوشمند</div>
          <div className="text-xs text-gray-500 dark:text-night-muted truncate">{farmName ? `مشاوره برای: ${farmName}` : 'مزرعه‌ای انتخاب نشده'}</div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={newChat} title="گفتگوی جدید" className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 text-brand-green"><Plus size={18}/></button>
          <div className="relative">
            <button ref={histBtnRef} onClick={toggleHistory} title="تاریخچه" className={`w-9 h-9 rounded-xl flex items-center justify-center ${showHistory?'bg-brand-green text-white':'bg-white/5 hover:bg-white/10 text-gray-400'}`}><History size={18}/></button>
            {showHistory && histPos && createPortal((<>
              <div className="fixed inset-0 z-[110]" onClick={()=>setShowHistory(false)}/>
              <div ref={histPanelRef} style={{ position:'fixed', top:histPos.top, left:histPos.left }} className="z-[120] w-72 max-h-80 overflow-y-auto rounded-xl card p-2 space-y-1 text-right">
                {sessions.length===0 ? <div className="text-xs text-gray-500 p-2">تاریخچه‌ای نیست</div> : sessions.map((s,i)=>(
                  <button key={i} onClick={()=>switchS(i)} className={`w-full text-right rounded-lg px-3 py-2 text-sm ${i===activeIdx?'bg-brand-green/10 text-brand-green':'hover:bg-white/5'}`}>
                    <div className="font-bold truncate">{sTitle(s)}</div><div className="text-[11px] text-gray-500">{sWhen(s)}</div>
                  </button>))}
                <button onClick={clearAll} className="w-full text-right rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-1 justify-end"><Trash2 size={14}/>پاک کردن همه</button>
              </div>
            </>), document.body)}
          </div>
          <button onClick={clearAll} title="پاک کردن گفتگو" className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 hover:bg-red-500/15 text-red-400"><Trash2 size={18}/></button>
        </div>
      </div>

      {farms.length > 1 && <div className="mb-3"><Dropdown value={selectedFarm} onChange={v=>setSelectedFarm(String(v))} options={farms.map((f:any)=>({value:f.id,label:f.name}))} placeholder="انتخاب مزرعه"/></div>}

      <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-2">
        {messages.map((m,i)=> m.role==='user' ? (
          <div key={i} className="flex justify-end gap-2">
            <div className="max-w-[80%] bg-brand-green text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm whitespace-pre-wrap">{m.content}</div>
            <div className="w-8 h-8 rounded-full bg-brand-green/15 text-brand-green flex items-center justify-center shrink-0"><User size={16}/></div>
          </div>
        ) : (
          <div key={i} className="flex justify-start gap-2">
            <div className="w-8 h-8 rounded-full bg-white/5 text-brand-green flex items-center justify-center shrink-0"><Bot size={16}/></div>
            <div className={`max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm ${m.fallback?'bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300':'card'}`}>
              {m.fallback && <div className="flex items-center gap-1 text-xs font-bold mb-1"><AlertTriangle size={13}/>توجه</div>}
              <div className="ai-md text-right leading-7"><ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown></div>
              {!m.fallback && m.model && <div className="text-[10px] text-gray-400 mt-1 text-left">{m.model}{m.latency!=null?` · ${fa(m.latency)}ms`:''}</div>}
            </div>
          </div>
        ))}
        {typing && (<div className="flex justify-start gap-2"><div className="w-8 h-8 rounded-full bg-white/5 text-brand-green flex items-center justify-center shrink-0"><Bot size={16}/></div><div className="card rounded-2xl rounded-tl-sm px-4 py-3"><TypingDots/></div></div>)}
        <div ref={endRef}/>
      </div>

      {showChips && (<div className="flex flex-wrap gap-2 my-2 justify-end">{SUGGESTIONS.map(s=>(<button key={s} onClick={()=>handleSend(s)} className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-brand-green/50 text-gray-600 dark:text-night-muted">{s}</button>))}</div>)}

      <div className="card p-2 mt-2 flex items-end gap-2">
        <button onClick={()=>handleSend()} disabled={!input.trim()||typing} className="shrink-0 w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center disabled:opacity-40">{typing?<Loader2 size={18} className="animate-spin"/>:<Send size={18}/>}</button>
        <textarea ref={taRef} value={input} onChange={grow} onKeyDown={onKey} rows={1} placeholder="سوال خود را بپرسید…" className="flex-1 resize-none bg-transparent outline-none text-right text-sm py-2 px-1 max-h-32 text-gray-900 dark:text-white placeholder:text-gray-400"/>
      </div>
    </div>
  );
}
export default function AiPage(){ return <Suspense fallback={<div className="p-6 text-center text-gray-500"><Loader2 className="animate-spin mx-auto"/></div>}><AiChatInner/></Suspense>; }

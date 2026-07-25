'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Users, MessageCircle, FileText, LayoutDashboard, Loader2, ChevronLeft, Send, RefreshCw } from 'lucide-react';
import { ThemeProvider, useTheme } from '@/lib/theme';
import { Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';

function ThemeToggleInline() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="absolute top-4 left-4 w-10 h-10 rounded-full glass dark:bg-night-card/80 dark:border-night-border/60 flex items-center justify-center text-lg z-20 transition-all hover:scale-110">
      {theme === 'day' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}

type Tab = 'dashboard' | 'users' | 'support' | 'landing';

async function api(token: string, path: string, init?: RequestInit) {
  const res = await fetch(`/api/v1${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });

  if (res.status === 403) {
    throw new Error('شما دسترسی مدیریت ندارید.');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'خطا در ارتباط با سرور');
  }
  return res.json();
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const [landing, setLanding] = useState<any>(null);
  const [landingForm, setLandingForm] = useState<any>(null);
  const [landingSaving, setLandingSaving] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const localUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  const refreshOverview = async () => {
    if (!token) return;
    const data = await api(token, '/admin/overview');
    setOverview(data);
  };

  const refreshUsers = async () => {
    if (!token) return;
    const params = new URLSearchParams({ page: '1', limit: '20' });
    if (userSearch.trim()) params.set('search', userSearch.trim());
    const data = await api(token, `/admin/users?${params.toString()}`);
    setUsers(data.items || []);
    setUsersTotal(data.total || 0);
  };

  const refreshConversations = async () => {
    if (!token) return;
    const data = await api(token, '/admin/support/conversations');
    setConversations(data || []);
  };

  const refreshLanding = async () => {
    if (!token) return;
    const data = await api(token, '/admin/landing-content');
    setLanding(data);
    setLandingForm(data || {});
  };

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        await refreshOverview();
      } catch (e) {
        console.error(e);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (tab === 'users') {
      refreshUsers();
    } else if (tab === 'support') {
      refreshConversations();
    } else if (tab === 'landing') {
      refreshLanding();
    }
  }, [tab]);

  const loadUserDetail = async (id: string) => {
    try {
      const data = await api(token!, `/admin/users/${id}`);
      setSelectedUser(data);
    } catch (e: any) {
      toast.error(e.message || 'خطا در بارگذاری جزئیات کاربر');
    }
  };

  const loadConversationMessages = async (id: string) => {
    try {
      const data = await api(token!, `/admin/support/conversations/${id}/messages`);
      const mapped = (data || []).map((m: any) => ({
        id: m.id,
        senderRole: m.senderRole,
        text: m.text,
        time: new Date(m.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      }));
      setConversationMessages(mapped);
      setSelectedConversation((prev: any) => (prev ? { ...prev, id } : prev));
    } catch (e: any) {
      toast.error(e.message || 'خطا در بارگذاری پیام‌ها');
    }
  };

  const sendAdminReply = async () => {
    if (!replyText.trim() || !selectedConversation?.id) return;
    setReplyLoading(true);
    try {
      const saved = await api(token!, `/admin/support/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text: replyText.trim() }),
      });
      setConversationMessages((prev) => [
        ...prev,
        {
          id: saved.id,
          senderRole: 'admin',
          text: saved.text,
          time: new Date(saved.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setReplyText('');
      refreshConversations();
    } catch (e: any) {
      toast.error(e.message || 'خطا در ارسال پاسخ');
    } finally {
      setReplyLoading(false);
    }
  };

  const saveLanding = async () => {
    setLandingSaving(true);
    try {
      const data = await api(token!, '/admin/landing-content', {
        method: 'PUT',
        body: JSON.stringify(landingForm),
      });
      setLanding(data);
      setLandingForm(data);
      toast.success('محتوای لندینگ ذخیره شد');
    } catch (e: any) {
      toast.error(e.message || 'خطا در ذخیره');
    } finally {
      setLandingSaving(false);
    }
  };

  const isAdmin = localUser?.role === 'ADMIN';

  if (!token || !isAdmin) {
    return (
      <ThemeProvider>
        <div className="min-h-screen px-4 py-6 transition-colors duration-300 dark:bg-night-bg">
          <ThemeToggleInline />
          <div className="max-w-[420px] mx-auto text-center mt-20">
            <h1 className="text-xl font-extrabold text-gray-800 dark:text-night-text mb-2">شما دسترسی مدیریت ندارید</h1>
            <p className="text-sm text-gray-500 dark:text-night-muted mb-4">برای دسترسی به این بخش نیاز به نقش مدیریتی دارید.</p>
            <Link href="/profile" className="inline-flex items-center gap-1 text-sm text-brand-green hover:text-brand-green/80 transition-colors">
              <ArrowRight size={16} /> بازگشت به پروفایل
            </Link>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen px-4 py-6 transition-colors duration-300 dark:bg-night-bg">
        <ThemeToggleInline />
        <div className="max-w-[420px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-extrabold text-gray-800 dark:text-night-text">داشبورد مدیریت</h1>
            <button onClick={refreshOverview} className="text-brand-green"><RefreshCw size={18} /></button>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {([
              { key: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
              { key: 'users', label: 'کاربران', icon: Users },
              { key: 'support', label: 'پشتیبانی', icon: MessageCircle },
              { key: 'landing', label: 'لندینگ', icon: FileText },
            ] as { key: Tab; label: string; icon: any }[]).map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  tab === item.key ? 'bg-brand-green text-white' : 'bg-white dark:bg-night-card text-gray-600 dark:text-night-text border border-gray-100 dark:border-night-border/50'
                }`}
              >
                <item.icon size={14} /> {item.label}
              </button>
            ))}
          </div>

          {tab === 'dashboard' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="card shadow-glow">
                  <div className="text-xs text-gray-500 dark:text-night-muted">کاربران</div>
                  <div className="text-lg font-extrabold text-gray-800 dark:text-night-text">{overview?.totalUsers ?? '--'}</div>
                </div>
                <div className="card shadow-glow">
                  <div className="text-xs text-gray-500 dark:text-night-muted">مزارع</div>
                  <div className="text-lg font-extrabold text-gray-800 dark:text-night-text">{overview?.totalFarms ?? '--'}</div>
                </div>
                <div className="card shadow-glow">
                  <div className="text-xs text-gray-500 dark:text-night-muted">چت‌های باز</div>
                  <div className="text-lg font-extrabold text-gray-800 dark:text-night-text">{overview?.openSupportChats ?? '--'}</div>
                </div>
                <div className="card shadow-glow">
                  <div className="text-xs text-gray-500 dark:text-night-muted">گزارش آفات</div>
                  <div className="text-lg font-extrabold text-gray-800 dark:text-night-text">{overview?.totalPestReports ?? '--'}</div>
                </div>
              </div>
              <div className="card shadow-glow">
                <div className="text-xs text-gray-500 dark:text-night-muted mb-1">ثبت‌های آبیاری</div>
                <div className="text-lg font-extrabold text-gray-800 dark:text-night-text">{overview?.totalIrrigationRecords ?? '--'}</div>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="space-y-3">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="جستجوی کاربر..."
                className="input-glass text-sm text-right"
              />
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="card shadow-glow flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-gray-800 dark:text-night-text">{u.firstName} {u.lastName || ''}</div>
                      <div className="text-xs text-gray-500 dark:text-night-muted">{u.phone}</div>
                      <div className="text-[10px] text-gray-400">{u.role} · {u.plan}</div>
                    </div>
                    <button onClick={() => loadUserDetail(u.id)} className="text-brand-green text-xs">
                      جزئیات
                    </button>
                  </div>
                ))}
              </div>

              {selectedUser && (
                <div className="card shadow-glow space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-night-text">جزئیات کاربر</h3>
                    <button onClick={() => setSelectedUser(null)} className="text-gray-400"><ChevronLeft size={16} /></button>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-night-text space-y-1">
                    <p>نام: {selectedUser.firstName} {selectedUser.lastName || ''}</p>
                    <p>شماره: {selectedUser.phone}</p>
                    <p>نقش: {selectedUser.role}</p>
                    <p>پلن: {selectedUser.plan}</p>
                    <p>مزارع: {selectedUser.farmsCount}</p>
                  </div>
                  {selectedUser.farms?.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-gray-700 dark:text-night-text mb-1">مزارع</div>
                      {selectedUser.farms.map((f: any) => (
                        <div key={f.id} className="text-xs text-gray-600 dark:text-night-text border-b border-gray-100 dark:border-night-border/50 py-1">
                          {f.name} · {f.product}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === 'support' && (
            <div className="space-y-2">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => loadConversationMessages(c.id)}
                  className="card shadow-glow flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-sm font-bold text-gray-800 dark:text-night-text">
                      {c.user?.firstName} {c.user?.lastName || ''}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-night-muted">{c.user?.phone}</div>
                    <div className="text-[10px] text-gray-400">{c.status} · {c._count?.messages || 0} پیام</div>
                  </div>
                  <ChevronLeft size={16} className="text-gray-400" />
                </div>
              ))}

              {selectedConversation && (
                <div className="card shadow-glow space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-night-text">پیام‌ها</h3>
                    <button onClick={() => { setSelectedConversation(null); setConversationMessages([]); }}>
                      <ChevronLeft size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {conversationMessages.map((m) => (
                      <div key={m.id} className={`flex ${m.senderRole === 'admin' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`text-xs px-3 py-2 rounded-2xl max-w-[80%] ${
                          m.senderRole === 'admin'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-night-text rounded-br-sm'
                            : 'bg-brand-green text-white rounded-bl-sm'
                        }`}>
                          <p>{m.text}</p>
                          <div className={`text-[8px] mt-1 ${m.senderRole === 'admin' ? 'text-right' : 'text-left'}`}>{m.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendAdminReply()}
                      placeholder="پاسخ به کاربر..."
                      className="input-glass flex-1 text-sm"
                    />
                    <button onClick={sendAdminReply} disabled={replyLoading} className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-brand-green disabled:opacity-40">
                      {replyLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'landing' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-night-muted mb-1 block">عنوان اصلی</label>
                <input
                  value={landingForm?.['landing.heroTitle'] || ''}
                  onChange={(e) => setLandingForm({ ...landingForm, 'landing.heroTitle': e.target.value })}
                  className="input-glass text-sm text-right"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-night-muted mb-1 block">توضیح کوتاه</label>
                <input
                  value={landingForm?.['landing.heroSubtitle'] || ''}
                  onChange={(e) => setLandingForm({ ...landingForm, 'landing.heroSubtitle': e.target.value })}
                  className="input-glass text-sm text-right"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-night-muted mb-1 block">متن درباره ما</label>
                <textarea
                  value={landingForm?.['landing.aboutUs'] || ''}
                  onChange={(e) => setLandingForm({ ...landingForm, 'landing.aboutUs': e.target.value })}
                  rows={4}
                  className="input-glass text-sm text-right resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-night-muted mb-1 block">شماره تماس پشتیبانی</label>
                <input
                  value={landingForm?.['landing.supportPhone'] || ''}
                  onChange={(e) => setLandingForm({ ...landingForm, 'landing.supportPhone': e.target.value })}
                  className="input-glass text-sm text-left"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-night-muted mb-1 block">ایمیل پشتیبانی</label>
                <input
                  value={landingForm?.['landing.supportEmail'] || ''}
                  onChange={(e) => setLandingForm({ ...landingForm, 'landing.supportEmail': e.target.value })}
                  className="input-glass text-sm text-left"
                  dir="ltr"
                />
              </div>
              <button onClick={saveLanding} disabled={landingSaving} className="btn-primary flex items-center justify-center gap-2">
                {landingSaving ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                {landingSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
            </div>
          )}

        </div>
      </div>
    </ThemeProvider>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, Mail, Phone, Calendar, Camera, LogOut, Sun, Moon,
  MessageCircle, HelpCircle, Crown, Lock, Trash2, Edit3,
  Check, ChevronLeft, X, Loader2, AlertTriangle, Key, Shield, XCircle, LayoutDashboard
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<'day'|'night'>('day');
  const [loaded, setLoaded] = useState(false);

  // Modals
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  // Edit profile
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editMsg, setEditMsg] = useState('');

  // Change password
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState('');

  // Delete account
  const [deletePass, setDeletePass] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const u = localStorage.getItem('user');
    if (!u) { router.push('/'); return; }
    const parsed = JSON.parse(u);
    setUser(parsed);
    setEditFirstName(parsed.firstName || '');
    setEditLastName(parsed.lastName || '');
    setEditEmail(parsed.email || '');
    setTheme((localStorage.getItem('dkn-theme') as any) || 'day');
    setLoaded(true);
  }, [router]);

  if (!loaded || !user) {
    return <div className="flex justify-center py-10"><p className="text-gray-400 text-sm">در حال بارگذاری...</p></div>;
  }

  const toggleTheme = () => {
    const next = theme === 'day' ? 'night' : 'day';
    setTheme(next);
    localStorage.setItem('dkn-theme', next);
    document.documentElement.classList.toggle('dark', next === 'night');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const planLabel = (plan?: string) => {
    switch (plan) {
      case 'FREE':
        return 'رایگان';
      case 'BASIC':
        return 'پایه';
      case 'PREMIUM':
        return 'پیشرفته';
      case 'ENTERPRISE':
        return 'سازمانی';
      default:
        return plan || '---';
    }
  };

  // ── Avatar Upload ──
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setUser((prev: any) => ({ ...prev, avatar: dataUrl }));
      localStorage.setItem('user', JSON.stringify({ ...user, avatar: dataUrl }));
      try {
        const token = localStorage.getItem('token');
        await fetch('/api/v1/users/avatar', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify({ avatar: dataUrl }),
        });
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  // ── Edit Profile ──
  const handleEditProfile = async () => {
    setEditLoading(true); setEditMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ firstName: editFirstName, lastName: editLastName, email: editEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا');
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setEditMsg('اطلاعات با موفقیت بروز شد');
      setTimeout(() => { setShowEditProfile(false); setEditMsg(''); }, 1500);
    } catch (err: any) {
      setEditMsg('خطا در بروزرسانی');
    } finally { setEditLoading(false); }
  };

  // ── Change Password ──
  const handleChangePassword = async () => {
    if (newPass.length < 8) { setPassMsg('رمز عبور حداقل ۸ کاراکتر'); return; }
    if (newPass !== confirmNewPass) { setPassMsg('رمز عبور و تکرار آن یکسان نیست'); return; }
    setPassLoading(true); setPassMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا');
      setPassMsg('رمز عبور با موفقیت تغییر کرد');
      setCurrentPass(''); setNewPass(''); setConfirmNewPass('');
      setTimeout(() => { setShowChangePass(false); setPassMsg(''); }, 1500);
    } catch (err: any) {
      setPassMsg(err.message || 'خطا');
    } finally { setPassLoading(false); }
  };

  // ── Delete Account ──
  const handleDeleteAccount = async () => {
    if (!deletePass) { setDeleteMsg('لطفاً رمز عبور را وارد کنید'); return; }
    if (!confirm('آیا از حذف کامل حساب کاربری خود مطمئن هستید؟ این عمل قابل بازگشت نیست!')) return;
    setDeleteLoading(true); setDeleteMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/users/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ password: deletePass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا');
      localStorage.clear();
      router.push('/');
    } catch (err: any) {
      setDeleteMsg(err.message || 'خطا');
    } finally { setDeleteLoading(false); }
  };

  return (
    <div className="pb-20">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-night-text mb-6">پروفایل</h1>

      {/* Avatar & Info Card */}
      <div className="card text-center mb-4 shadow-glow relative overflow-hidden">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-3xl font-bold shadow-glow overflow-hidden">
            {user.avatar
              ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              : (user.firstName?.[0] || 'ک')}
          </div>
          <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center shadow-glow cursor-pointer hover:bg-brand-green/90 transition-colors">
            <Camera size={14} />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </label>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-night-text">{user.firstName} {user.lastName || ''}</h2>
        <p className="text-sm text-gray-500 dark:text-night-muted mt-1" dir="ltr">{user.phone}</p>
        <p className="text-xs text-gray-400 dark:text-night-muted/70 mt-2">
          عضو از {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '---'}
        </p>
      </div>

      {/* Contact Info */}
      <div className="card mb-4 shadow-glow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-night-muted">اطلاعات تماس</h3>
          <button onClick={() => { setEditFirstName(user.firstName || ''); setEditLastName(user.lastName || ''); setEditEmail(user.email || ''); setEditMsg(''); setShowEditProfile(true); }}
            className="flex items-center gap-1 text-xs text-brand-green hover:text-brand-green/80 transition-colors">
            <Edit3 size={14} /> ویرایش
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3"><User size={16} className="text-gray-400" /><span className="text-sm text-gray-700 dark:text-night-text">{user.firstName} {user.lastName || ''}</span></div>
          <div className="flex items-center gap-3"><Phone size={16} className="text-gray-400" /><span className="text-sm text-gray-700 dark:text-night-text" dir="ltr">{user.phone}</span></div>
          {user.email && <div className="flex items-center gap-3"><Mail size={16} className="text-gray-400" /><span className="text-sm text-gray-700 dark:text-night-text">{user.email}</span></div>}
        </div>
      </div>

      {/* Subscription */}
      <Link href="/subscription" className="card mb-4 shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Crown className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800 dark:text-night-text">اشتراک و پلن</div>
            <div className="text-xs text-gray-500 dark:text-night-muted">طرح فعلی: {planLabel(user.plan)}</div>
          </div>
        </div>
        <ChevronLeft size={18} className="text-gray-400" />
      </Link>

      {/* Settings */}
      <div className="card mb-4 shadow-glow">
        <h3 className="text-sm font-medium text-gray-500 dark:text-night-muted mb-3">تنظیمات</h3>
        <div className="space-y-2">
          <button onClick={toggleTheme} className="w-full flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-night-surface rounded-lg px-2 -mx-2 transition-colors">
            <div className="flex items-center gap-2">{theme === 'day' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-blue-400" />}<span className="text-sm text-gray-700 dark:text-night-text">تم {theme === 'day' ? 'روز' : 'شب'}</span></div>
            <span className="text-xs text-gray-400">{theme === 'day' ? <Sun size={14} className='text-amber-500' /> : <Moon size={14} className='text-blue-400' />}</span>
          </button>

          <button onClick={() => { setCurrentPass(''); setNewPass(''); setConfirmNewPass(''); setPassMsg(''); setShowChangePass(true); }}
            className="w-full flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-night-surface rounded-lg px-2 -mx-2 transition-colors">
            <div className="flex items-center gap-2"><Lock size={18} className="text-gray-400" /><span className="text-sm text-gray-700 dark:text-night-text">تغییر رمز عبور</span></div>
            <ChevronLeft size={16} className="text-gray-300" />
          </button>
        </div>
      </div>

      {/* Support */}
      <div className="card mb-4 shadow-glow">
        <h3 className="text-sm font-medium text-gray-500 dark:text-night-muted mb-3">پشتیبانی</h3>
        <div className="space-y-1">
          <Link href="/support-chat" className="flex items-center gap-3 py-3 hover:bg-gray-50 dark:hover:bg-night-surface rounded-lg px-2 -mx-2 transition-colors">
            <MessageCircle size={18} className="text-blue-500" />
            <span className="text-sm text-gray-700 dark:text-night-text">چت آنلاین</span>
            <ChevronLeft size={16} className="text-gray-300 mr-auto" />
          </Link>
          <Link href="/faq" className="flex items-center gap-3 py-3 hover:bg-gray-50 dark:hover:bg-night-surface rounded-lg px-2 -mx-2 transition-colors">
            <HelpCircle size={18} className="text-amber-500" />
            <span className="text-sm text-gray-700 dark:text-night-text">سوالات متداول</span>
            <ChevronLeft size={16} className="text-gray-300 mr-auto" />
          </Link>
          <div className="flex items-center gap-3 py-3 px-2">
            <Phone size={18} className="text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-night-text">۰۲۱-۱۲۳۴۵۶۷۸</span>
          </div>
        </div>
      </div>

      {/* Admin */}
      {user?.role === 'ADMIN' && (
        <Link href="/admin" className="card mb-4 shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <LayoutDashboard className="text-gray-600 dark:text-gray-300" size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800 dark:text-night-text">پنل مدیریت</div>
              <div className="text-xs text-gray-500 dark:text-night-muted">داشبورد مدیریت و پشتیبانی</div>
            </div>
          </div>
          <ChevronLeft size={18} className="text-gray-400" />
        </Link>
      )}

      {/* Danger Zone */}
      <div className="card mb-4 shadow-glow border border-red-200 dark:border-red-800/50">
        <h3 className="text-sm font-medium text-red-500 mb-3 flex items-center gap-2"><AlertTriangle size={16} /> منطقه خطر</h3>
        <button onClick={() => { setDeletePass(''); setDeleteMsg(''); setShowDeleteAccount(true); }}
          className="w-full flex items-center justify-between py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg px-2 -mx-2 transition-colors">
          <div className="flex items-center gap-2"><Trash2 size={18} className="text-red-500" /><span className="text-sm text-red-600 dark:text-red-400">حذف حساب کاربری</span></div>
          <ChevronLeft size={16} className="text-red-300" />
        </button>
      </div>

      {/* Logout */}
      <button onClick={() => { if (confirm('آیا مطمئن هستید؟')) handleLogout(); }}
        className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl p-4 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium mb-8">
        <LogOut size={18} /> خروج از حساب
      </button>

      {/* ════════════════ MODALS ════════════════ */}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowEditProfile(false)}>
          <div className="bg-white dark:bg-night-card rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800 dark:text-night-text">ویرایش اطلاعات</h3>
              <button onClick={() => setShowEditProfile(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <input type="text" placeholder="نام" value={editFirstName} onChange={e => setEditFirstName(e.target.value)} className="input-glass mb-2 text-right" />
            <input type="text" placeholder="نام خانوادگی" value={editLastName} onChange={e => setEditLastName(e.target.value)} className="input-glass mb-2 text-right" />
            <input type="email" placeholder="ایمیل" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="input-glass mb-3 text-right" dir="ltr" />
            {editMsg && <p className="text-xs text-center mb-3">{editMsg}</p>}
            <button onClick={handleEditProfile} disabled={editLoading} className="btn-primary flex items-center justify-center gap-2">
              {editLoading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
              {editLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePass && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowChangePass(false)}>
          <div className="bg-white dark:bg-night-card rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800 dark:text-night-text">تغییر رمز عبور</h3>
              <button onClick={() => setShowChangePass(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <input type="password" placeholder="رمز عبور فعلی" value={currentPass} onChange={e => setCurrentPass(e.target.value)} className="input-glass mb-2" />
            <input type="password" placeholder="رمز عبور جدید (حداقل ۸ کاراکتر)" value={newPass} onChange={e => setNewPass(e.target.value)} className="input-glass mb-2" />
            <input type="password" placeholder="تکرار رمز عبور جدید" value={confirmNewPass} onChange={e => setConfirmNewPass(e.target.value)} className="input-glass mb-3" />
            {passMsg && <p className="text-xs text-center mb-3">{passMsg}</p>}
            <button onClick={handleChangePassword} disabled={passLoading} className="btn-primary flex items-center justify-center gap-2">
              {passLoading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
              {passLoading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccount && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowDeleteAccount(false)}>
          <div className="bg-white dark:bg-night-card rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-red-600 dark:text-red-400">حذف حساب کاربری</h3>
              <button onClick={() => setShowDeleteAccount(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 dark:text-red-300">این عمل غیرقابل بازگشت است! تمام اطلاعات مزارع، گزارش‌ها و داده‌های شما حذف خواهد شد.</p>
            </div>
            <input type="password" placeholder="رمز عبور خود را وارد کنید" value={deletePass} onChange={e => setDeletePass(e.target.value)} className="input-glass mb-3" />
            {deleteMsg && <p className="text-xs text-center mb-3">{deleteMsg}</p>}
            <button onClick={handleDeleteAccount} disabled={deleteLoading}
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl p-3 font-bold flex items-center justify-center gap-2 disabled:opacity-40 transition-colors">
              {deleteLoading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
              {deleteLoading ? 'در حال حذف...' : 'حذف حساب کاربری'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

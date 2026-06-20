'use client';

export default function PestsPage() {
  return (
    <>
      <div className="mb-4">
        <p className="text-xs text-gray-500">مرکز پایش ریسک</p>
        <h1 className="text-lg font-extrabold text-gray-800">آفات و بیماری‌ها</h1>
      </div>

      {/* Gauges */}
      <div className="card mb-4">
        <div className="text-sm font-bold text-gray-700 mb-4">🔍 سطح ریسک فعلی</div>
        <div className="flex justify-around">
          <div className="text-center">
            <svg width="100" height="58" viewBox="0 0 100 58">
              <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="10" strokeLinecap="round"/>
              <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#22C55E" strokeWidth="10" strokeLinecap="round" strokeDasharray="43.96 125.6"/>
              <text x="50" y="52" textAnchor="middle" fontSize="12" fontWeight="700" fill="#22C55E" fontFamily="Vazirmatn">35%</text>
            </svg>
            <div className="text-[11px] text-gray-500">ریسک آفات</div>
            <div className="text-xs font-bold text-green-600">پایین</div>
          </div>
          <div className="w-px bg-black/5" />
          <div className="text-center">
            <svg width="100" height="58" viewBox="0 0 100 58">
              <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="10" strokeLinecap="round"/>
              <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#F59E0B" strokeWidth="10" strokeLinecap="round" strokeDasharray="72.85 125.6"/>
              <text x="50" y="52" textAnchor="middle" fontSize="12" fontWeight="700" fill="#F59E0B" fontFamily="Vazirmatn">58%</text>
            </svg>
            <div className="text-[11px] text-gray-500">ریسک بیماری</div>
            <div className="text-xs font-bold text-amber-600">متوسط</div>
          </div>
          <div className="w-px bg-black/5" />
          <div className="text-center">
            <svg width="100" height="58" viewBox="0 0 100 58">
              <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="10" strokeLinecap="round"/>
              <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#22C55E" strokeWidth="10" strokeLinecap="round" strokeDasharray="27.63 125.6"/>
              <text x="50" y="52" textAnchor="middle" fontSize="12" fontWeight="700" fill="#22C55E" fontFamily="Vazirmatn">22%</text>
            </svg>
            <div className="text-[11px] text-gray-500">علف‌های هرز</div>
            <div className="text-xs font-bold text-green-600">پایین</div>
          </div>
        </div>
      </div>

      {/* Threats */}
      <div className="section-title">🧬 پیش‌بینی تهدیدات</div>
      
      <div className="card mb-3" style={{ borderRight: '3px solid #F59E0B' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍄</span>
            <div>
              <div className="text-xs font-bold text-gray-800">بیماری قارچی سفیدک</div>
              <div className="text-[10px] text-gray-500">تأثیر: ۱۵٪ کاهش محصول</div>
            </div>
          </div>
          <span className="badge badge-warn">شدت متوسط</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-gray-500">احتمال بروز</span>
          <span className="text-xs font-bold text-amber-600">62%</span>
        </div>
        <div className="prog-bg">
          <div className="prog-fill bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: '62%' }} />
        </div>
      </div>

      <div className="card mb-3" style={{ borderRight: '3px solid #22C55E' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐛</span>
            <div>
              <div className="text-xs font-bold text-gray-800">شته سبز</div>
              <div className="text-[10px] text-gray-500">تأثیر: ۵٪ کاهش محصول</div>
            </div>
          </div>
          <span className="badge badge-success">شدت پایین</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-gray-500">احتمال بروز</span>
          <span className="text-xs font-bold text-green-600">28%</span>
        </div>
        <div className="prog-bg">
          <div className="prog-fill bg-gradient-to-r from-green-400 to-green-500" style={{ width: '28%' }} />
        </div>
      </div>

      <div className="card mb-4" style={{ borderRight: '3px solid #F59E0B' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦠</span>
            <div>
              <div className="text-xs font-bold text-gray-800">زنگ زرد گندم</div>
              <div className="text-[10px] text-gray-500">تأثیر: ۲۰٪ کاهش محصول</div>
            </div>
          </div>
          <span className="badge badge-warn">شدت متوسط</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-gray-500">احتمال بروز</span>
          <span className="text-xs font-bold text-amber-600">45%</span>
        </div>
        <div className="prog-bg">
          <div className="prog-fill bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: '45%' }} />
        </div>
      </div>

      {/* AI Prevention */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.04), rgba(245,158,11,0.03))' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🤖</span>
          <span className="text-sm font-bold text-gray-700">توصیه‌های پیشگیری AI</span>
        </div>
        {[
          'استفاده از قارچکش پیشگیرانه قبل از باران',
          'بهبود تهویه بین ردیف‌های کشت',
          'پایش هفتگی برگ‌های تحتانی',
          'کاهش مصرف کود نیتروژنه تا ۲ هفته',
        ].map((text, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: 'rgba(43,182,115,0.15)', color: '#2BB673' }}>
              {i + 1}
            </span>
            <span className="text-xs text-gray-700">{text}</span>
          </div>
        ))}
      </div>
    </>
  );
}

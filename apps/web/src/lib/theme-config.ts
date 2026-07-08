/**
 * 🎨 فایل تنظیمات ظاهری — DKN Theme Config
 * 
 * این فایل رو می‌تونی ویرایش کنی تا رنگ، اندازه و فونت همه قسمت‌های سایت عوض بشه.
 * بعد از تغییر، فقط یه بار `pnpm --filter web build` بزن.
 */

export const themeConfig = {
  /* ── رنگ‌های اصلی ── */
  colors: {
    primary: '#2BB673',        // سبز اصلی - دکمه‌ها، لینک‌ها
    primaryLight: '#22C55E',   // سبز روشن - gradient
    primaryDark: '#1A8B5A',    // سبز تیره - hover
    
    /* متن */
    textPrimary: '#1F2937',       // متن اصلی روز
    textSecondary: '#6B7280',     // متن فرعی روز
    textPrimaryDark: '#F9FAFB',   // متن اصلی شب
    textSecondaryDark: '#D1D5DB', // متن فرعی شب
    
    /* پس‌زمینه */
    bgDay: '#F7FBF8',           // پس‌زمینه روز
    bgNight: '#0A1A12',         // پس‌زمینه شب
    cardDay: 'rgba(255,255,255,0.7)',  // کارت روز
    cardNight: 'rgba(15,30,20,0.8)',   // کارت شب
    
    /* وضعیت‌ها */
    success: '#22C55E',  // موفق
    warning: '#F59E0B',  // هشدار
    danger: '#EF4444',   // خطر
    info: '#3B82F6',     // اطلاعات
  },

  /* ── اندازه فونت‌ها ── */
  fontSizes: {
    xs: '0.75rem',     // ۱۲px
    sm: '0.875rem',    // ۱۴px
    base: '1rem',      // ۱۶px
    lg: '1.125rem',    // ۱۸px
    xl: '1.25rem',     // ۲۰px
    '2xl': '1.5rem',   // ۲۴px
    '3xl': '1.875rem', // ۳۰px
  },

  /* ── وزن فونت‌ها ── */
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  /* ── خانواده فونت ── */
  fontFamily: {
    sans: "'Vazirmatn', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },

  /* ── گردی گوشه‌ها ── */
  borderRadius: {
    sm: '0.5rem',    // ۸px
    md: '0.75rem',   // ۱۲px
    lg: '1rem',      // ۱۶px
    xl: '1.5rem',    // ۲۴px
    '2xl': '2rem',   // ۳۲px
  },

  /* ── سایه‌ها ── */
  shadows: {
    glow: '0 0 0 1px rgba(16,185,129,0.1), 0 4px 20px -2px rgba(16,185,129,0.15)',
    glowLg: '0 0 0 1px rgba(16,185,129,0.15), 0 8px 30px -5px rgba(16,185,129,0.2)',
    card: '0 4px 24px rgba(43,182,115,0.07)',
    button: '0 4px 16px rgba(43,182,115,0.3)',
  },

  /* ── انیمیشن‌ها ── */
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },

  /* ── سایز آیکون‌ها ── */
  iconSizes: {
    sm: 14,
    md: 18,
    lg: 24,
    xl: 36,
    '2xl': 48,
  },

  /* ── تنظیمات هر صفحه ── */
  pages: {
    login: {
      logoSize: 80,            // سایز لوگو (px)
      titleSize: '2xl',        // اسم "داده کشت نوین"
      cardPadding: '1.5rem',   // padding کارت
      inputHeight: '3rem',     // ارتفاع اینپوت‌ها
    },
    dashboard: {
      titleSize: '2xl',
      cardSpacing: '1rem',
      weatherIconSize: 40,
    },
    farms: {
      cardSpacing: '1rem',
      healthBarHeight: '6px',
    },
    setup: {
      cropGridCols: 3,        // چند ستون برای محصولات
      mapHeight: '12rem',     // ارتفاع نقشه
    },
    ai: {
      chatBubbleRadius: '1rem',
      maxMessageWidth: '85%',
    },
    irrigation: {
      progressHeight: '8px',
      chartHeight: '12rem',
    },
    pests: {
      severityGridCols: 4,
      imageUploadHeight: '10rem',
    },
    profile: {
      avatarSize: 96,
      cardSpacing: '1rem',
    },
  },
};

// برای استفاده راحت‌تر:
export const c = themeConfig.colors;
export const fs = themeConfig.fontSizes;
export const fw = themeConfig.fontWeights;
export const ff = themeConfig.fontFamily;
export const br = themeConfig.borderRadius;
export const sh = themeConfig.shadows;
export const tr = themeConfig.transitions;
export const ic = themeConfig.iconSizes;
export const pg = themeConfig.pages;

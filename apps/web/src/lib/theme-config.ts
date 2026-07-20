export const themeConfig = {
  colors: {
    primary: '#2BB673',
    primaryLight: '#22C55E',
    primaryDark: '#1A8B5A',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textPrimaryDark: '#F9FAFB',
    textSecondaryDark: '#D1D5DB',
    bgDay: '#F7FBF8',
    bgNight: '#0A1A12',
    cardDay: 'rgba(255,255,255,0.7)',
    cardNight: 'rgba(15,30,20,0.8)',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
  fontSizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem' },
  fontWeights: { normal: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800' },
  fontFamily: { sans: "'Vazirmatn', system-ui, sans-serif", mono: "'JetBrains Mono', monospace" },
  borderRadius: { sm: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.5rem', '2xl': '2rem' },
  shadows: {
    glow: '0 0 0 1px rgba(16,185,129,0.1), 0 4px 20px -2px rgba(16,185,129,0.15)',
    glowLg: '0 0 0 1px rgba(16,185,129,0.15), 0 8px 30px -5px rgba(16,185,129,0.2)',
    card: '0 4px 24px rgba(43,182,115,0.07)',
    button: '0 4px 16px rgba(43,182,115,0.3)',
  },
  transitions: { fast: '150ms', normal: '300ms', slow: '500ms' },
  iconSizes: { sm: 14, md: 18, lg: 24, xl: 36, '2xl': 48 },
};
export const c = themeConfig.colors;
export const fs = themeConfig.fontSizes;
export const fw = themeConfig.fontWeights;
export const ff = themeConfig.fontFamily;
export const br = themeConfig.borderRadius;
export const sh = themeConfig.shadows;
export const tr = themeConfig.transitions;
export const ic = themeConfig.iconSizes;

'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { isSessionValid, clearSession, touchSession, migrateLegacyToken } from '@/lib/session';

/**
 * useSessionGuard — checks session validity on mount and provides
 * activity-based `touchSession` throttling.
 *
 * If session is expired/invalid, clears session and redirects to /auth.
 *
 * Usage: call in any protected layout or page.
 */
export default function useSessionGuard() {
  const router = useRouter();
  const lastTouchRef = useRef(0);

  useEffect(() => {
    // Migrate legacy token if needed
    migrateLegacyToken();

    if (!isSessionValid()) {
      clearSession();
      // Avoid redirect loop — only redirect if not already on auth pages
      const path = window.location.pathname;
      if (!path.startsWith('/auth') && path !== '/login' && path !== '/register') {
        router.replace('/auth?mode=login&reason=session-expired');
      }
    }
  }, [router]);

  // Activity-based session touch (throttled to every 60s)
  useEffect(() => {
    const handler = () => {
      const now = Date.now();
      if (now - lastTouchRef.current > 60_000) {
        lastTouchRef.current = now;
        touchSession();
      }
    };

    window.addEventListener('click', handler);
    window.addEventListener('keydown', handler);
    window.addEventListener('scroll', handler, { passive: true });

    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
      window.removeEventListener('scroll', handler);
    };
  }, []);
}

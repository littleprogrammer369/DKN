'use client';

/**
 * Session & token management utility for DKN.
 *
 * Stores:
 *  - token       (legacy key, backward-compatible)
 *  - user        (legacy key, backward-compatible)
 *  - auth_session (new metadata object)
 *
 * AuthSession metadata:
 *  - token
 *  - loginAt        (epoch ms)
 *  - lastActivityAt (epoch ms)
 *  - deviceId       (UUID stored in localStorage)
 */

export type AuthSession = {
  token: string;
  loginAt: number;
  lastActivityAt: number;
  deviceId: string;
};

// ─── Config ──────────────────────────────────────────────────────────

export const SESSION_MAX_AGE_MS = Number(
  process.env.NEXT_PUBLIC_SESSION_MAX_AGE_MS ?? 24 * 60 * 60 * 1000, // 24h
);

export const SESSION_IDLE_TIMEOUT_MS = Number(
  process.env.NEXT_PUBLIC_SESSION_IDLE_TIMEOUT_MS ?? 30 * 60 * 1000, // 30min
);

const DEVICE_ID_KEY = 'dkn_device_id';
const SESSION_KEY = 'auth_session';

// ─── Device ID ───────────────────────────────────────────────────────

export function getOrCreateDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return 'unknown';
  }
}

// ─── Session CRUD ────────────────────────────────────────────────────

export function saveSession(token: string): void {
  try {
    const now = Date.now();
    const session: AuthSession = {
      token,
      loginAt: now,
      lastActivityAt: now,
      deviceId: getOrCreateDeviceId(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // Keep legacy keys for backward compatibility
    localStorage.setItem('token', token);
  } catch {
    // localStorage unavailable
  }
}

export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed.token || !parsed.loginAt || !parsed.lastActivityAt || !parsed.deviceId) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function isSessionValid(session?: AuthSession | null): boolean {
  const s = session ?? getSession();
  if (!s) return false;

  const now = Date.now();

  // Max age check
  if (now - s.loginAt > SESSION_MAX_AGE_MS) return false;

  // Idle timeout check
  if (now - s.lastActivityAt > SESSION_IDLE_TIMEOUT_MS) return false;

  return true;
}

export function touchSession(): void {
  try {
    const session = getSession();
    if (!session) return;
    session.lastActivityAt = Date.now();
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch {
    // ignore
  }
}

export function getAuthToken(): string | null {
  // Try new session first, fall back to legacy key
  try {
    const session = getSession();
    if (session?.token) return session.token;
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

/**
 * Migrate legacy token (without session metadata) to new session format.
 * Returns the migrated session or null if no token exists.
 */
export function migrateLegacyToken(): AuthSession | null {
  try {
    const existingSession = getSession();
    if (existingSession) return existingSession; // already migrated

    const legacyToken = localStorage.getItem('token');
    if (!legacyToken) return null;

    // Create session with current time as loginAt (safe assumption)
    const now = Date.now();
    const session: AuthSession = {
      token: legacyToken,
      loginAt: now,
      lastActivityAt: now,
      deviceId: getOrCreateDeviceId(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  } catch {
    return null;
  }
}

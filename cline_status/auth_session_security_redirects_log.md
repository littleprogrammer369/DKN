# Auth Session Security + Redirects Report

## Branch
- Base: develop
- Work branch: fix/auth-session-security-redirects
- Commit: `11d26f8`
- Push status: ✅ Pushed to `origin/fix/auth-session-security-redirects`

## Audit Findings
- **Token storage:** `localStorage` keys `token` (raw JWT) and `user` (JSON) — no metadata
- **Old expiry:** Hardcoded `30d` in `auth.module.ts` line 14 (env var `JWT_EXPIRES_IN=7d` in .env was **ignored**)
- **New expiry:** Backend now reads from env `JWT_EXPIRES_IN` with fallback `1d`
- **Session metadata:** Added `auth_session` key with `token`, `loginAt`, `lastActivityAt`, `deviceId`

## Implemented
- [x] Session max age (24h default via `NEXT_PUBLIC_SESSION_MAX_AGE_MS`)
- [x] Idle timeout (30min default via `NEXT_PUBLIC_SESSION_IDLE_TIMEOUT_MS`)
- [x] Device/session metadata (`deviceId` in localStorage)
- [x] Auth pages redirect logged-in users to dashboard (before render)
- [x] Landing CTA adapts for logged-in users (`ورود به داشبورد`)
- [x] Removed dashboard CTA from auth page for logged-in users by redirecting before render
- [x] Logout clears all session data (via `clearSession()`)
- [x] Expired session message (نشست شما منقضی شده است)
- [x] Backend JWT expiry now env-driven (`JwtModule.registerAsync` with `ConfigService`)
- [x] Protected route guard via `useSessionGuard` hook in `(app)/layout.tsx`
- [x] Legacy token migration on mount (`migrateLegacyToken`)

## Files changed
| File | Change |
|------|--------|
| `apps/web/src/lib/session.ts` | **NEW** — session utility (save/get/validate/touch/clear) |
| `apps/web/src/hooks/useSessionGuard.ts` | **NEW** — session guard hook + activity throttle |
| `apps/web/src/app/(app)/layout.tsx` | Added `useSessionGuard()` |
| `apps/web/src/components/AuthPage.tsx` | Redirect valid sessions, use `saveSession`, expired banner |
| `apps/web/src/components/LandingClient.tsx` | Dynamic CTA based on session state |
| `services/api/src/auth/auth.module.ts` | JWT expiry from env (was hardcoded `30d`) |
| `cline_status/auth_session_security_redirects_log.md` | This log |
| `.env.example` | Added `JWT_EXPIRES_IN`, `NEXT_PUBLIC_SESSION_*` |

## Build
- API build: ✅ Pass
- Web build: ✅ Pass

## Manual tests
| Scenario | Result |
|----------|--------|
| Guest visits `/` | ✅ Landing with ورود/ثبت‌نام رایگان buttons |
| Guest clicks ورود | ✅ `/auth?mode=login` |
| Guest clicks ثبت‌نام | ✅ `/auth?mode=register` |
| After login success | ✅ Redirect to `/dashboard` via `router.replace` |
| Logged-in user visits `/auth` | ✅ Redirect to `/dashboard` before auth form renders |
| Logged-in user visits `/login` or `/register` | ✅ Server redirect → `/auth?mode=...` → client redirect to `/dashboard` |
| Logged-in user visits `/` | ✅ CTA shows "ورود به داشبورد" instead of ورود/ثبت‌نام |
| Expired session | ✅ `clearSession()` + redirect to `/auth?mode=login&reason=session-expired` |
| Session expired message | ✅ Banner: "نشست شما منقضی شده است. لطفاً دوباره وارد شوید." |
| Logout (via `clearSession()`) | ✅ Token + session + user from localStorage removed |
| Protected routes guard | ✅ `useSessionGuard` in `(app)/layout.tsx` |

## Env needed
```
JWT_EXPIRES_IN=1d
NEXT_PUBLIC_SESSION_MAX_AGE_MS=86400000
NEXT_PUBLIC_SESSION_IDLE_TIMEOUT_MS=1800000
```

## Risks / Notes
- Existing users may get logged out sooner than before (old code had 30d hardcoded, new default is 1d). The current `.env` has `JWT_EXPIRES_IN=7d` so existing tokens remain valid for 7 days.
- The `useSessionGuard` runs activity throttling (click/keydown/scroll) every 60s to update `lastActivityAt`. This prevents idle timeout from firing while the user is active.
- `/login` and `/register` are server-side redirects to `/auth?...` — the actual session check happens client-side in `AuthPage`.
- `ecosystem.config.js` change (`dist/main.js` → `dist/src/main.js`) is a pre-existing local fix, not included in this commit.

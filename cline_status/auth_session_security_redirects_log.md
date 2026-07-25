# Auth Session Security + Redirects Log

## Phase 0 — Branch
- Base: develop
- Work branch: fix/auth-session-security-redirects
- Created from latest origin/develop

## Phase 1 — Audit Findings

### Token Storage
- `localStorage` key `"token"` — raw JWT string
- `localStorage` key `"user"` — JSON stringified user object
- No expiry metadata, no session timestamps, no device ID

### Current Auth Store
- **None** — No Zustand/Redux store
- Direct `localStorage.getItem/setItem` calls throughout codebase
- Files using `localStorage`: `AuthPage.tsx`, `dashboard/page.tsx`, `NavBar.tsx?`

### Current JWT Expiry
- **Backend:** Hardcoded `expiresIn: '30d'` in `auth.module.ts` line 14
- `.env` has `JWT_EXPIRES_IN=7d` but **never used** by the module
- Backend `JwtStrategy` has `ignoreExpiration: false` ✅ (will reject expired tokens)

### Protected Route Guard
- **NONE** — `(app)/layout.tsx` wraps all protected pages but has **zero** auth checking
- Dashboard page checks `localStorage.getItem('token')` manually and redirects to `/` if missing
- Other protected pages (farms, ai, irrigation, pests, profile) have **no guard at all**

### Public/Auth Route Behavior
- `/auth` page checks `hasToken` on mount but does **not redirect** — shows a "ورود به داشبورد" button instead
- `/login` → redirect (server-side) to `/auth?mode=login`
- `/register` → redirect (server-side) to `/auth?mode=register`
- `AuthPage` component accepts `onGoToDashboard` prop but it's never wired from `/auth/page.tsx`

### Landing CTA Behavior
- Always shows "ورود" and "ثبت‌نام رایگان" links — no session awareness
- No dynamic CTA switching

### Logout
- No explicit logout button/flow on landing or NavBar
- Profile page has logout (not yet audited fully)

### Files to change:
1. `services/api/src/auth/auth.module.ts` — use env for JWT expiry
2. `apps/web/src/lib/session.ts` — **NEW** session utility
3. `apps/web/src/lib/utils.ts` — add session helpers (or use new file)
4. `apps/web/src/hooks/useSessionGuard.ts` — **NEW** session guard hook
5. `apps/web/src/components/AuthPage.tsx` — redirect valid sessions, fix login redirect
6. `apps/web/src/app/auth/page.tsx` — wire session check
7. `apps/web/src/app/(app)/layout.tsx` — add auth guard
8. `apps/web/src/components/LandingClient.tsx` — dynamic CTA for logged-in users
9. `.env.example` — add session config vars

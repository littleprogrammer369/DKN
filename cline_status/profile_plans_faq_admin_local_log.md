# Profile / Plans / FAQ / Admin Panel MVP — Local Work Log

## Phase 0 — Prepare Branch
- Checked out branch: `feature/profile-plans-faq-admin-panel` from `develop`
- Working tree clean (only untracked `PROJECT_AUDIT_REPORT.md`)
- Initial commit: `b43a27a` chore: start profile/plans/faq/admin panel MVP branch

## Phase 1 — Audit
- Profile route: `apps/web/src/app/(app)/profile/page.tsx`
- Plans route: `apps/web/src/app/subscription/page.tsx`
- FAQ route: `apps/web/src/app/faq/page.tsx`
- Online chat route: `apps/web/src/app/support-chat/page.tsx`
- Existing support/admin backend: none
- Existing user role/admin mechanism: `UserRole` enum exists (`ADMIN`, `FARMER`, `COMPANY`)
- Existing chat persistence: none (local-only state in support-chat)

## Phase 2 — Plans/Subscription UI
- Fixed plan label `پremium` → `پیشرفته`
- Fixed `همه امکانات Premium` → `همه امکانات پیشرفته`
- Linked Enterprise CTA to `/support/contact?type=enterprise`
- Price display and layout review: cards already constrained to `max-w-[420px]`, no overflow issues found on mobile

## Phase 3 — FAQ search input
- Added explicit `dir="rtl"` and right alignment to input
- Increased right padding to prevent overlap with search icon

## Phase 4 — Profile cleanup
- Removed `@` prefix from phone display
- Added Persian plan label mapping (`FREE→رایگان`, `BASIC→پایه`, `PREMIUM→پیشرفته`, `ENTERPRISE→سازمانی`)
- Removed emoji from success/error messages
- Verified avatar upload calls `/api/v1/users/avatar`
- Verified logout works
- Verified delete account has confirm modal and real backend call

## Phase 5 — Admin/Support Panel
- Added Prisma models: `SupportConversation`, `SupportMessage`, `AppSetting`
- Added user-facing support endpoints: `/api/v1/support/conversations`, `/api/v1/support/conversations/:id/messages`
- Added admin guard based on `user.role === 'ADMIN'` or optional env fallback
- Added admin endpoints: overview, users, user detail, support conversations/messages, landing content
- Built `/support/contact` public page with form saved to localStorage (MVP)
- Built `/admin` panel with tabs: dashboard, users, support chat, landing content
- Updated support chat page to persist messages via backend API

## Phase 6 — Build/Validate
- Prisma schema validated: `pnpm --filter api exec prisma validate` ✅
- Prisma generate: `pnpm --filter api run prisma:generate` ✅
- DB sync: `pnpm --filter api exec prisma db push` ✅ (no migration due to shadow DB permissions)
- API build: `pnpm --filter api build` ✅
- Web build: `pnpm --filter web build` ✅

## Phase 7 — Git
- Commit: `8c125f9` feat: improve profile support flows and add admin panel MVP
- Pushed: `feature/profile-plans-faq-admin-panel` ✅
- PR URL: https://github.com/littleprogrammer369/DKN/pull/new/feature/profile-plans-faq-admin-panel

## Not Done / Risks
- Real admin user not tested with actual ADMIN role in DB
- Support chat MVP uses localStorage fallback for contact form; backend endpoint not implemented yet
- .env.example was not committed because `.gitignore` excludes `.env.*`; if needed, add explicitly with `git add -f`
- Production migration not run; `db push` used for local schema sync only

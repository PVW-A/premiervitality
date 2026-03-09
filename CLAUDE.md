# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest watch mode
npm run preview      # Preview production build
```

**Supabase CLI** (uses project ref `shwnyggnwajdfxbwsdhz`):
```bash
# Link project first if needed
npx supabase link --project-ref shwnyggnwajdfxbwsdhz

# Deploy an edge function
npx supabase functions deploy <function-name> --project-ref shwnyggnwajdfxbwsdhz

# Apply migrations
npx supabase db push --linked --yes

# Set secrets
npx supabase secrets set KEY=value --project-ref shwnyggnwajdfxbwsdhz
```

**Auth token** for Supabase CLI (if 403 errors): `sbp_33dbb714d695f97b74d2e929c2ffa8d58b4593b8`

## Architecture

**Premier Vitality & Wellness** — physician-directed peptide therapy clinic. Patients sign up, order treatments, track bloodwork/biomarkers, and interact with an AI concierge.

### Stack
- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, shadcn-ui (Radix UI), Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions in Deno)
- **Data fetching**: TanStack React Query v5
- **Payments**: Square (card-on-file, subscriptions, loyalty, payment links)
- **SMS**: Twilio
- **Fonts**: Cormorant Garamond (headings), Inter/Helvetica Neue (body)

### Auth Flow
`AuthProvider` in `src/hooks/useAuth.tsx` wraps the entire app and exposes `{ user, session, loading, signOut }`. It uses Supabase PKCE flow with localStorage persistence. Admin pages additionally check a hardcoded UID (`4b63e9d9-1cf9-49a1-9427-89e4035f8115`) or a `has_role` RPC call.

### Routing (`src/App.tsx`)
All routes are defined flat in `<Routes>`. Public pages are unauthenticated; `/portal`, `/dashboard`, and `/admin` enforce auth inside the component (not via a wrapper). `ChatButton` and `SessionTimeoutWrapper` are rendered at the app level outside routes.

### Supabase Integration
- Client: `src/integrations/supabase/client.ts` — reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- Generated types: `src/integrations/supabase/types.ts` (auto-generated, don't edit)
- Edge Functions: `supabase/functions/` — all Deno, JWT verification disabled in `config.toml`
- Migrations: `supabase/migrations/` — 32 SQL files applied sequentially

Key edge functions:
| Function | Purpose |
|---|---|
| `chat` | AI chat (PV Concierge) with peptide knowledge base |
| `square-payment` | Card tokenization → Square customer + card-on-file + subscription/charge |
| `notify-order-status` | SMS order approval/denial via Twilio + Square payment link |
| `parse-bloodwork` | AI lab result parsing |
| `send-2fa-code` / `verify-2fa-code` | Two-factor auth |
| `pv-concierge` | Clinical support chatbot |

### Key Data Models
- `memberships` — links users to `membership_tiers` (legacy/essential/premium/elite) with `status`
- `orders` / `order_items` — treatment requests with `status` (pending/approved/denied)
- `biomarker_results` — patient lab values with `marker_name`, `result_value`, `unit`, `status`
- `chat_sessions` / `chat_messages` — AI chat history per user
- `legacy_customers` — seeded Square customer emails for automatic legacy tier assignment on signup

### Membership & Pricing
`src/data/membershipConfig.ts` defines tiers with monthly/annual prices and discount percentages (essential: 0%, premium: 15%, elite: 25%). The `legacy_customers` trigger in the DB automatically grants legacy tier to matching emails on `auth.users` insert.

### Vitality Scoring
`src/lib/vitality.ts` — comprehensive biomarker scoring across ~50 markers (Hormones, Metabolic, Lipids, Inflammation, etc.). Each marker has reference ranges and grades (`critical`, `low`, `normal`, `optimal`, `high`, `critical_high`). Used in the patient portal to compute an overall vitality score.

### Component Organization
```
src/components/
  ui/          shadcn-ui base components (never edit directly)
  admin/       Admin panel subcomponents (AdminOrders, etc.)
  portal/      Patient portal subcomponents (PortalPaymentForm, etc.)
  chat/        ChatButton, ChatPanel, ChatMessage
  services/    Pricing page components (TierComparisonTable, BloodworkBreakdown, etc.)
```

### TypeScript Config
Loose config — `strict: false`, `noImplicitAny: false`. JSX files use `.jsx` extension for the PatientDashboard and a few others; everything else is `.tsx`.

### Environment Variables
```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID=shwnyggnwajdfxbwsdhz
VITE_SQUARE_APP_ID          # From Square Developer Dashboard (not API-retrievable)
VITE_SQUARE_LOCATION_ID=L85CTM0203T96
```
Supabase secrets (set via CLI): `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `SQUARE_PLAN_*` (optional, for subscription plan IDs).

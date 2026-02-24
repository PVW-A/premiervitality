

# Membership System for Premier Vitality

## Overview
Build a 3-tier membership system (Essential, Premium, Elite) that gates peptide purchasing behind an active membership. The peptide catalog remains visible to everyone, but only members can place orders. Members get benefits like scheduled blood work, discounts on peptides, and priority support depending on their tier.

## Membership Tiers

| Feature | Essential | Premium | Elite |
|---|---|---|---|
| Monthly Price | ~$99/mo | ~$199/mo | ~$349/mo |
| Annual Price | ~$89/mo (billed yearly) | ~$179/mo (billed yearly) | ~$299/mo (billed yearly) |
| Peptide Discount | 5% | 15% | 25% |
| Blood Work | Annual | Semi-annual | Quarterly |
| Consultation | Initial only | Quarterly check-ins | Monthly check-ins |
| Priority Support | No | Yes | Yes, dedicated |
| Access to Catalog Orders | Yes | Yes | Yes |

(Exact pricing and benefits can be adjusted later from the admin panel or database.)

## What Gets Built

### 1. Database Changes
- **`membership_tiers` table**: Stores tier definitions (name, monthly price, annual price, discount percentage, benefits JSON, blood work frequency, etc.)
- **`memberships` table**: Tracks which user has which tier, billing cycle, status (active/cancelled/past_due), start date, renewal date
- Seed the 3 tiers (Essential, Premium, Elite) with initial pricing and benefits
- RLS policies so users can view tiers (public) and manage only their own membership

### 2. Services Page (`/services`)
- A new dedicated page linked from the "Services" nav item (currently points to `#services` which doesn't exist)
- Premium luxury styling consistent with the rest of the site
- Three membership tier cards displayed side-by-side with pricing toggle (monthly/annual)
- Each card lists benefits, pricing, and a "Join" CTA
- Annual pricing shown with a "Save X%" badge
- Clicking "Join" redirects to auth if not logged in, then to a membership signup flow

### 3. Membership Gating on Catalog
- The peptide catalog (`/catalog`) remains viewable by all authenticated users
- The "Request Consultation" button on each peptide card gets replaced with a membership check
- Non-members see a prompt to join a membership plan before they can order
- Members see their tier discount applied to displayed prices

### 4. Navbar Update
- Change "Services" link from `#services` to `/services`
- Add route for `/services` in App.tsx

### 5. Portal Integration
- Show current membership tier and status on the patient portal
- Display next renewal date and billing cycle
- Option to upgrade/downgrade tier (visual only for now, actual billing via Stripe later)

## Technical Details

### Database Schema

```text
membership_tiers
+------------------+----------+----------+
| id (uuid, PK)                          |
| name (text)        e.g. "Essential"    |
| slug (text)        e.g. "essential"    |
| monthly_price (numeric)                |
| annual_price (numeric)                 |
| discount_pct (numeric)   e.g. 5       |
| blood_work_frequency (text)            |
| consultation_frequency (text)          |
| priority_support (boolean)             |
| features (jsonb)   additional perks    |
| sort_order (int)                       |
| created_at (timestamptz)               |
+----------------------------------------+

memberships
+------------------+----------+----------+
| id (uuid, PK)                          |
| user_id (uuid, NOT NULL)               |
| tier_id (uuid, FK -> membership_tiers) |
| billing_cycle (text) monthly/annual    |
| status (text) active/cancelled/expired |
| started_at (timestamptz)               |
| renews_at (timestamptz)                |
| cancelled_at (timestamptz, nullable)   |
| created_at (timestamptz)               |
| updated_at (timestamptz)               |
+----------------------------------------+
```

### RLS Policies
- `membership_tiers`: SELECT open to all (public info)
- `memberships`: Users can SELECT their own; admins can manage all

### New Files
- `src/pages/Services.tsx` - The membership/services page
- Updates to `src/pages/Catalog.tsx` - Add membership check and discount display
- Updates to `src/pages/Portal.tsx` - Show membership status
- Updates to `src/components/Navbar.tsx` - Fix Services link
- Updates to `src/App.tsx` - Add /services route

### Payment Integration (Stripe)
Stripe will be enabled to handle the actual subscription billing. This connects the membership tiers to real recurring payments so members are charged monthly or annually. The checkout flow will redirect to a Stripe-hosted payment page, and a webhook will automatically activate the membership once payment succeeds.

## Implementation Order
1. Create database tables and seed tier data
2. Enable Stripe for subscription billing
3. Build the Services page with tier cards and pricing toggle
4. Wire up membership signup flow with Stripe checkout
5. Add membership gating to the catalog page
6. Update the portal to show membership status
7. Update navbar routing

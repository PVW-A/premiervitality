

# Phase 2: Patient Portal Requests + Square Payment Links

## Overview

Add a "My Requests" section to the patient portal showing request statuses, and when admin approves a request, dynamically generate a Square payment link via a backend function. The approved request displays a "Pay Now" button linking to Square checkout.

---

## Architecture

```text
Patient requests peptide (Catalog)
        |
        v
peptide_requests row (status: pending)
        |
Admin clicks "Approve" (Admin dashboard)
        |
        v
Backend function: create-payment-link
  - Reads peptide price from DB
  - Calls Square API to generate checkout link
  - Saves payment_url + square_order_id to peptide_requests
        |
        v
Patient sees "Pay Now" button in Portal
  - Clicks -> redirects to Square checkout
```

---

## Step 1: Database Changes

Add columns to `peptide_requests`:

- `payment_url` (text, nullable) -- Square checkout URL
- `square_order_id` (text, nullable) -- for tracking

---

## Step 2: Secrets Setup

Request two new secrets from you:

- `SQUARE_ACCESS_TOKEN` -- your production Square API token
- `SQUARE_LOCATION_ID` -- your Square location ID

These are stored securely and only accessible from backend functions.

---

## Step 3: Backend Function — `create-payment-link`

A new edge function at `supabase/functions/create-payment-link/index.ts`:

- **Auth**: Validates admin role via JWT claims
- **Input**: `{ request_id: string }`
- **Logic**:
  1. Fetch the `peptide_requests` row (get `peptide_id`, `price`)
  2. If price is missing, look it up from the `peptides` table
  3. Call Square `POST /v2/online-checkout/payment-links` with `quick_pay`
  4. Save `payment_url` and `square_order_id` back to the request row
  5. Update status to `approved`
- **Error handling**: Unknown request returns 404, Square failure returns 502

---

## Step 4: Admin Dashboard Changes (`src/pages/Admin.tsx`)

Modify the "Approve" button handler in the Requests tab:

- Instead of directly updating status to `approved`, call `supabase.functions.invoke('create-payment-link', { body: { request_id } })`
- This generates the payment link AND sets status to approved in one step
- Show a loading spinner during the API call
- Toast on success/failure

---

## Step 5: Patient Portal Changes (`src/pages/Portal.tsx`)

Add a new "My Requests" section between "Your Peptides" and "Orders":

- Fetch `peptide_requests` for the current user
- Display each request as a card with:
  - Peptide name and variation
  - Status badge (pending = yellow, approved = green, denied = red)
  - **If approved + has payment_url**: Show a "Pay Now" button that opens the Square link
  - **If denied + has deny_reason**: Show the reason text
  - Date requested

---

## Step 6: Config Update

Add to `supabase/config.toml`:
```toml
[functions.create-payment-link]
verify_jwt = false
```

---

## Technical Details

### Square API Call (inside edge function)

```typescript
const payload = {
  idempotency_key: crypto.randomUUID(),
  quick_pay: {
    name: `${peptideName}`,
    price_money: {
      amount: Math.round(price * 100), // DB stores dollars, Square wants cents
      currency: "USD"
    },
    location_id: SQUARE_LOCATION_ID
  }
};

const res = await fetch(
  "https://connect.squareup.com/v2/online-checkout/payment-links",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
      "Square-Version": "2026-01-22",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }
);
```

### Files to Create/Modify

| File | Action |
|------|--------|
| `supabase/functions/create-payment-link/index.ts` | Create |
| `src/pages/Portal.tsx` | Add "My Requests" section |
| `src/pages/Admin.tsx` | Update approve handler to call edge function |
| Migration SQL | Add `payment_url`, `square_order_id` columns |


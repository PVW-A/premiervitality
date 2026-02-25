

## Plan: In-App Subscription Signup with Square

### Current State
The "Get Started" buttons on the Services page open static Square checkout links in a new tab. The user has no in-app signup flow -- they just get redirected to Square's hosted page.

### What You Want
A two-step in-app flow:
1. **"Get Started"** opens a modal/form collecting the user's **shipping address** and **card info**
2. **"Pay Now"** submits everything to Square, creating the customer + subscription programmatically

### Proposed Approach

**New Edge Function: `create-subscription`**
- Accepts: `tier_id`, `billing_cycle`, `address` fields, `card_nonce` (from Square Web Payments SDK)
- Uses Square APIs to:
  1. Create or update a Square Customer (with address)
  2. Create a Card on file using the card nonce
  3. Create a Subscription using the plan variation ID + customer ID + card ID
- Saves `square_customer_id` to the user's profile
- The existing webhook handles the rest (membership activation)

**Square Web Payments SDK (client-side)**
- Embed Square's JS SDK to securely tokenize the card — card details never touch our server, only a `card_nonce` token
- This is Square's required approach for PCI compliance

**UI Changes on Services Page**
- "Get Started" opens a Dialog/modal with:
  - Step 1: Address form (street, city, state, zip)
  - Step 2: Square card input (embedded iframe from their SDK)
  - "Pay Now" button at the bottom
- If the user is not logged in, redirect to `/auth` first (with a redirect-back param so they return to Services after login)
- Loading state while the subscription is being created
- Success toast + redirect to portal on completion

**Database Changes**
- Add `address_line1`, `address_city`, `address_state`, `address_zip` columns to `profiles` table so the address is saved for future use

### Technical Details

```text
User clicks "Get Started"
  └─► Not logged in? → Redirect to /auth?redirect=/services
  └─► Logged in → Open checkout modal
        ├─ Address form fields
        ├─ Square Web Payments SDK card input (tokenizes card)
        └─ "Pay Now" button
              └─► Calls edge function `create-subscription`
                    ├─ Square: CreateCustomer (with address)
                    ├─ Square: CreateCard (with nonce)
                    ├─ Square: CreateSubscription (plan + customer + card)
                    └─ Save square_customer_id to profiles
              └─► Webhook fires → membership row created
              └─► UI: success toast, redirect to /portal
```

**Files to create/modify:**
- `supabase/functions/create-subscription/index.ts` — new edge function
- `src/pages/Services.tsx` — replace static links with modal flow
- `src/components/SubscriptionCheckout.tsx` — new modal component with address form + Square card embed
- Database migration — add address columns to profiles
- `index.html` — add Square Web Payments SDK script tag

### Important Consideration
The Square Web Payments SDK requires your **Square Application ID** and **Location ID** to initialize the card payment form on the client side. The Application ID is a *public* key (safe to embed in frontend code). I will need you to provide your **Square Application ID** (found in Square Developer Dashboard → your app → Credentials).


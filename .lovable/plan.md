## Restructuring Navigation and Access Flow

### The Problem

The navbar has 5 links + account icon + Order button, and "Contact" duplicates "Order" (both open Calendly). Adding FAQ makes it worse. The Services/membership page is public but really only matters once someone is considering signing up.

### Recommended Flow

```text
VISITOR JOURNEY:
Landing → About / Peptides / FAQ / News (public education)
                    ↓
            "Get Started" CTA
                    ↓
              Auth (sign up)
                    ↓
         Portal → Membership Tiers (inside portal)
                    ↓
              Subscribe → Catalog access
```

### What Changes

**1. Navbar simplification (4 links, no crowding)**


| Current  | Proposed                              |
| -------- | ------------------------------------- |
| About    | About                                 |
| Services | FAQ (new)                             |
| Peptides | Peptides                              |
| News     | News                                  |
| Contact  | *(removed, redundant with Order CTA)* |


The "Order" button stays as the primary CTA. Services/membership pricing moves inside the portal.

**2. New FAQ page (`/faq`)**

- Static page with an accordion layout (already have `@radix-ui/react-accordion`)
- Topics: How membership works, peptide safety, ordering process, shipping, consultation process
- Ends with a CTA to sign up or book a consultation

**3. Services page moves inside the Portal**

- When an unauthenticated user hits `/services`, redirect to `/auth?redirect=/services`
- Inside the portal, add a "Membership" tab or a prominent upsell card on the dashboard for non-subscribers
- Subscribers see their current plan; non-subscribers see the tier comparison and can subscribe
- The existing `SubscriptionCheckout` component stays as-is

**4. Portal dashboard update**

- For users without an active membership: show a "Choose Your Plan" section (the current Services tier cards) above the free-portal content
- For subscribers: show current plan info with a small badge

### Files to Create/Modify


| File                        | Change                                                         |
| --------------------------- | -------------------------------------------------------------- |
| `src/pages/FAQ.tsx`         | New page with accordion Q&A sections                           |
| `src/components/Navbar.tsx` | Replace "Services" with "FAQ", remove "Contact"                |
| `src/App.tsx`               | Add `/faq` route                                               |
| `src/pages/Services.tsx`    | Add auth redirect for unauthenticated users                    |
| `src/pages/Portal.tsx`      | Add membership upsell section on dashboard for non-subscribers |


### No database changes needed

This is purely a frontend restructuring of navigation and access gating. I like your thought process, but I would also like them to be able to see the peptide still if they aren't paying yet just grab and hold their information once I make the account and continue with how you said.

&nbsp;
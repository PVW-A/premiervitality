

# Integrate Calendly Popup for All Consultation Buttons

## Overview
Replace all "Request Consultation" / "Book Consultation" / "Schedule Consultation" links (currently pointing to `#contact` or `mailto:`) with a Calendly popup widget. This gives visitors a seamless booking experience without leaving the page.

## Technical Approach

### 1. Load Calendly Widget Scripts
Add the Calendly CSS and JS to `index.html` so the `Calendly.initPopupWidget()` function is available globally.

### 2. Create a Reusable Hook
Create `src/hooks/useCalendly.ts` -- a simple helper that calls `Calendly.initPopupWidget({ url: 'https://calendly.com/admin-premiervitalityandwellness/prerequisite' })`. This keeps the logic in one place so if the link ever changes, you update it once.

### 3. Update All Consultation Buttons
Replace the `href="#contact"` or `mailto:` links across 6 locations:

| File | Button Text | Current Action |
|------|------------|----------------|
| `HeroSection.tsx` | "Request Consultation" | `href="#contact"` |
| `CTASection.tsx` | "Book Free Consultation" | `mailto:hello@...` |
| `Navbar.tsx` | "Order" (desktop + mobile) | `href="#contact"` |
| `PeptideCard.tsx` | "Schedule Consultation" | `href="/#contact"` |
| `Catalog.tsx` | "Request Consultation" | navigates to `/#contact` |
| `Services.tsx` | "Contact us" link | `href="/#contact"` |

Each will become an `<a>` or `<button>` with an `onClick` that fires the Calendly popup and `return false` to prevent navigation.

### 4. Remove or Repurpose the CTA Section
The `#contact` anchor in `CTASection` will keep its visual layout but the button will open Calendly instead of sending an email. The "Contact" nav link will also trigger the popup.

## Files Changed
- `index.html` -- add Calendly CSS/JS
- `src/hooks/useCalendly.ts` -- new helper hook
- `src/components/HeroSection.tsx` -- update consultation link
- `src/components/CTASection.tsx` -- update consultation button
- `src/components/Navbar.tsx` -- update "Contact" nav link and "Order" button
- `src/components/PeptideCard.tsx` -- update consultation link
- `src/pages/Catalog.tsx` -- update consultation link
- `src/pages/Services.tsx` -- update consultation link



## AI Patient Assistant — Strategic Analysis & Implementation Plan

### Should you add it? Yes, absolutely.

Here's why it makes strategic sense for Premier Vitality specifically:

1. **Peptide education is complex.** Your catalog has ~150 variations across multiple categories, routes, and candidates. Most visitors won't read every card. A chatbot that can answer "what peptide helps with sleep?" or "what's the difference between BPC-157 nasal vs injectable?" converts confused browsers into booked consultations.

2. **It reduces friction before the Calendly call.** Patients who arrive at a consultation already educated on what they want are higher-value leads. The chatbot pre-qualifies them.

3. **It reinforces the premium brand.** A well-designed AI concierge (not a generic chatbot widget) signals sophistication.

---

### What should it look like?

**Not a floating bubble widget.** That reads as customer support for a SaaS product. For Premier Vitality, the chatbot should feel like a **private concierge interaction**, consistent with the medical-luxury aesthetic.

Proposed design:
- **Trigger:** A subtle, fixed-bottom-right button styled as a thin champagne-gold outlined pill with a minimal icon (not a cartoon chat bubble). Think: a small PV monogram or a simple message icon at 18px.
- **Panel:** A slide-up drawer (mobile) or slide-in side panel (desktop) with the deep navy background, champagne gold accents on the input field border, and Cormorant Garamond for headings. Messages rendered in the body font (Inter/system) for readability.
- **No aggressive animations.** Smooth fade-in, no bouncing icons, no notification badges on first load.

---

### What should its name be?

Options ranked by brand fit:

| Name | Rationale | Risk |
|---|---|---|
| **PV Concierge** | Matches "premier" positioning, implies service | None |
| **Premier Guide** | Descriptive, professional | Slightly generic |
| **Dr. PV** | Personality, memorable | Could imply medical advice (compliance risk) |
| **Vita** | Short, elegant, derived from "Vitality" | Might feel too casual |

**Recommendation: "PV Concierge"** — it sets the right expectation (guidance, not diagnosis) and aligns with the luxury medical brand. The welcome message could read: *"Welcome to Premier Vitality. I can help you explore our peptide protocols, understand formulations, or connect you with our clinical team."*

---

### When should it escalate to a human?

The chatbot should refer to booking a call or texting when:

1. **Dosage or medical questions** — "What dose should I take?" → *"Dosing is personalized to your labs and health profile. Let me connect you with our clinical team."* → Calendly link or phone number.
2. **After 3+ exchanges on the same topic** — If the patient is going deep, they're ready for a real conversation.
3. **Pricing or ordering questions** — *"I'd love to walk you through our membership options. Would you like to schedule a quick call?"*
4. **Adverse effects or safety concerns** — Immediate escalation, no AI response on safety.
5. **Explicit request** — "Can I talk to someone?" → Instant handoff.

---

### Free or portal-gated?

**Hybrid approach — and here's the strategic reasoning:**

| Access Level | What they get | Why |
|---|---|---|
| **Public (unauthenticated)** | General peptide education, "what is BPC-157?", category browsing, benefits overview. Limited to ~10 messages per session. Always ends with a CTA to book a consultation or create an account. | This is a **lead generation tool**. Gating it completely means losing the conversion opportunity. |
| **Portal (authenticated, free tier)** | Same as above but with session history persistence, slightly higher message limit. | Incentivizes account creation. |
| **Portal (subscriber)** | Full access, unlimited messages, can ask about specific formulations and pricing, can initiate a peptide request directly from chat. | Rewards paying members with a premium experience. |

**Recommendation: Public with limits.** The chatbot's primary job on the public site is to convert visitors into consultations or signups. Behind the portal, it becomes a richer tool. This matches your existing tiered access model.

---

### Technical implementation

```text
┌─────────────────────────────────────────┐
│  Frontend                               │
│  ├─ ChatButton (fixed bottom-right)     │
│  ├─ ChatPanel (drawer/sheet)            │
│  │   ├─ Message list (markdown render)  │
│  │   ├─ Input bar                       │
│  │   └─ Escalation CTAs (inline)        │
│  └─ Rate limit / session tracking       │
├─────────────────────────────────────────┤
│  Backend Edge Function: pv-concierge    │
│  ├─ System prompt with peptide context  │
│  ├─ Queries peptide table for grounding │
│  ├─ Lovable AI (gemini-3-flash-preview) │
│  ├─ Escalation detection logic          │
│  └─ Message count enforcement           │
├─────────────────────────────────────────┤
│  Database                               │
│  ├─ chat_sessions table                 │
│  └─ chat_messages table (portal only)   │
└─────────────────────────────────────────┘
```

Key technical decisions:
- **AI model:** Lovable AI with `google/gemini-3-flash-preview` — fast, capable, no API key needed
- **Grounding:** The edge function queries the `peptide` table and injects relevant peptide data into the system prompt so the AI gives accurate, catalog-aware answers
- **Streaming:** SSE streaming for token-by-token rendering (feels responsive and premium)
- **Compliance:** System prompt includes strict guardrails — no dosing advice, no diagnosis, always defer to clinical team for medical questions
- **Persistence:** Anonymous sessions stored in-memory only (no DB writes). Authenticated sessions persisted to `chat_messages` table with RLS

### Files to create/modify

1. **New:** `supabase/functions/pv-concierge/index.ts` — Edge function with system prompt, peptide context injection, streaming
2. **New:** `src/components/chat/ChatButton.tsx` — Floating trigger button
3. **New:** `src/components/chat/ChatPanel.tsx` — Slide-up chat interface with message rendering
4. **New:** `src/components/chat/ChatMessage.tsx` — Individual message component with markdown support
5. **Modify:** `src/App.tsx` — Add ChatButton to the global layout
6. **Database migration:** `chat_sessions` and `chat_messages` tables with RLS policies for authenticated users


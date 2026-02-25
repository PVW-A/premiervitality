

## Vitality Score — Always Visible + Actionable Drill-Down

### The Problem
Right now the Vitality Score is buried inside the "Vitality Score" tab. Users only see it when they navigate there. You want it to be persistent and clickable — showing what needs improvement when tapped.

### Proposed Approach

**1. Move the Vitality Score into the Portal header area (always visible)**

Place a compact Vitality Score badge in the welcome section at the top of the Portal page — visible on every tab. It would show:
- The circular score ring (smaller, ~56px) with the number
- The label (Excellent / Good / Fair / etc.)

This lives above the tabs, so whether you're on Dashboard, Vitality Score, News, or Rewards — you always see your number.

**2. Clicking it opens a full-screen dialog with improvement insights**

When clicked, a dialog/sheet slides up with:
- The full-size score ring at the top
- **Category breakdown** — a mini progress bar per category (Hormones: 78, Metabolic: 92, Lipids: 61, etc.) showing which areas drag the score down
- **Top 3-5 markers that need attention** — the ones graded "low", "high", or "critical" — each with their current value, grade, and the "How to improve" tips already in the data
- **A CTA button** that navigates to the Vitality Score tab for the full deep-dive

**3. Portal tab rename**

Since the score widget moves to the header, rename the tab from "Vitality Score" to "Biomarkers" or keep "Vitality Score" as the tab name (it now acts as the detailed breakdown view).

### Technical Details

- **New component**: `VitalityScoreBadge` — a compact, clickable version of the score ring rendered in `Portal.tsx` in the welcome header section
- **New component**: `VitalityScoreDrawer` — a Dialog or Sheet that opens on click, computing per-category scores and surfacing the worst-performing markers with their improvement tips
- **Data flow**: The `computeVitalityScore` function and `categoryConfig` will be extracted from `PremierMarkers.tsx` into a shared file (e.g., `src/lib/vitality.ts`) so both the badge and the full tab can use the same scoring logic
- **Portal.tsx changes**: Fetch `biomarker_results` at the Portal level (instead of only inside PremierMarkers) so the score is available across tabs. Pass results down to PremierMarkers.
- The full `VitalityScoreWidget` inside the Vitality Score tab remains as-is for the detailed view

```text
┌─────────────────────────────────────┐
│  PV Logo    Patient Portal    [Out] │
├─────────────────────────────────────┤
│  Welcome, Nicolas                   │
│  Your peptide inventory...          │
│                         ┌─────────┐ │
│                         │  (72)   │ │  ← Compact score ring, always visible
│                         │  Good   │ │
│                         └─────────┘ │
├─────────────────────────────────────┤
│  Dashboard │ Vitality Score │ News  │
├─────────────────────────────────────┤
│  ... tab content ...                │
└─────────────────────────────────────┘

       Click on score → opens drawer:

┌─────────────────────────────────────┐
│         Vitality Score              │
│            (72)                     │
│            Good                     │
│                                     │
│  Category Breakdown                 │
│  ▓▓▓▓▓▓▓░░░ Hormones      78       │
│  ▓▓▓▓▓▓▓▓▓░ Metabolic     92       │
│  ▓▓▓▓▓░░░░░ Lipids        52       │
│                                     │
│  Top Areas to Improve               │
│  • LDL Cholesterol — High           │
│    Reduce saturated fats, fiber...  │
│  • Triglycerides — High             │
│    Cut sugar, omega-3...            │
│                                     │
│  [View All Biomarkers →]            │
└─────────────────────────────────────┘
```

### Files to Create/Modify
- **Create** `src/lib/vitality.ts` — extract scoring logic, `categoryConfig`, grade helpers
- **Create** `src/components/portal/VitalityScoreBadge.tsx` — compact clickable score ring
- **Create** `src/components/portal/VitalityScoreDrawer.tsx` — the drill-down sheet with category breakdown and improvement tips
- **Modify** `src/pages/Portal.tsx` — fetch biomarker data at top level, render badge in header, pass data to PremierMarkers
- **Modify** `src/components/portal/PremierMarkers.tsx` — import shared config from `vitality.ts` instead of defining locally, remove the `VitalityScoreWidget` from the top (it lives in the header now)


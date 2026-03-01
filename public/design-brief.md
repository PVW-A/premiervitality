# Premier Vitality & Wellness — Design Brief

## Brand Overview
Premier Vitality & Wellness is a physician-directed peptide therapy clinic specializing in longevity, anti-aging, performance optimization, and cellular recovery. The brand exudes **luxury medical aesthetics** — refined, clinical, and confident.

---

## Typography

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| **Headings** | Cormorant Garamond (serif) | 300 (Light), 400, 500 | All h1–h6, hero text, section titles |
| **Body** | Inter (sans-serif) | 200, 300, 400, 500 | Paragraph text, nav links, buttons, labels |

- Headings use **font-weight: 300** (light) for an elegant, editorial feel.
- Nav links and buttons use **uppercase with wide letter-spacing** (`0.2em–0.35em`), font-weight light, very small size (`text-xs`).

---

## Color Palette (HSL)

### Light Mode
| Token | HSL | Hex (approx) | Usage |
|-------|-----|---------------|-------|
| **Background** | 40 20% 96% | #F5F3F0 | Page background — warm off-white |
| **Foreground** | 220 26% 14% | #1A2332 | Primary text — deep navy |
| **Primary** | 39 38% 45% | #9F8A5A | Accent / CTA — muted gold |
| **Primary Foreground** | 40 20% 96% | #F5F3F0 | Text on primary buttons |
| **Secondary** | 220 12% 88% | #DCDFE4 | Secondary surfaces |
| **Muted** | 220 12% 90% | #E2E4E8 | Subtle backgrounds |
| **Muted Foreground** | 218 12% 45% | #656D7A | Secondary text |
| **Card** | 40 18% 92% | #EDEBE6 | Card backgrounds — warm gray |
| **Border** | 220 14% 84% | #D2D5DB | Borders / dividers |
| **Destructive** | 0 84% 60% | #EF4444 | Error / danger |

### Dark Mode
| Token | HSL | Hex (approx) | Usage |
|-------|-----|---------------|-------|
| **Background** | 216 30% 6% | #0B1017 | Page background — near black |
| **Foreground** | 40 20% 92% | #EDE9E3 | Primary text — warm off-white |
| **Primary** | 39 38% 60% | #C4A96E | Accent — brighter gold |
| **Card** | 220 26% 11% | #151D2B | Card surfaces |
| **Border** | 220 20% 18% | #262F3D | Borders |
| **Muted Foreground** | 218 12% 55% | #7D8694 | Secondary text |

### Color Philosophy
- **Warm neutrals** (40° hue family) for backgrounds — gives a clinic-meets-spa feel.
- **Muted gold** as the single accent color — used sparingly for CTAs, links, accent lines.
- **Deep navy** for text — avoids pure black for softer readability.
- No gradients on buttons. Background gradients are used subtly on sections (radial overlays, noise textures).

---

## Logo / Monogram

- **PV Monogram**: SVG text element using Cormorant Garamond italic, weight 300, letter-spacing -4, filled with the primary gold color (`hsl(39, 38%, 60%)`).
- Used at `w-8 h-8` in the navbar and `w-16 h-16` elsewhere.
- No icon/symbol — purely typographic.

---

## UI Patterns

### Buttons
- **Primary CTA**: Bordered (not filled), `border-primary/40`, text in primary gold, uppercase, wide tracking, `text-xs`, no border-radius (`rounded-none`).
- **Hover**: `bg-primary/10` — subtle gold tint on hover.
- **Secondary/Ghost**: Same style, muted-foreground color.

### Cards
- Background: `card` token (warm gray in light, dark navy in dark).
- Borders: `border` token, subtle.
- No heavy box shadows. Depth comes from layered backgrounds and subtle opacity.

### Navigation
- Fixed top bar, `bg-background/90 backdrop-blur-md`.
- Links: uppercase, `text-xs`, wide letter-spacing, `text-muted-foreground` → `text-foreground` on hover.
- Mobile: animated slide-down menu via Framer Motion.

### Sections
- Full-width sections with layered backgrounds (gradients, radial overlays, SVG noise textures).
- Generous vertical padding (`py-24` to `py-32`).
- Content constrained to `max-w-7xl`.
- Scroll-triggered fade/slide animations via Framer Motion (`whileInView`).

---

## Animation Approach
- **Library**: Framer Motion
- **Pattern**: Scroll-triggered entrance animations (`initial` → `whileInView`, `viewport={{ once: true }}`).
- **Style**: Subtle fade + slide-up (opacity 0→1, y 30→0). Staggered delays for lists.
- **Hero**: More elaborate — orbit rings, ambient pulse, radial glow effects.
- **Transitions**: 300ms ease for hovers/interactions.

---

## Layout & Spacing
- **Border radius**: `0.5rem` base (but CTAs use `rounded-none` for a sharp editorial look).
- **Container**: Centered, `max-w-7xl`, `padding: 2rem`.
- **Grid**: 2-column layouts for founder bios, stat cards. Single column on mobile.
- **Breakpoints**: Mobile-first. `md:` for desktop nav. `sm:` for minor adjustments.

---

## Imagery
- **Hero**: Full-bleed background image with dark overlay and radial glow.
- **Founders**: Circular portrait photos with `object-cover`.
- **Products**: Clean product shots (peptide vials) on transparent/neutral backgrounds.
- **Style**: Clinical and editorial — no stock-photo smiles. Dark, moody, confident.

---

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS with semantic design tokens (CSS custom properties)
- Framer Motion for animations
- shadcn/ui component library (Radix UI primitives)
- Lucide React icons (thin stroke, `strokeWidth={1.2}`)

---

## Key Pages
| Page | Purpose |
|------|---------|
| `/` | Landing — hero, about, vitality score, biological age, bloodwork, peptides carousel, founders, CTA |
| `/about` | Company story, founders, pillars |
| `/peptides` | Full peptide catalog |
| `/services` | Membership tiers |
| `/faq` | Accordion FAQ |
| `/auth` | Login / signup |
| `/portal` | Patient dashboard (authenticated) |
| `/news` | Research articles |

---

## Brand Voice
- **Tone**: Clinical authority meets luxury wellness. Confident but not aggressive.
- **Language**: Evidence-based, physician-directed, personalized, precision.
- **Avoid**: Hype, miracle claims, casual/colloquial language.

---

## Live Site
- Preview: https://premiervitality.lovable.app

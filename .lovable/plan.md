

## Meet the Founders Section

Add a refined "Meet the Founders" section to the landing page, positioned between the About section and the CTA section. This keeps the page flowing naturally: Hero -> About -> Founders -> CTA.

### Design Approach

A side-by-side layout featuring Dr. James Loo and Nicolas Loo, styled to match the existing dark/gold aesthetic. Each founder gets a placeholder avatar with their initials, name, title, and a brief description highlighting the father-son dynamic and their complementary expertise.

The section will use the same animation patterns (framer-motion fade-in) and typography conventions (Cormorant Garamond headings, Inter body text, tracking-wide uppercase labels) already used throughout the site.

### Layout

- Section label: "Our Founders"
- Heading: "A Legacy of Innovation"
- Two cards side by side (stacked on mobile), each with:
  - Circular avatar placeholder with gold-accented initials
  - Name and title
  - Short bio paragraph
- Subtle gold accent line or border to tie into the brand

### Changes

**1. Create `src/components/FoundersSection.tsx`**
- New component with two founder cards
- Dr. James Loo: positioned as the medical authority (e.g., "Physician & Co-Founder")
- Nicolas Loo: positioned as the innovation/operations side (e.g., "Co-Founder")
- Placeholder bios that can be easily updated later
- Framer Motion scroll-triggered animations matching the About section style
- Responsive: two columns on desktop, single column on mobile

**2. Update `src/pages/Index.tsx`**
- Import and add `<FoundersSection />` between `<AboutSection />` and `<CTASection />`

No database changes or new dependencies required.

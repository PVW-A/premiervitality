

## Remove Essential 5% Discount + Clarify Bloodwork Coverage

### What Changes

**1. Update Essential tier — remove the 5% peptide discount**
- Set `discount_pct` from `5` to `0` in the `membership_tiers` table
- Update the `features` JSON array to replace "5% discount on peptides" with "Full-price peptide access" or similar
- The Essential tier becomes the "access fee" — you get in the door, get your bloodwork panel, and can order peptides at list price
- Premium (15%) and Elite (25%) become the clear upgrade path for savings

**2. Update UI copy to clarify what the bloodwork benefit covers**
- On the Services page tier cards, make the blood work line more specific (e.g., "1 comprehensive panel per year (65+ biomarkers)" instead of just "Annual blood work")
- Same for Premium ("2 panels/year") and Elite ("4 panels/year")
- Update the FAQ to reflect this — add a question like "What does the included bloodwork cover?"

**3. Upload bloodwork pricing file**
- You mentioned you have a pricing file — once you upload it, I can reference the exact panel name, biomarker count, and retail cost so we can show users the value they're getting (e.g., "Includes 1 Premier Panel valued at $XXX/year")

### Files to Modify
- **Database**: `UPDATE membership_tiers` — set Essential `discount_pct = 0`, update `features` JSON
- **`src/pages/Services.tsx`** — update the blood work display line to show biomarker count and frequency more clearly
- **`src/pages/FAQ.tsx`** — update relevant Q&As about membership value and bloodwork coverage
- **`src/components/CatalogPeptideCard.tsx`** — no changes needed (discount logic already reads from DB)

### Next Step
Go ahead and upload that bloodwork pricing file so I can reference the exact panel details and cost in the copy. I'll make the database and UI changes together once I have that info.


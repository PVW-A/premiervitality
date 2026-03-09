// Single source of truth for membership tiers
// Used by portal, peptide catalog, checkout, and admin

export interface MembershipTier {
  id: string;
  name: string;
  price: number;          // monthly
  annualPrice: number;    // monthly equivalent when billed annually
  discount: number;       // peptide discount % (0 = no discount)
  showDiscount: boolean;  // false for legacy + essential
  purchasable: boolean;   // false for legacy (invite-only)
  popular?: boolean;
  features: string[];
  squarePlanId?: string;  // set after creating Square subscription plan
}

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: "legacy",
    name: "Legacy",
    price: 0,
    annualPrice: 0,
    discount: 0,
    showDiscount: false,
    purchasable: false,
    features: [
      "1 Core Checkup/year blood work",
      "As-needed physician access",
      "Full peptide catalog access",
      "Founding member status",
    ],
  },
  {
    id: "essential",
    name: "Essential",
    price: 99,
    annualPrice: 82,  // ~17% off
    discount: 0,
    showDiscount: false,
    purchasable: true,
    features: [
      "1 Baseline + 1 Core Checkup/year",
      "Initial consultation included",
      "Full peptide catalog access",
      "Physician-reviewed treatment requests",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 199,
    annualPrice: 165,
    discount: 15,
    showDiscount: true,
    purchasable: true,
    popular: true,
    features: [
      "15% off all peptide orders",
      "1 Baseline + 2 Core Checkups/year",
      "Quarterly physician check-ins",
      "Full peptide catalog access",
      "Priority request processing",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: 349,
    annualPrice: 290,
    discount: 25,
    showDiscount: true,
    purchasable: true,
    features: [
      "25% off all peptide orders",
      "1 Baseline + 3 Core Checkups/year",
      "Monthly physician check-ins",
      "Full peptide catalog access",
      "Dedicated care coordinator",
      "Same-day request review",
    ],
  },
];

export const getTierById = (id: string): MembershipTier | undefined =>
  MEMBERSHIP_TIERS.find(t => t.id === id);

export const getDiscountedPrice = (originalPrice: number, tierId: string): number => {
  const tier = getTierById(tierId);
  if (!tier || tier.discount === 0) return originalPrice;
  return parseFloat((originalPrice * (1 - tier.discount / 100)).toFixed(2));
};

export const formatDiscount = (tierId: string): string | null => {
  const tier = getTierById(tierId);
  if (!tier || !tier.showDiscount || tier.discount === 0) return null;
  return `${tier.discount}% member discount applied`;
};

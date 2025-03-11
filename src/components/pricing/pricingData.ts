
// Pricing data for all plan options

// Monthly and annual pricing values
export const PRICING = {
  starterMonthly: 299,
  starterAnnual: 299,
  proMonthly: 499,
  proAnnual: 499
};

// Calculate savings
export const SAVINGS = {
  starter: Math.round(PRICING.starterMonthly * 12 - PRICING.starterAnnual * 12),
  pro: Math.round(PRICING.proMonthly * 12 - PRICING.proAnnual * 12)
};

// Features for each plan with improved organization and wording
export const FEATURES = {
  free: [
    { text: "Browse & Discover Content Creators", primary: true },
    { text: "Limited Access to Creator Profiles", primary: true },
    { text: "Preview Marketplace Features", primary: true }
  ],
  starter: [
    { text: "Essential visual narrative", primary: true },
    { text: "Curated property moments", primary: true },
    { text: "Core spatial storytelling", primary: true },
    { text: "Foundational amenity presence", primary: true },
    { text: "48-hour creative delivery", primary: true }
  ],
  pro: [
    { text: "Expanded visual storytelling", primary: true },
    { text: "Cinematic property sequence", primary: true },
    { text: "Elevated aerial perspective", primary: true },
    { text: "Environmental context", primary: true },
    { text: "Lifestyle integration", primary: true },
    { text: "24-hour creative delivery", primary: true },
    { text: "Comprehensive visual identity", primary: true },
    { text: "Feature-length property film", primary: true },
    { text: "Signature aerial sequences", primary: true }
  ]
};

// Value propositions for each plan
export const VALUE_PROPOSITIONS = {
  basic: "Perfect for property owners who want their spaces presented with clarity and purpose.",
  professional: "Designed for real estate professionals who understand the power of visual storytelling.",
  premium: "For visionaries who demand a complete visual transformation that creates emotional connection."
};

// Plan descriptions
export const PLAN_DESCRIPTIONS = {
  basic: "THE FOUNDATION",
  professional: "THE NARRATIVE",
  premium: "THE MASTERPIECE"
};

// Plan CTAs
export const PLAN_CTAS = {
  basic: "BEGIN TRANSFORMATION",
  professional: "CRAFT YOUR NARRATIVE",
  premium: "CREATE YOUR MASTERPIECE"
};

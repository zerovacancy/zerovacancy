
// Pricing data for all plan options

// Monthly and annual pricing values
export const PRICING = {
  starterMonthly: 299,
  starterAnnual: 249,  // Discounted annual rate
  proMonthly: 499,
  proAnnual: 399       // Discounted annual rate
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
    { text: "Professional photography (25+ images)", primary: true },
    { text: "Property highlights edit", primary: true },
    { text: "Basic floor plan", primary: true },
    { text: "Social media optimized images", primary: true },
    { text: "48-hour delivery", primary: true }
  ],
  pro: [
    { text: "All Essential features", primary: true },
    { text: "Twilight/golden hour shots", primary: true },
    { text: "Professional video walkthrough", primary: true },
    { text: "Standard drone footage", primary: true },
    { text: "3D virtual tour", primary: true },
    { text: "24-hour delivery", primary: true }
  ],
  premium: [
    { text: "All Professional features", primary: true },
    { text: "Lifestyle photography", primary: true },
    { text: "Cinematic property film", primary: true },
    { text: "Advanced aerial cinematography", primary: true },
    { text: "Virtual staging options", primary: true },
    { text: "Priority scheduling", primary: true },
    { text: "Same-day editing available", primary: true }
  ]
};

// Value propositions for each plan
export const VALUE_PROPOSITIONS = {
  starter: "Core visual assets for effectively marketing residential and small commercial properties.",
  pro: "Comprehensive visual package for properties that need to stand out in competitive markets.",
  premium: "Complete visual marketing suite for luxury properties and developments requiring exceptional presentation."
};

// Plan descriptions
export const PLAN_DESCRIPTIONS = {
  starter: "ESSENTIAL",
  pro: "PROFESSIONAL",
  premium: "PREMIUM"
};

// Plan CTAs
export const PLAN_CTAS = {
  starter: "SELECT ESSENTIAL",
  pro: "SELECT PROFESSIONAL",
  premium: "SELECT PREMIUM"
};

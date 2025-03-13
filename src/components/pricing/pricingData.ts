
// Pricing data for all plan options

// Monthly and annual pricing values
export const PRICING = {
  starterMonthly: 0,
  starterAnnual: 0,    // Free tier
  proMonthly: 99,
  proAnnual: 79,       // Discounted annual rate
  premiumMonthly: 399,
  premiumAnnual: 329   // Discounted annual rate
};

// Calculate savings
export const SAVINGS = {
  starter: 0, // No savings for free tier
  pro: Math.round(PRICING.proMonthly * 12 - PRICING.proAnnual * 12),
  premium: Math.round(PRICING.premiumMonthly * 12 - PRICING.premiumAnnual * 12)
};

// Features for each plan with improved organization and wording
export const FEATURES = {
  free: [
    { text: "[Core Features] Browse & Discover Content Creators", primary: true },
    { text: "[Core Features] Limited Access to Creator Profiles", primary: true },
    { text: "[Core Features] Preview Marketplace Features", primary: true }
  ],
  pro: [
    { text: "[Core Access] Submit Requests for Proposals (RFPs)", primary: true },
    { text: "[Core Access] Browse & Hire Premium Creators", primary: true },
    { text: "[Core Access] 1 Revision Included Per Project", primary: true },
    { text: "[Content Optimization] Social Media Optimized Content", primary: true },
    { text: "[Content Optimization] SEO-Optimized Content", primary: true },
    { text: "[Content Optimization] Geo-Targeted Content", primary: true }
  ],
  premium: [
    { text: "[Premium Access] Submit Requests for Proposals (RFPs) Instantly", primary: true },
    { text: "[Premium Access] Browse & Hire Premium Creators", primary: true },
    { text: "[Premium Access] 3 Revisions Included Per Project", primary: true },
    { text: "[Content Optimization] Social Media Optimized Content", primary: true },
    { text: "[Content Optimization] SEO-Optimized Content", primary: true },
    { text: "[Content Optimization] Geo-Targeted Content", primary: true },
    { text: "[Advanced Features] Marketing Channel Optimization", primary: true },
    { text: "[Premium Benefits] 7-Day Money-Back Guarantee", primary: true },
    { text: "[Advanced Features] Performance Insights Dashboard", primary: true }
  ]
};

// Value propositions for each plan
export const VALUE_PROPOSITIONS = {
  starter: "Perfect for property owners/managers who want to browse content creators before committing.",
  pro: "Designed for real estate professionals who need high-quality visuals and content that performs.",
  premium: "For luxury property managers and high-volume real estate professionals who demand the best."
};

// Plan descriptions
export const PLAN_DESCRIPTIONS = {
  starter: "BASIC",
  pro: "PROFESSIONAL",
  premium: "PREMIUM"
};

// Plan CTAs
export const PLAN_CTAS = {
  starter: "START FOR FREE",
  pro: "CHOOSE PROFESSIONAL",
  premium: "GET PREMIUM"
};

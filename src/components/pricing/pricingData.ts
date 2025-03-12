
// Pricing data for all plan options

// Monthly and annual pricing values
export const PRICING = {
  starterMonthly: 0,
  starterAnnual: 0,    // Free tier
  proMonthly: 99,
  proAnnual: 79,       // 20% discount (equivalent to $79/mo billed annually)
  premiumMonthly: 399,
  premiumAnnual: 329   // ~18% discount (equivalent to $329/mo billed annually)
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
    { text: "Browse & Discover Content Creators", primary: true },
    { text: "Limited Access to Creator Profiles", primary: true },
    { text: "Preview Marketplace Features", primary: true }
  ],
  pro: [
    { text: "Submit Requests for Proposals (RFPs)", primary: true },
    { text: "Browse & Hire Premium Creators", primary: true },
    { text: "1 Revision Included Per Project", primary: true },
    { text: "Social Media Optimized Content", primary: true },
    { text: "SEO-Optimized Content", primary: true },
    { text: "Geo-Targeted Content", primary: true }
  ],
  premium: [
    { text: "Submit Requests for Proposals (RFPs) Instantly", primary: true },
    { text: "Browse & Hire Premium Creators", primary: true },
    { text: "3 Revisions Included Per Project", primary: true },
    { text: "Social Media Optimized Content", primary: true },
    { text: "SEO-Optimized Content", primary: true },
    { text: "Geo-Targeted Content", primary: true },
    { text: "Marketing Channel Optimization", primary: true },
    { text: "7-Day Money-Back Guarantee", primary: true },
    { text: "Performance Insights Dashboard", primary: true }
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

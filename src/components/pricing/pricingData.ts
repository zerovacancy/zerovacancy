
// Pricing data for all plan options

// Monthly and annual pricing values
export const PRICING = {
  starterMonthly: 99,
  starterAnnual: 79,
  proMonthly: 399,
  proAnnual: 319
};

// Calculate savings
export const SAVINGS = {
  starter: Math.round(PRICING.starterMonthly * 12 - PRICING.starterAnnual * 12),
  pro: Math.round(PRICING.proMonthly * 12 - PRICING.proAnnual * 12)
};

// Features for each plan with improved organization and wording
export const FEATURES = {
  free: [
    { text: "Browse & Discover Content Creators", primary: true, category: "Access & Discovery" },
    { text: "Limited Access to Creator Profiles", primary: true, category: "Access & Discovery", tooltip: "View limited details of creator profiles before signing up" },
    { text: "Preview Marketplace Features", primary: true, category: "Access & Discovery" }
  ],
  starter: [
    { text: "Submit Requests for Proposals (RFPs)", primary: true, category: "Submit Requests" },
    { text: "Browse & Hire Premium Creators", primary: true, category: "Submit Requests" },
    { text: "1 Revision Included Per Project", primary: true, category: "Submit Requests" },
    { text: "Social Media Optimized Content", primary: true, category: "Content Optimization", tooltip: "Content sized and formatted optimally for social media platforms" },
    { text: "SEO-Optimized Content", primary: true, category: "Content Optimization", tooltip: "Content enhanced to improve search engine visibility" },
    { text: "Geo-Targeted Content", primary: true, category: "Content Optimization", tooltip: "Content optimized for specific geographic locations" }
  ],
  pro: [
    { text: "Submit Requests for Proposals (RFPs) Instantly", primary: true, category: "Premium Requests & Access" },
    { text: "Browse & Hire Premium Creators", primary: true, category: "Premium Requests & Access" },
    { text: "3 Revisions Included Per Project", primary: true, category: "Premium Requests & Access", tooltip: "Get more opportunities to refine your content" },
    { text: "Social Media Optimized Content", primary: true, category: "Advanced Content Optimization" },
    { text: "SEO-Optimized Content", primary: true, category: "Advanced Content Optimization" },
    { text: "Geo-Targeted Content", primary: true, category: "Advanced Content Optimization" },
    { text: "Marketing Channel Optimization", primary: true, category: "Advanced Content Optimization", tooltip: "Content optimized for various marketing channels including email, ads, and listings" },
    { text: "7-Day Money-Back Guarantee", primary: true, category: "Premium Benefits" },
    { text: "Performance Insights Dashboard", primary: true, category: "Premium Benefits", tooltip: "Analytics dashboard to track content performance" }
  ]
};

// Value propositions for each plan
export const VALUE_PROPOSITIONS = {
  basic: "Perfect for property owners/managers who want to browse content creators before committing.",
  professional: "Designed for real estate professionals who need high-quality visuals and content that performs.",
  premium: "For luxury property managers and high-volume real estate professionals who demand the best."
};

// Plan descriptions
export const PLAN_DESCRIPTIONS = {
  basic: "Explore the Marketplace & Get Started",
  professional: "Elevate Your Marketing with Optimized Content",
  premium: "The Ultimate Content Solution for Maximum Visibility & Conversions"
};

// Plan CTAs
export const PLAN_CTAS = {
  basic: "Upgrade to unlock project requests and premium content!",
  professional: "Upgrade to Premium for more revisions, deeper insights, and content that works across all marketing channels.",
  premium: "Dominate your market with cutting-edge content and data-driven insights!"
};

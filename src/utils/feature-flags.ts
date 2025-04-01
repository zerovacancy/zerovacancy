/**
 * Feature flag management for ZeroVacancy
 * 
 * This file centralizes feature flag management for the application.
 * These utilities allow administrators to enable or disable features
 * in different environments.
 */

import { enableAgencyOption, disableAgencyOption } from '../components/auth/UserTypeSelection';

// Feature flags
export const featureFlags = {
  agency: {
    enable: enableAgencyOption,
    disable: disableAgencyOption,
    description: "Enables the Digital Agency user type during onboarding"
  }
};

// Expose feature flags to window object for admin console access
if (typeof window !== 'undefined') {
  (window as any).zerovacancy = {
    ...(window as any).zerovacancy,
    features: featureFlags
  };
}

/**
 * Usage instructions for administrators:
 * 
 * To enable the agency feature in production, open the browser console and run:
 * zerovacancy.features.agency.enable()
 * 
 * To disable:
 * zerovacancy.features.agency.disable()
 * 
 * After toggling, refresh the page to see changes.
 */
/**
 * Background Patterns and Textures for Sections
 * These SVG patterns are used for section backgrounds with low opacity
 */

// 1. HERO SECTION: Deep lavender with 10% opacity purple dot matrix pattern
export const heroPatternDotMatrix = `
<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
  <circle cx="10" cy="10" r="1" fill="#8A42F5" fill-opacity="0.5"/>
  <circle cx="0" cy="0" r="1" fill="#8A42F5" fill-opacity="0.5"/>
  <circle cx="0" cy="20" r="1" fill="#8A42F5" fill-opacity="0.5"/>
  <circle cx="20" cy="0" r="1" fill="#8A42F5" fill-opacity="0.5"/>
  <circle cx="20" cy="20" r="1" fill="#8A42F5" fill-opacity="0.5"/>
</svg>
`;

// 2. FIND CREATORS SECTION: Soft champagne with 5% opacity grid texture
export const findCreatorsPatternGrid = `
<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0h40v1h-40z" fill="#B8A88A" fill-opacity="0.15"/>
  <path d="M0 0v40h1v-40z" fill="#B8A88A" fill-opacity="0.15"/>
</svg>
`;

// 3. HOW IT WORKS SECTION: Pale mint with faint diagonal line pattern
export const howItWorksPatternDiagonal = `
<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 40L40 0" stroke="#5FAF87" stroke-opacity="0.15" stroke-width="1"/>
</svg>
`;

// 4. FEATURES SECTION: Rich periwinkle with subtle honeycomb texture
export const featuresPatternHoneycomb = `
<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 8.5L24 0L36 8.5L36 25.5L24 34L12 25.5L12 8.5Z" stroke="#6A70E3" stroke-opacity="0.15" stroke-width="1" fill="none"/>
  <path d="M36 8.5L48 0L48 17L48 34L36 25.5L36 8.5Z" stroke="#6A70E3" stroke-opacity="0.15" stroke-width="1" fill="none"/>
  <path d="M36 25.5L48 34L48 51L36 42.5L24 51L12 42.5L0 51L0 34L12 25.5L24 34L36 25.5Z" stroke="#6A70E3" stroke-opacity="0.15" stroke-width="1" fill="none"/>
  <path d="M12 8.5L0 0L0 17L0 34L12 25.5L12 8.5Z" stroke="#6A70E3" stroke-opacity="0.15" stroke-width="1" fill="none"/>
</svg>
`;

// 5. PRICING SECTION: Soft blue-grey with faint paper texture
export const pricingPatternPaper = `
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 16L56 16" stroke="#AABDD1" stroke-opacity="0.12" stroke-width="0.5"/>
  <path d="M8 32L56 32" stroke="#AABDD1" stroke-opacity="0.12" stroke-width="0.5"/>
  <path d="M8 48L56 48" stroke="#AABDD1" stroke-opacity="0.12" stroke-width="0.5"/>
  <path d="M16 8L16 56" stroke="#AABDD1" stroke-opacity="0.12" stroke-width="0.5"/>
  <path d="M32 8L32 56" stroke="#AABDD1" stroke-opacity="0.12" stroke-width="0.5"/>
  <path d="M48 8L48 56" stroke="#AABDD1" stroke-opacity="0.12" stroke-width="0.5"/>
</svg>
`;

/**
 * Helper function to convert SVG to data URL
 */
export function svgToDataURL(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml;utf8,${encoded}`;
}

/**
 * Helper function to generate CSS background with pattern
 */
export function generateBackgroundWithPattern(
  backgroundColor: string,
  pattern: string,
  opacity: number = 1
): React.CSSProperties {
  return {
    backgroundColor,
    backgroundImage: `url("${svgToDataURL(pattern)}")`,
    backgroundSize: pattern.includes('width="64"') ? '64px 64px' : 
                    pattern.includes('width="48"') ? '48px 48px' : 
                    pattern.includes('width="40"') ? '40px 40px' : '20px 20px',
    backgroundRepeat: 'repeat',
    backgroundBlendMode: 'multiply',
    opacity,
    transition: 'background-color 0.3s ease-out',
  };
}
# ZeroVacancy OG Image

This directory contains the Open Graph (OG) image used for link previews when sharing ZeroVacancy links on social media platforms, messaging apps, and other services that support link previews.

## About the OG Image

- **File**: `og-image.png`
- **Dimensions**: 1200 × 630 pixels (2x resolution for retina displays)
- **Format**: PNG
- **Purpose**: Creates an attractive, professional preview when ZeroVacancy links are shared online

## Regenerating the OG Image

If you need to update the OG image (changing text, colors, layout, etc.):

1. Edit the HTML template in `public/og-image-new.html`
2. Run the generator script:
   ```
   npm run generate-og
   ```
3. The script will create a new `og-image.png` in the `public` directory

## Technical Details

- The OG image is generated using Puppeteer, which creates a screenshot of the HTML template
- The HTML template uses custom styling to create a visually appealing preview
- Images used in the OG image are loaded from the public directory
- The script is configured to generate a high-resolution image (2x) for retina displays

## Best Practices for OG Images

- Keep text concise and readable (minimum 14px font size)
- Use high-contrast colors for text vs background
- Include the ZeroVacancy logo and branding
- Maintain a 1200 × 630 pixel aspect ratio
- Optimize the image for fast loading
- Test the preview on multiple platforms (Facebook, Twitter, LinkedIn, iMessage, etc.)

## Metadata Tags

The corresponding metadata tags are in `index.html`. If you change the OG image, make sure the metadata tags are still accurate:

```html
<!-- Open Graph / Facebook -->
<meta property="og:image" content="https://www.zerovacancy.ai/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="ZeroVacancy - The premium marketplace for real estate content creators">

<!-- Twitter -->
<meta name="twitter:image" content="https://www.zerovacancy.ai/og-image.png">
<meta name="twitter:image:alt" content="ZeroVacancy - The premium marketplace for real estate content creators">
```

## Additional Resources

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
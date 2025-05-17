# CLS Testing Guide

This guide documents the tools and procedures for testing Cumulative Layout Shift (CLS) prevention in the ZeroVacancy project.

## Available Testing Tools

### 1. CLS Prevention Verification

A comprehensive test suite that analyzes multiple aspects of CLS prevention:

- Verifies required CSS variables are set
- Tests CSS containment on critical elements
- Monitors layout shifts (CLS) during page load and interaction
- Verifies rendering stabilization
- Tests resize handling and orientation changes

**Usage:**

- **Automatic:** Add `?debug=cls-verify` to any URL
- **Manual:** Run `window.verifyCLSPrevention()` in the browser console

**Example:**
```
https://www.zerovacancy.ai/?debug=cls-verify
```

The script will generate a detailed report with scores and recommendations.

### 2. CLS Display Monitor

A lightweight visual indicator that shows real-time CLS metrics in the corner of the screen. Useful for mobile testing where accessing the console is difficult.

**Usage:**

- **Automatic:** Add `?debug=cls-display` to any URL
- **Manual:** Run `window.CLSDisplay.start()` in the browser console

**Example:**
```
https://www.zerovacancy.ai/?debug=cls-display
```

The tool shows a circular indicator that changes color based on CLS score:
- Green: Good (CLS < 0.1)
- Orange: Needs Improvement (CLS 0.1-0.25)
- Red: Poor (CLS > 0.25)

### 3. Real-time Layout Shift Monitoring

Highlights elements causing layout shifts in real-time, with detailed console logging.

**Usage:**

- Add `?debug=cls` to any URL

**Example:**
```
https://www.zerovacancy.ai/?debug=cls
```

Elements causing layout shifts will be highlighted with a red outline, and detailed information will be logged to the console.

### 4. Comprehensive Debug Mode

Enables all CLS debugging tools at once.

**Usage:**

- Add `?debug=all` to any URL

**Example:**
```
https://www.zerovacancy.ai/?debug=all
```

### 5. Quick CLS Check (On-Demand Testing)

For quick testing directly from the console:

```javascript 
fetch('/verify-cls-prevention.js').then(r => r.text()).then(t => eval(t))
```

## Testing Procedures

### Desktop Testing

1. **Basic Load Test**
   - Load the page with `?debug=cls` parameter
   - Note the final CLS score and any highlighted elements
   - Check if score is below 0.1 (good)

2. **Resize Test**
   - Load the page with `?debug=cls-verify` parameter
   - The verification will automatically test resize handling
   - Check the "Resize Handling" section of the report

3. **Navigation Test**
   - Start with `?debug=cls-display` parameter
   - Navigate through multiple pages using links
   - Monitor the CLS indicator between page transitions

### Mobile Testing

1. **Device Orientation Test**
   - Load the page with `?debug=cls-display` parameter
   - Rotate the device between portrait and landscape multiple times
   - The CLS score should increase minimally or not at all

2. **Scroll Test**
   - Enable the CLS display monitor
   - Scroll rapidly up and down the page
   - The score should not increase significantly

3. **Browser Chrome Test**
   - Enable the CLS display monitor
   - Tap the URL bar to show/hide browser chrome
   - Scroll to trigger toolbar hiding/showing
   - Monitor for CLS increases

4. **Input Field Test**
   - Navigate to a page with input fields
   - Enable the CLS display monitor
   - Tap on input fields to trigger the virtual keyboard
   - Check if layout shifts occur when keyboard appears/disappears

## Testing Matrix

| Test Case | Expected CLS | Desktop | Mobile | Priority |
|-----------|--------------|---------|--------|----------|
| Initial Page Load | < 0.1 | ✓ | ✓ | High |
| Window Resizing | < 0.05 | ✓ | N/A | Medium |
| Device Rotation | < 0.05 | N/A | ✓ | High |
| Browser Chrome Appear/Disappear | < 0.05 | N/A | ✓ | High |
| Virtual Keyboard Open/Close | < 0.05 | N/A | ✓ | High |
| Rapid Scrolling | < 0.05 | ✓ | ✓ | Medium |
| Page Navigation | < 0.1 | ✓ | ✓ | High |
| Dynamic Content Loading | < 0.1 | ✓ | ✓ | Medium |

## Interpreting Results

### CLS Thresholds (Google Web Vitals)

- **Good**: CLS < 0.1
- **Needs Improvement**: 0.1 <= CLS < 0.25
- **Poor**: CLS >= 0.25

### Troubleshooting Common Issues

1. **Header/Footer Shifts**
   - Check fixed positioning and top/bottom values
   - Verify CSS variables are being applied
   - Check z-index values and ensure proper stacking

2. **Hero Section Shifts**
   - Verify min-height/height values using CSS variables
   - Check containment settings
   - Ensure hardware acceleration is applied

3. **Image-Related Shifts**
   - Check for missing width/height attributes
   - Verify aspect ratio containers are used
   - Ensure images have proper loading attributes

4. **Font-Related Shifts**
   - Check for FOUC (Flash of Unstyled Content)
   - Verify font preloading
   - Check for explicit font size/line height definitions

5. **Mobile-Specific Issues**
   - Verify viewport-height-fix.js is loaded
   - Check safe area inset handling for notched devices
   - Test in various browsers (Chrome, Safari, Firefox)

## Advanced Analysis

For deeper analysis of CLS issues, use Chrome DevTools:

1. Open DevTools (F12)
2. Go to Performance tab
3. Check "Screenshots" and "Web Vitals"
4. Click Record and interact with the page
5. Look for red bars indicating layout shifts
6. Click on layout shift events to see affected elements

Alternatively, use Lighthouse for automated auditing:

1. Open DevTools > Lighthouse tab
2. Select "Performance" category
3. Run audit
4. Check the "Avoid large layout shifts" section

## Using CSS Variables

Our CLS prevention system uses several CSS variables that you can leverage in your components:

```css
/* Viewport height that accounts for mobile browser UI */
height: calc(var(--vh, 1vh) * 100);

/* Window height as a direct value */
height: var(--window-height, 100vh);

/* Mobile-friendly hero section height */
height: var(--hero-mobile-height, 450px);

/* Safe area insets for notched devices */
padding-bottom: var(--safe-area-inset-bottom, 0px);

/* Fixed element heights for consistent spacing */
margin-top: var(--header-height, 60px);
margin-bottom: var(--mobile-bottom-nav-height, 64px);
```

## Common CLS Issues and Solutions

### Images without dimensions
**Issue:** Images loading without explicit width/height attributes cause layout shifts.

**Solution:**
```html
<!-- Bad -->
<img src="image.jpg">

<!-- Good -->
<img src="image.jpg" width="800" height="600">

<!-- Even Better - Using our aspect ratio container -->
<div class="aspect-16-9 img-container">
  <img src="image.jpg" alt="Description" />
</div>
```

### Fixed headers with bottom values
**Issue:** Fixed headers with `bottom` values can shift when mobile browser UI appears/disappears.

**Solution:**
```css
/* Bad */
header {
  position: fixed;
  top: 0;
  bottom: 0;  /* This causes CLS issues */
}

/* Good */
header {
  position: fixed;
  top: 0;
  bottom: auto;  /* Prevents CLS issues */
  width: 100%;
  height: var(--header-height, 60px);
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
}
```

### Dynamic content without reserved space
**Issue:** Content loading dynamically without reserved space causes layout shifts.

**Solution:**
```jsx
// Bad - No reserved space
const DynamicContent = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    fetchData().then(() => setLoaded(true));
  }, []);
  
  return loaded ? <div>{content}</div> : null;
};

// Good - Using our hook for stable dimensions
const DynamicContent = () => {
  const { isStabilized } = useStableViewportHeight();
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    fetchData().then(() => setLoaded(true));
  }, []);
  
  return (
    <div 
      style={{ 
        minHeight: '200px',
        opacity: isStabilized && loaded ? 1 : 0.99,
        transition: 'opacity 0.15s ease-in-out'
      }}
    >
      {loaded && content}
    </div>
  );
};
```

### Bottom Navigation in mobile
**Issue:** Bottom navigation causing shifts when browser UI changes or during navigation.

**Solution:**
Use our `ConditionalBottomNav` component which handles this automatically.

## Reporting Issues

When reporting CLS issues, include:

1. Device and browser information
2. URL with debug parameter used
3. Steps to reproduce
4. Final CLS score
5. Screenshot of the verification report
6. Description of visible layout shifts

Use this format:
```
Page: [URL]
Device: [Device/Browser]
CLS Score: [Value]
Description: [What shifts and when]
Steps to reproduce: [Actions to take]
```

## Additional Resources

- [CLS-PREVENTION-GUIDE.md](CLS-PREVENTION-GUIDE.md) - Technical implementation details
- [CLS-STYLE-GUIDE.md](CLS-STYLE-GUIDE.md) - Best practices for developers
- [Web.dev CLS documentation](https://web.dev/cls/) - Google's official CLS documentation
- [Layout Instability API](https://wicg.github.io/layout-instability/) - Technical specification
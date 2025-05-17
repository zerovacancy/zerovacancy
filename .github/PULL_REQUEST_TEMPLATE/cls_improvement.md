# CLS Improvement Pull Request

## Summary
<!-- Briefly describe the CLS improvements made in this PR -->

## Components Optimized
<!-- List the components that were optimized -->
- [ ] Component A
- [ ] Component B
- [ ] Component C

## Optimization Techniques Applied
<!-- Check all that apply -->
- [ ] Added CSS containment
- [ ] Fixed dimension pre-allocation
- [ ] Aspect ratio container implementation
- [ ] Hardware acceleration
- [ ] ResizeObserver implementation
- [ ] Viewport height stabilization
- [ ] Image size attributes
- [ ] Font loading optimization
- [ ] Animation property optimization (transform/opacity only)
- [ ] Other: _____________________

## Before/After Metrics
<!-- Provide CLS metrics before and after your changes -->
| Component | Before CLS | After CLS | Improvement |
|-----------|------------|-----------|-------------|
| Component A | 0.XX | 0.XX | XX% |
| Component B | 0.XX | 0.XX | XX% |
| Overall | 0.XX | 0.XX | XX% |

## Testing Details
<!-- Describe how you tested these improvements -->
- [ ] Tested on desktop Chrome
- [ ] Tested on mobile Chrome
- [ ] Tested on Safari
- [ ] Tested with throttling enabled
- [ ] Used Chrome DevTools to verify reduction in layout shifts
- [ ] Ran automated CLS tests with `npm run test:cls`

## Screenshots/Videos
<!-- Attach relevant screenshots or videos showing the improvement -->

## Additional Notes
<!-- Any other information that would be useful for reviewers -->

## Checklist
- [ ] I have tested this on mobile devices
- [ ] I have run the automated CLS tests
- [ ] I have updated documentation if necessary
- [ ] The code follows our CLS prevention guide
- [ ] No new layout shifts were introduced elsewhere
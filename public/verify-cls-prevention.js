/**
 * CLS Prevention Verification Script
 * 
 * This script runs comprehensive tests to verify that the CLS prevention 
 * system is working correctly on the current page.
 * 
 * It can be run in the browser console or included directly in a page during development.
 * Use: ?debug=cls-verify to run automatically on page load
 */

(function() {
  // Configuration
  const VERIFICATION_CONFIG = {
    // Minimum test duration
    TEST_DURATION_MS: 3000,
    
    // Number of simulated resize events
    RESIZE_TEST_COUNT: 5,
    
    // Whether to log detailed results
    VERBOSE: true,
    
    // Critical CLS threshold (poor score per Google)
    CLS_THRESHOLD_POOR: 0.25,
    
    // Needs improvement CLS threshold (per Google)
    CLS_THRESHOLD_NEEDS_IMPROVEMENT: 0.1,
    
    // Maximum allowed single shift value
    MAX_SINGLE_SHIFT: 0.05,
    
    // Elements to verify dimensions/containment for
    CRITICAL_ELEMENTS: [
      {
        selector: 'header, .header, [role="banner"]',
        expectedProperties: ['position: fixed', 'top: 0', 'bottom: auto', 'will-change', 'transform']
      },
      {
        selector: 'section#hero, section.hero, [data-hero-section]',
        expectedProperties: ['min-height', 'transform']
      },
      {
        selector: '.bottom-nav-container, nav[style*="position:fixed"][style*="bottom"], .fixed-bottom',
        expectedProperties: ['position: fixed', 'bottom: 0', 'top: auto']
      },
      {
        selector: 'img',
        expectedProperties: ['height', 'width']
      },
      {
        selector: '.img-container, [class*="image-container"]',
        expectedProperties: ['position: relative', 'overflow: hidden']
      }
    ],
    
    // CSS variables that must be present
    REQUIRED_CSS_VARS: [
      '--vh',
      '--window-height',
      '--viewport-width',
      '--header-height',
      '--mobile-bottom-nav-height'
    ]
  };

  // Results storage
  const testResults = {
    cls: {
      observed: 0,
      maxSingleShift: 0,
      shiftEvents: [],
      status: 'pending'
    },
    cssVars: {
      found: [],
      missing: [],
      status: 'pending'
    },
    cssContainment: {
      passed: [],
      failed: [],
      status: 'pending'
    },
    rendering: {
      stabilized: false,
      hardwareAccelerated: false,
      status: 'pending'
    },
    resizeHandling: {
      shiftsDuringResize: 0,
      maxShiftDuringResize: 0,
      status: 'pending'
    },
    orientationHandling: {
      tested: false,
      status: 'pending'
    },
    issues: []
  };

  // Colored console output helper
  const log = {
    info: (msg) => console.log(`%c CLS-VERIFY %c ${msg} `, 
      'background:#3498db;color:white;border-radius:3px 0 0 3px;padding:2px 0 2px 4px;', 
      'background:#f8f9fa;color:#333;border-radius:0 3px 3px 0;padding:2px 4px 2px 0;'),
    success: (msg) => console.log(`%c CLS-VERIFY %c ${msg} `, 
      'background:#2ecc71;color:white;border-radius:3px 0 0 3px;padding:2px 0 2px 4px;', 
      'background:#f8f9fa;color:#333;border-radius:0 3px 3px 0;padding:2px 4px 2px 0;'),
    warn: (msg) => console.log(`%c CLS-VERIFY %c ${msg} `, 
      'background:#f39c12;color:white;border-radius:3px 0 0 3px;padding:2px 0 2px 4px;', 
      'background:#f8f9fa;color:#333;border-radius:0 3px 3px 0;padding:2px 4px 2px 0;'),
    error: (msg) => console.log(`%c CLS-VERIFY %c ${msg} `, 
      'background:#e74c3c;color:white;border-radius:3px 0 0 3px;padding:2px 0 2px 4px;', 
      'background:#f8f9fa;color:#333;border-radius:0 3px 3px 0;padding:2px 4px 2px 0;'),
    group: (title) => {
      console.groupCollapsed(`%c CLS-VERIFY %c ${title} `, 
        'background:#3498db;color:white;border-radius:3px 0 0 3px;padding:2px 0 2px 4px;', 
        'background:#f8f9fa;color:#333;border-radius:0 3px 3px 0;padding:2px 4px 2px 0;');
    },
    groupEnd: () => console.groupEnd()
  };

  /**
   * Test 1: Verify presence of required CSS variables
   */
  function verifyCSSVariables() {
    log.info('Checking required CSS variables...');
    
    const computedStyle = getComputedStyle(document.documentElement);
    const foundVars = [];
    const missingVars = [];
    
    VERIFICATION_CONFIG.REQUIRED_CSS_VARS.forEach(varName => {
      const value = computedStyle.getPropertyValue(varName);
      if (value) {
        foundVars.push({ name: varName, value });
      } else {
        missingVars.push(varName);
      }
    });
    
    if (missingVars.length === 0) {
      log.success('All required CSS variables are present!');
      testResults.cssVars.status = 'passed';
    } else {
      log.warn(`Missing CSS variables: ${missingVars.join(', ')}`);
      testResults.cssVars.status = 'failed';
      testResults.issues.push(`Missing CSS variables: ${missingVars.join(', ')}`);
    }
    
    testResults.cssVars.found = foundVars;
    testResults.cssVars.missing = missingVars;
    
    if (VERIFICATION_CONFIG.VERBOSE) {
      log.group('CSS Variables Details');
      foundVars.forEach(({ name, value }) => {
        console.log(`${name}: ${value}`);
      });
      log.groupEnd();
    }
  }

  /**
   * Test 2: Verify CSS containment on critical elements
   */
  function verifyCSSContainment() {
    log.info('Checking critical element styles...');
    
    const passedElements = [];
    const failedElements = [];
    
    VERIFICATION_CONFIG.CRITICAL_ELEMENTS.forEach(({ selector, expectedProperties }) => {
      const elements = document.querySelectorAll(selector);
      
      if (elements.length === 0) {
        // Skip this test if no elements found with this selector
        return;
      }
      
      // Check the first element as representative
      const element = elements[0];
      const computedStyle = window.getComputedStyle(element);
      
      const elementResult = {
        selector,
        element,
        properties: {
          passed: [],
          failed: []
        }
      };
      
      // Check each expected property
      expectedProperties.forEach(property => {
        // Handle property:value format
        if (property.includes(':')) {
          const [propName, expectedValue] = property.split(':').map(p => p.trim());
          const actualValue = computedStyle[propName];
          
          // Special case for handling 'will-change' since it might be any of several values
          if (propName === 'will-change') {
            if (actualValue && actualValue !== 'auto') {
              elementResult.properties.passed.push({ 
                name: propName, 
                expected: 'not auto', 
                actual: actualValue 
              });
            } else {
              elementResult.properties.failed.push({ 
                name: propName, 
                expected: 'not auto', 
                actual: actualValue || 'not set' 
              });
            }
          }
          // Special case for transform - just check if it exists
          else if (propName === 'transform') {
            if (actualValue && actualValue !== 'none') {
              elementResult.properties.passed.push({ 
                name: propName, 
                expected: 'not none', 
                actual: actualValue 
              });
            } else {
              elementResult.properties.failed.push({ 
                name: propName, 
                expected: 'not none', 
                actual: actualValue || 'not set' 
              });
            }
          }
          else if (actualValue && actualValue.includes(expectedValue)) {
            elementResult.properties.passed.push({ 
              name: propName, 
              expected: expectedValue, 
              actual: actualValue 
            });
          } else {
            elementResult.properties.failed.push({ 
              name: propName, 
              expected: expectedValue, 
              actual: actualValue || 'not set' 
            });
          }
        } 
        // Handle just property name
        else {
          const actualValue = computedStyle[property];
          if (actualValue && actualValue !== 'none' && actualValue !== 'auto') {
            elementResult.properties.passed.push({ 
              name: property, 
              actual: actualValue 
            });
          } else {
            elementResult.properties.failed.push({ 
              name: property, 
              actual: actualValue || 'not set' 
            });
          }
        }
      });
      
      // Determine if this element passes overall
      if (elementResult.properties.failed.length === 0) {
        passedElements.push(elementResult);
      } else {
        failedElements.push(elementResult);
      }
    });
    
    // Store test results
    testResults.cssContainment.passed = passedElements;
    testResults.cssContainment.failed = failedElements;
    
    if (failedElements.length === 0) {
      log.success('All critical elements have required styles!');
      testResults.cssContainment.status = 'passed';
    } else {
      log.warn(`${failedElements.length} element types have style issues`);
      testResults.cssContainment.status = 'warning';
      testResults.issues.push(`${failedElements.length} element types have style issues`);
      
      if (VERIFICATION_CONFIG.VERBOSE) {
        log.group('Failed Elements');
        failedElements.forEach(el => {
          console.log(`Selector: ${el.selector}`);
          console.log('Failed Properties:', el.properties.failed);
        });
        log.groupEnd();
      }
    }
  }

  /**
   * Test 3: Monitor layout shifts (CLS)
   */
  function monitorLayoutShifts() {
    log.info('Monitoring layout shifts...');
    
    // Create a promise to resolve after the test duration
    return new Promise(resolve => {
      let cumulativeLayoutShift = 0;
      let maxSingleShift = 0;
      const shiftEvents = [];
      
      // Skip if PerformanceObserver not supported
      if (typeof PerformanceObserver !== 'function') {
        log.warn('PerformanceObserver not supported in this browser');
        testResults.cls.status = 'skipped';
        testResults.issues.push('PerformanceObserver not supported, CLS monitoring skipped');
        resolve();
        return;
      }
      
      try {
        // Create an observer instance
        const observer = new PerformanceObserver(entryList => {
          for (const entry of entryList.getEntries()) {
            // Skip if the shift happened after user input
            if (entry.hadRecentInput) continue;
            
            // Add to cumulative score
            const shiftValue = entry.value;
            cumulativeLayoutShift += shiftValue;
            
            // Update max single shift
            maxSingleShift = Math.max(maxSingleShift, shiftValue);
            
            // Store entry details
            const entryDetail = {
              value: shiftValue,
              timestamp: new Date().toISOString(),
              elements: []
            };
            
            // Try to get information about affected elements
            try {
              if (entry.sources) {
                for (const source of entry.sources) {
                  if (source.node) {
                    const nodeName = source.node.nodeName || 'unknown';
                    const nodeId = source.node.id ? `#${source.node.id}` : '';
                    const className = typeof source.node.className === 'string' ? 
                      `.${source.node.className.split(' ').join('.')}` : '';
                    
                    const nodeIdentifier = `${nodeName}${nodeId}${className}`;
                    entryDetail.elements.push(nodeIdentifier);
                    
                    // Highlight problematic elements
                    source.node.classList.add('cls-verify-problematic');
                    source.node.dataset.clsShift = shiftValue.toFixed(5);
                    
                    // Add to the list of issues if significant
                    if (shiftValue > VERIFICATION_CONFIG.MAX_SINGLE_SHIFT) {
                      testResults.issues.push(`Layout shift of ${shiftValue.toFixed(5)} caused by ${nodeIdentifier}`);
                    }
                  }
                }
              }
            } catch (e) {
              // Safely handle errors accessing node details
              entryDetail.elements.push('Error accessing element details');
            }
            
            shiftEvents.push(entryDetail);
            
            if (VERIFICATION_CONFIG.VERBOSE) {
              console.log(`Layout shift: ${shiftValue.toFixed(5)}`, entryDetail);
            }
          }
        });
        
        // Start observing layout shift entries
        observer.observe({ type: 'layout-shift', buffered: true });
        
        // After the test duration, set the test results and resolve
        setTimeout(() => {
          // Stop observing
          observer.disconnect();
          
          // Store the results
          testResults.cls.observed = cumulativeLayoutShift;
          testResults.cls.maxSingleShift = maxSingleShift;
          testResults.cls.shiftEvents = shiftEvents;
          
          // Determine test status
          if (cumulativeLayoutShift >= VERIFICATION_CONFIG.CLS_THRESHOLD_POOR) {
            log.error(`High CLS detected: ${cumulativeLayoutShift.toFixed(5)}`);
            testResults.cls.status = 'failed';
          } else if (cumulativeLayoutShift >= VERIFICATION_CONFIG.CLS_THRESHOLD_NEEDS_IMPROVEMENT) {
            log.warn(`Moderate CLS detected: ${cumulativeLayoutShift.toFixed(5)}`);
            testResults.cls.status = 'warning';
          } else {
            log.success(`Low CLS detected: ${cumulativeLayoutShift.toFixed(5)}`);
            testResults.cls.status = 'passed';
          }
          
          if (maxSingleShift > VERIFICATION_CONFIG.MAX_SINGLE_SHIFT) {
            log.warn(`Large single layout shift detected: ${maxSingleShift.toFixed(5)}`);
            if (testResults.cls.status === 'passed') {
              testResults.cls.status = 'warning';
            }
          }
          
          resolve();
        }, VERIFICATION_CONFIG.TEST_DURATION_MS);
        
      } catch (e) {
        log.error('Error setting up layout shift monitoring:', e);
        testResults.cls.status = 'error';
        testResults.issues.push('Error setting up layout shift monitoring');
        resolve();
      }
    });
  }

  /**
   * Test 4: Verify rendering stabilization
   */
  function verifyRenderingStabilization() {
    log.info('Checking rendering stabilization...');
    
    const html = document.documentElement;
    
    // Check for stabilization class
    const isStabilized = html.classList.contains('cls-stabilized');
    
    // Check for hardware acceleration meta tag
    const hasHardwareAcceleration = !!document.querySelector('meta[name="viewport"][content*="minimal-ui"]');
    
    // Check for pre-stabilization class 
    const hasPreStabilization = html.classList.contains('cls-pre-stabilization');
    
    // Store results
    testResults.rendering.stabilized = isStabilized;
    testResults.rendering.hardwareAccelerated = hasHardwareAcceleration;
    testResults.rendering.preStabilization = hasPreStabilization;
    
    if (isStabilized && !hasPreStabilization) {
      log.success('Page is properly stabilized');
      testResults.rendering.status = 'passed';
    } else if (!isStabilized && !hasPreStabilization) {
      log.warn('Page is neither stabilized nor in pre-stabilization state');
      testResults.rendering.status = 'warning';
      testResults.issues.push('Page is missing both cls-stabilized and cls-pre-stabilization classes');
    } else if (hasPreStabilization) {
      log.warn('Page is still in pre-stabilization state');
      testResults.rendering.status = 'warning';
      testResults.issues.push('Page is still in pre-stabilization state - transition to stabilized may have failed');
    }
    
    if (!hasHardwareAcceleration) {
      if (VERIFICATION_CONFIG.VERBOSE) {
        log.warn('Hardware acceleration meta tag is missing');
      }
    }
  }

  /**
   * Test 5: Test resize handling
   */
  function testResizeHandling() {
    log.info('Testing resize event handling...');
    
    // Create a promise to resolve after testing resize events
    return new Promise(resolve => {
      // Skip if PerformanceObserver not supported
      if (typeof PerformanceObserver !== 'function') {
        log.warn('PerformanceObserver not supported, resize test skipped');
        testResults.resizeHandling.status = 'skipped';
        resolve();
        return;
      }
      
      let resizeShifts = 0;
      let maxResizeShift = 0;
      let resizeObserver = null;
      
      try {
        // Create a layout shift observer for resize events
        resizeObserver = new PerformanceObserver(entryList => {
          for (const entry of entryList.getEntries()) {
            // Skip if the shift happened after user input
            if (entry.hadRecentInput) continue;
            
            // Count shift and update max
            resizeShifts++;
            maxResizeShift = Math.max(maxResizeShift, entry.value);
            
            if (VERIFICATION_CONFIG.VERBOSE) {
              console.log(`Resize layout shift: ${entry.value.toFixed(5)}`);
            }
          }
        });
        
        // Start observing layout shifts
        resizeObserver.observe({ type: 'layout-shift', buffered: true });
        
        // Store original window dimensions
        const originalWidth = window.innerWidth;
        const originalHeight = window.innerHeight;
        
        // Simulate resize events
        const resizeWindow = (width, height) => {
          window.resizeTo(width, height);
          
          // Dispatch resize event in case resizeTo doesn't work (common in modern browsers)
          window.dispatchEvent(new Event('resize'));
        };
        
        // Series of resize tests with increasing magnitudes
        let testCount = 0;
        const runNextResizeTest = () => {
          testCount++;
          
          if (testCount <= VERIFICATION_CONFIG.RESIZE_TEST_COUNT) {
            // Calculate new dimensions (alternating smaller and larger)
            const widthDelta = (testCount % 2 === 0) ? 50 : -50;
            const heightDelta = (testCount % 2 === 0) ? 50 : -50;
            
            // Apply resize
            resizeWindow(
              originalWidth + widthDelta * testCount,
              originalHeight + heightDelta * testCount
            );
            
            // Wait a bit, then run next test
            setTimeout(runNextResizeTest, 300);
          } else {
            // All resize tests complete, restore original size
            resizeWindow(originalWidth, originalHeight);
            
            // Wait for any delayed effects, then complete test
            setTimeout(() => {
              // Stop observing
              if (resizeObserver) {
                resizeObserver.disconnect();
              }
              
              // Store results
              testResults.resizeHandling.shiftsDuringResize = resizeShifts;
              testResults.resizeHandling.maxShiftDuringResize = maxResizeShift;
              
              // Determine test status
              if (resizeShifts === 0) {
                log.success('No layout shifts during resize events!');
                testResults.resizeHandling.status = 'passed';
              } else if (maxResizeShift <= VERIFICATION_CONFIG.MAX_SINGLE_SHIFT) {
                log.warn(`${resizeShifts} small layout shifts during resize events`);
                testResults.resizeHandling.status = 'warning';
              } else {
                log.error(`${resizeShifts} layout shifts during resize, max: ${maxResizeShift.toFixed(5)}`);
                testResults.resizeHandling.status = 'failed';
                testResults.issues.push(`Large layout shifts during resize: ${maxResizeShift.toFixed(5)}`);
              }
              
              resolve();
            }, 500);
          }
        };
        
        // Start resize tests
        runNextResizeTest();
        
      } catch (e) {
        log.error('Error testing resize handling:', e);
        testResults.resizeHandling.status = 'error';
        testResults.issues.push('Error testing resize handling');
        
        // Clean up observer if it exists
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        
        resolve();
      }
    });
  }

  /**
   * Generate final report
   */
  function generateReport() {
    // Count issues by severity
    const testsWithIssues = Object.values(testResults)
      .filter(test => test.status === 'failed' || test.status === 'warning' || test.status === 'error')
      .length;
    
    const totalIssues = testResults.issues.length;
    
    // Overall rating
    let overallRating;
    if (testsWithIssues === 0) {
      overallRating = 'EXCELLENT';
    } else if (testResults.cls.status === 'failed' || Object.values(testResults).some(test => test.status === 'failed')) {
      overallRating = 'POOR';
    } else if (testResults.cls.status === 'warning' || Object.values(testResults).some(test => test.status === 'warning')) {
      overallRating = 'NEEDS IMPROVEMENT';
    } else {
      overallRating = 'GOOD';
    }
    
    // Output report header
    console.log('\n');
    console.log('%c CLS PREVENTION VERIFICATION REPORT ', 'background:#34495e;color:white;font-size:14px;padding:5px 10px;border-radius:3px;');
    console.log('\n');
    
    // Output overall rating
    const ratingColor = overallRating === 'EXCELLENT' ? '#2ecc71' : 
                        overallRating === 'GOOD' ? '#3498db' : 
                        overallRating === 'NEEDS IMPROVEMENT' ? '#f39c12' : '#e74c3c';
    
    console.log(`%c OVERALL RATING: ${overallRating} `, 
                `background:${ratingColor};color:white;font-size:16px;padding:5px 10px;border-radius:3px;`);
    console.log('\n');
    
    // Output test results
    console.log('%c TEST RESULTS ', 'background:#7f8c8d;color:white;font-size:12px;padding:3px 7px;border-radius:3px;');
    console.log('\n');
    
    // CLS Results
    const clsColor = testResults.cls.status === 'passed' ? '#2ecc71' : 
                    testResults.cls.status === 'warning' ? '#f39c12' : 
                    testResults.cls.status === 'skipped' ? '#7f8c8d' : '#e74c3c';
    
    console.log(`%c CLS Score: ${testResults.cls.observed.toFixed(5)} %c ${testResults.cls.status.toUpperCase()} `, 
                'color:#333;font-size:12px;padding:3px 0;', 
                `background:${clsColor};color:white;font-size:12px;padding:3px 7px;border-radius:3px;`);
    
    if (testResults.cls.shiftEvents.length > 0) {
      log.group('Layout Shift Details');
      console.log(`Total events: ${testResults.cls.shiftEvents.length}`);
      console.log(`Max single shift: ${testResults.cls.maxSingleShift.toFixed(5)}`);
      
      if (VERIFICATION_CONFIG.VERBOSE) {
        console.log('Shift events:');
        testResults.cls.shiftEvents.forEach((event, i) => {
          if (i < 5 || event.value > VERIFICATION_CONFIG.MAX_SINGLE_SHIFT) {
            console.log(`- Value: ${event.value.toFixed(5)}, Elements: ${event.elements.join(', ')}`);
          }
        });
        
        if (testResults.cls.shiftEvents.length > 5) {
          console.log(`... and ${testResults.cls.shiftEvents.length - 5} more events`);
        }
      }
      
      log.groupEnd();
    }
    
    // CSS Variables Results
    const cssVarsColor = testResults.cssVars.status === 'passed' ? '#2ecc71' : '#e74c3c';
    
    console.log(`%c CSS Variables: ${testResults.cssVars.found.length}/${VERIFICATION_CONFIG.REQUIRED_CSS_VARS.length} %c ${testResults.cssVars.status.toUpperCase()} `, 
                'color:#333;font-size:12px;padding:3px 0;', 
                `background:${cssVarsColor};color:white;font-size:12px;padding:3px 7px;border-radius:3px;`);
    
    // CSS Containment Results
    const cssContainmentColor = testResults.cssContainment.status === 'passed' ? '#2ecc71' : 
                               testResults.cssContainment.status === 'warning' ? '#f39c12' : '#e74c3c';
    
    console.log(`%c Critical Element Styles: ${testResults.cssContainment.passed.length}/${testResults.cssContainment.passed.length + testResults.cssContainment.failed.length} %c ${testResults.cssContainment.status.toUpperCase()} `, 
                'color:#333;font-size:12px;padding:3px 0;', 
                `background:${cssContainmentColor};color:white;font-size:12px;padding:3px 7px;border-radius:3px;`);
    
    // Rendering Results
    const renderingColor = testResults.rendering.status === 'passed' ? '#2ecc71' : 
                          testResults.rendering.status === 'warning' ? '#f39c12' : '#e74c3c';
    
    console.log(`%c Rendering Stabilization: ${testResults.rendering.stabilized ? 'Yes' : 'No'} %c ${testResults.rendering.status.toUpperCase()} `, 
                'color:#333;font-size:12px;padding:3px 0;', 
                `background:${renderingColor};color:white;font-size:12px;padding:3px 7px;border-radius:3px;`);
    
    // Resize Handling Results
    const resizeColor = testResults.resizeHandling.status === 'passed' ? '#2ecc71' : 
                       testResults.resizeHandling.status === 'warning' ? '#f39c12' : 
                       testResults.resizeHandling.status === 'skipped' ? '#7f8c8d' : '#e74c3c';
    
    console.log(`%c Resize Handling: ${testResults.resizeHandling.shiftsDuringResize} shifts %c ${testResults.resizeHandling.status.toUpperCase()} `, 
                'color:#333;font-size:12px;padding:3px 0;', 
                `background:${resizeColor};color:white;font-size:12px;padding:3px 7px;border-radius:3px;`);
    
    console.log('\n');
    
    // Output issues if any
    if (totalIssues > 0) {
      console.log('%c ISSUES FOUND ', 'background:#e74c3c;color:white;font-size:12px;padding:3px 7px;border-radius:3px;');
      console.log('\n');
      
      testResults.issues.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue}`);
      });
      
      console.log('\n');
    }
    
    // Output recommendations
    console.log('%c RECOMMENDATIONS ', 'background:#9b59b6;color:white;font-size:12px;padding:3px 7px;border-radius:3px;');
    console.log('\n');
    
    if (testResults.cls.status !== 'passed') {
      console.log('1. Check the layout shift events to identify problematic elements');
      console.log('2. Apply hardware acceleration and proper dimensions to elements causing shifts');
      console.log('3. Use CSS custom properties for viewport heights instead of vh units');
    }
    
    if (testResults.cssVars.status !== 'passed') {
      console.log('- Ensure viewport-height-fix.js is loading and setting CSS variables correctly');
    }
    
    if (testResults.cssContainment.status !== 'passed') {
      console.log('- Review critical elements that are missing proper containment styles');
    }
    
    if (testResults.rendering.status !== 'passed') {
      console.log('- Verify the transition from cls-pre-stabilization to cls-stabilized');
    }
    
    if (testResults.resizeHandling.status !== 'passed' && testResults.resizeHandling.status !== 'skipped') {
      console.log('- Improve resize handling to prevent layout shifts during window resizing');
    }
    
    console.log('\n');
    
    // Output instructions for viewing full report
    console.log('For full report details:');
    console.log('window.clsVerificationResults');
    
    // Expose results to window object
    window.clsVerificationResults = testResults;
    window.rerunClsVerification = runAllTests;
    
    return {
      rating: overallRating,
      results: testResults
    };
  }

  /**
   * Run all tests in sequence
   */
  async function runAllTests() {
    log.info('Starting CLS Prevention Verification...');
    
    // Add a visual indicator class to the body for debugging
    document.body.classList.add('cls-verification-running');
    
    try {
      // 1. Verify CSS variables
      verifyCSSVariables();
      
      // 2. Verify CSS containment
      verifyCSSContainment();
      
      // 3. Verify rendering stabilization
      verifyRenderingStabilization();
      
      // 4. Monitor layout shifts
      await monitorLayoutShifts();
      
      // 5. Test resize handling
      await testResizeHandling();
      
      // Generate the final report
      const report = generateReport();
      
      // Remove visual indicator
      document.body.classList.remove('cls-verification-running');
      
      return report;
    } catch (error) {
      log.error('Error during verification:', error);
      document.body.classList.remove('cls-verification-running');
      
      // Still generate a report with available data
      return generateReport();
    }
  }

  // Check if verification should run automatically
  if (window.location.search.includes('debug=cls-verify')) {
    if (document.readyState === 'complete') {
      runAllTests();
    } else {
      window.addEventListener('load', () => {
        // Wait a bit to allow the page to settle
        setTimeout(runAllTests, 1000);
      });
    }
  }

  // Expose the verification function
  window.verifyCLSPrevention = runAllTests;
  
  // If an existing CLS monitoring system is detected, integrate with it
  if (window.__clsMonitoring) {
    log.info('CLS monitoring already active, integration available via window.verifyCLSPrevention');
  }
  
  log.info('CLS verification system ready, run with window.verifyCLSPrevention()');
})();
/**
 * Development CLS Monitor Script
 * Injects CLS monitoring into the development server
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Path to the index.html file (may need to adjust for your project)
const indexPath = path.resolve(process.cwd(), 'index.html');

// CLS monitoring script to inject
const clsMonitoringScript = `
<script>
// CLS Monitoring for development
(function() {
  let cumulativeLayoutShift = 0;
  let clsEntries = [];
  let sessionValue = 0;
  let sessionEntries = [];
  let clsByComponent = {};
  
  // Create fixed position element to show CLS statistics
  const monitor = document.createElement('div');
  monitor.id = 'cls-monitor';
  Object.assign(monitor.style, {
    position: 'fixed',
    bottom: '0',
    right: '0',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '8px 12px',
    fontSize: '14px',
    fontFamily: 'monospace',
    zIndex: '99999',
    maxWidth: '400px',
    maxHeight: '200px',
    overflow: 'auto',
    borderRadius: '4px 0 0 0',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
  });
  document.body.appendChild(monitor);
  
  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Toggle CLS Monitor';
  Object.assign(toggleButton.style, {
    position: 'fixed',
    bottom: '0',
    left: '0',
    background: '#333',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    fontSize: '12px',
    fontFamily: 'monospace',
    zIndex: '99999',
    cursor: 'pointer',
    borderRadius: '0 4px 0 0'
  });
  toggleButton.addEventListener('click', () => {
    monitor.style.display = monitor.style.display === 'none' ? 'block' : 'none';
  });
  document.body.appendChild(toggleButton);
  
  // Add a highlight feature for shifting elements
  const highlightShifts = true;
  const highlightClass = 'cls-shift-highlight';
  const style = document.createElement('style');
  style.textContent = \`
    .cls-shift-highlight {
      outline: 2px solid red !important;
      background-color: rgba(255, 0, 0, 0.2) !important;
      position: relative;
    }
    .cls-shift-highlight::after {
      content: "Layout Shift";
      position: absolute;
      top: 0;
      left: 0;
      background: red;
      color: white;
      font-size: 12px;
      padding: 2px 4px;
      z-index: 999999;
    }
  \`;
  document.head.appendChild(style);
  
  // Helper function to get the component name from an element
  function getComponentName(node) {
    if (!node || node === document.body) return 'unknown';
    
    // Check for common component identifiers
    const classNames = node.className ? node.className.split(' ') : [];
    const componentClasses = classNames.filter(c => 
      c.includes('container') || 
      c.includes('component') || 
      c.includes('section') || 
      c.includes('card') ||
      c.includes('list') ||
      c.includes('grid') ||
      c.includes('gallery')
    );
    
    if (componentClasses.length > 0) {
      return componentClasses[0];
    }
    
    // Check for ID
    if (node.id) {
      return node.id;
    }
    
    // Check data attributes
    const dataComponent = Object.keys(node.dataset).find(key => 
      key.includes('component') || key.includes('testid')
    );
    if (dataComponent) {
      return node.dataset[dataComponent];
    }
    
    // Recursively check parent
    return getComponentName(node.parentElement);
  }
  
  // Monitor layout shifts
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Only count layout shifts without recent user input
      if (!entry.hadRecentInput) {
        const currentShift = entry.value;
        cumulativeLayoutShift += currentShift;
        clsEntries.push(entry);
        
        // Track specific elements causing shifts
        if (entry.sources && entry.sources.length > 0) {
          entry.sources.forEach(source => {
            if (source.node && highlightShifts) {
              // Highlight the element
              source.node.classList.add(highlightClass);
              setTimeout(() => {
                source.node.classList.remove(highlightClass);
              }, 2000);
              
              // Track by component
              const componentName = getComponentName(source.node);
              if (!clsByComponent[componentName]) {
                clsByComponent[componentName] = 0;
              }
              clsByComponent[componentName] += currentShift;
            }
          });
        }
        
        // Report to console for debugging
        console.debug('[CLS Monitor]', { 
          value: currentShift.toFixed(4), 
          cumulative: cumulativeLayoutShift.toFixed(4),
          entries: clsEntries.length,
          sources: entry.sources
        });
        
        // Group shifts into sessions (300ms gaps)
        if (sessionValue === 0 || 
            entry.startTime - sessionEntries[sessionEntries.length - 1].startTime < 300) {
          sessionValue += currentShift;
          sessionEntries.push(entry);
        } else {
          // Start new session
          sessionValue = currentShift;
          sessionEntries = [entry];
        }
        
        // Update the monitor
        updateMonitor();
      }
    }
  });
  
  function updateMonitor() {
    // Update time since last shift
    const lastEntry = clsEntries[clsEntries.length - 1];
    const timeSinceLastShift = lastEntry ? 
      ((performance.now() - lastEntry.startTime) / 1000).toFixed(1) + 's ago' : 
      'N/A';
    
    // Format CLS scores with color based on severity
    const formatCLS = (cls) => {
      const value = parseFloat(cls);
      let color = 'green';
      if (value > 0.1) color = 'red';
      else if (value > 0.05) color = 'orange';
      return \`<span style="color: \${color};">\${cls}</span>\`;
    };
    
    // Build component breakdown
    let componentBreakdown = '';
    Object.entries(clsByComponent)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) // Top 5 components
      .forEach(([component, value]) => {
        componentBreakdown += \`
          <div style="display: flex; justify-content: space-between; margin: 2px 0;">
            <span>\${component}:</span> 
            <span>\${formatCLS(value.toFixed(4))}</span>
          </div>
        \`;
      });
    
    // Update monitor content
    monitor.innerHTML = \`
      <div style="font-weight: bold; margin-bottom: 5px;">CLS Monitor</div>
      <div style="display: flex; justify-content: space-between;">
        <span>Current CLS:</span> <span>\${formatCLS(cumulativeLayoutShift.toFixed(4))}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Last Session:</span> <span>\${formatCLS(sessionValue.toFixed(4))}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Total Shifts:</span> <span>\${clsEntries.length}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Last Shift:</span> <span>\${timeSinceLastShift}</span>
      </div>
      <div style="margin-top: 8px; border-top: 1px solid #666; padding-top: 4px;">
        <div style="font-weight: bold; margin-bottom: 2px;">Top Shift Sources:</div>
        \${componentBreakdown}
      </div>
    \`;
  }
  
  // Start observing
  observer.observe({ type: 'layout-shift', buffered: true });
  
  // Update "time since last shift" every second
  setInterval(updateMonitor, 1000);
  
  // Expose monitoring as a global for debugging
  window.clsMonitor = {
    getScore: () => cumulativeLayoutShift,
    getEntries: () => clsEntries,
    getComponents: () => clsByComponent,
    reset: () => {
      cumulativeLayoutShift = 0;
      clsEntries = [];
      sessionValue = 0;
      sessionEntries = [];
      clsByComponent = {};
      updateMonitor();
    }
  };
})();
</script>
`;

try {
  // Read the existing index.html
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Check if the CLS monitoring script is already injected
  if (indexContent.includes('cls-monitor')) {
    console.log(chalk.yellow('CLS monitoring script is already injected'));
  } else {
    // Insert the script before the closing body tag
    indexContent = indexContent.replace('</body>', `${clsMonitoringScript}\n</body>`);
    
    // Write the updated index.html
    fs.writeFileSync(indexPath, indexContent);
    
    console.log(chalk.green('✅ CLS monitoring script injected into index.html'));
    console.log(chalk.blue('Run your development server to see CLS monitoring in action'));
  }
} catch (error) {
  console.error(chalk.red('Error injecting CLS monitoring script:'), error);
  process.exit(1);
}

// Add script to remove the monitoring when done
process.on('exit', () => {
  try {
    // Only clean up if this script was used to inject the monitoring
    if (fs.existsSync(indexPath)) {
      let indexContent = fs.readFileSync(indexPath, 'utf8');
      
      // Remove the CLS monitoring script if it was injected
      if (indexContent.includes('cls-monitor')) {
        indexContent = indexContent.replace(clsMonitoringScript, '');
        fs.writeFileSync(indexPath, indexContent);
        console.log(chalk.green('CLS monitoring script removed from index.html'));
      }
    }
  } catch (error) {
    // Silently fail cleanup
  }
});
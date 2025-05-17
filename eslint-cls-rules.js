/**
 * ESLint Custom Rules for CLS Prevention
 * 
 * These rules help enforce best practices for preventing Cumulative Layout Shift (CLS)
 * Load these rules in your eslint config to automatically detect common CLS issues.
 */

export const rules = {
    // Enforce width and height attributes on img elements
    "img-explicit-dimensions": {
      meta: {
        type: "problem",
        docs: {
          description: "Enforce width and height attributes on img elements to prevent CLS",
          category: "CLS Prevention",
          recommended: true
        },
        fixable: null,
        schema: []
      },
      
      create: function(context) {
        return {
          JSXElement(node) {
            // Only check img elements
            if (node.openingElement.name.name !== 'img') return;
            
            const hasWidth = node.openingElement.attributes.some(
              attr => attr.name && attr.name.name === 'width'
            );
            
            const hasHeight = node.openingElement.attributes.some(
              attr => attr.name && attr.name.name === 'height'
            );
            
            const hasStyle = node.openingElement.attributes.some(
              attr => attr.name && attr.name.name === 'style'
            );
            
            // Check if using style attribute for width/height
            let hasStyleDimensions = false;
            if (hasStyle) {
              // Try to find width/height in style attribute
              node.openingElement.attributes.forEach(attr => {
                if (attr.name && attr.name.name === 'style' && 
                    attr.value && attr.value.expression && 
                    attr.value.expression.properties) {
                  hasStyleDimensions = attr.value.expression.properties.some(
                    prop => 
                      (prop.key.name === 'width' || prop.key.name === 'height') ||
                      (prop.key.name === 'aspectRatio')
                  );
                }
              });
            }
            
            // Check if the parent element has position relative and child has absolute
            let hasPositionedContainer = false;
            if (node.parent && node.parent.type === 'JSXElement') {
              // Check for container with position relative
              const parentHasRelativePosition = node.parent.openingElement.attributes.some(attr => {
                return (
                  (attr.name && attr.name.name === 'style' && 
                   attr.value && attr.value.expression && 
                   attr.value.expression.properties && 
                   attr.value.expression.properties.some(prop => 
                     prop.key.name === 'position' && 
                     prop.value.value === 'relative'
                   )) || 
                  (attr.name && attr.name.name === 'className' && 
                   attr.value && attr.value.value && 
                   attr.value.value.includes('relative'))
                );
              });
              
              // Check for image with position absolute
              const imgHasAbsolutePosition = node.openingElement.attributes.some(attr => {
                return (
                  (attr.name && attr.name.name === 'style' && 
                   attr.value && attr.value.expression && 
                   attr.value.expression.properties && 
                   attr.value.expression.properties.some(prop => 
                     prop.key.name === 'position' && 
                     prop.value.value === 'absolute'
                   )) || 
                  (attr.name && attr.name.name === 'className' && 
                   attr.value && attr.value.value && 
                   attr.value.value.includes('absolute'))
                );
              });
              
              hasPositionedContainer = parentHasRelativePosition && imgHasAbsolutePosition;
            }
            
            // If missing both width and height, and not using other CLS prevention techniques
            if (!hasWidth || !hasHeight) {
              if (!hasStyleDimensions && !hasPositionedContainer) {
                context.report({
                  node,
                  message: "Image is missing explicit dimensions. Add width/height attributes or use an aspect ratio container to prevent CLS."
                });
              }
            }
          }
        };
      }
    },
    
    // Detect problematic fixed positioning that might cause CLS
    "safe-fixed-positioning": {
      meta: {
        type: "problem",
        docs: {
          description: "Prevent CLS from fixed positioning with problematic bottom values",
          category: "CLS Prevention",
          recommended: true
        },
        fixable: null,
        schema: []
      },
      
      create: function(context) {
        return {
          Property(node) {
            // Only check style objects with position: fixed
            if (node.key.name !== 'position' || node.value.value !== 'fixed') return;
            
            // Find the parent object expression (style object)
            let styleObj = node.parent;
            if (!styleObj || styleObj.type !== 'ObjectExpression') return;
            
            // Check for problematic bottom value in the same style object
            const hasProblematicBottom = styleObj.properties.some(prop => 
              prop.key && prop.key.name === 'bottom' && 
              prop.value && prop.value.value !== 'auto' && 
              prop.value && prop.value.value !== undefined
            );
            
            // Check if this is a header or similar element
            let isHeader = false;
            let component = '';
            
            // Try to determine component type from variable name or JSX element
            if (styleObj.parent && styleObj.parent.parent) {
              if (styleObj.parent.parent.id && styleObj.parent.parent.id.name) {
                component = styleObj.parent.parent.id.name.toLowerCase();
                isHeader = component.includes('header') || 
                          component.includes('nav') || 
                          component.includes('menu');
              } else if (styleObj.parent.parent.parent && 
                        styleObj.parent.parent.parent.openingElement && 
                        styleObj.parent.parent.parent.openingElement.name) {
                component = styleObj.parent.parent.parent.openingElement.name.name.toLowerCase();
                isHeader = component === 'header' || 
                          component.includes('nav') || 
                          component === 'menu';
              }
            }
            
            if (hasProblematicBottom && isHeader) {
              context.report({
                node,
                message: `Fixed ${component} with non-auto bottom value may cause CLS. Use bottom: 'auto' to prevent layout shifts.`
              });
            }
          },
          
          // Also check inline styles in JSX
          JSXAttribute(node) {
            if (node.name.name !== 'style') return;
            
            // Check if this is a style object
            if (!node.value || !node.value.expression || node.value.expression.type !== 'ObjectExpression') return;
            
            const styleObj = node.value.expression;
            
            // Check for position: fixed
            const hasFixedPosition = styleObj.properties.some(prop => 
              prop.key && prop.key.name === 'position' && 
              prop.value && prop.value.value === 'fixed'
            );
            
            if (!hasFixedPosition) return;
            
            // Check for problematic bottom value
            const hasProblematicBottom = styleObj.properties.some(prop => 
              prop.key && prop.key.name === 'bottom' && 
              prop.value && prop.value.value !== 'auto' && 
              prop.value && prop.value.value !== undefined
            );
            
            // Check if this is a header element
            let elementName = '';
            if (node.parent && node.parent.name && node.parent.name.name) {
              elementName = node.parent.name.name.toLowerCase();
            }
            
            const isHeader = elementName === 'header' || 
                            elementName.includes('nav') || 
                            elementName === 'menu';
            
            if (hasProblematicBottom && isHeader) {
              context.report({
                node,
                message: `Fixed ${elementName} with non-auto bottom value may cause CLS. Use bottom: 'auto' to prevent layout shifts.`
              });
            }
          }
        };
      }
    },
    
    // Detect animations that might cause CLS
    "safe-animations": {
      meta: {
        type: "problem",
        docs: {
          description: "Prevent CLS from animations that change layout properties",
          category: "CLS Prevention",
          recommended: true
        },
        fixable: null,
        schema: []
      },
      
      create: function(context) {
        // List of animation properties that could cause CLS
        const layoutProperties = [
          'height', 'width', 'margin', 'margin-top', 'margin-bottom', 
          'margin-left', 'margin-right', 'padding', 'padding-top', 
          'padding-bottom', 'padding-left', 'padding-right',
          'top', 'bottom', 'left', 'right', 'position'
        ];
        
        return {
          Property(node) {
            // Check for animation or transition properties
            if (node.key.name !== 'animation' && 
                node.key.name !== 'transition' && 
                !node.key.name.startsWith('animation') && 
                !node.key.name.startsWith('transition')) return;
            
            // Skip if explicitly using transform or opacity only
            if (node.value.value && typeof node.value.value === 'string') {
              const value = node.value.value.toLowerCase();
              if (value.includes('transform') || value.includes('opacity')) {
                if (!layoutProperties.some(prop => value.includes(prop))) {
                  return;
                }
              }
              
              // Check if animating layout properties
              const isAnimatingLayout = layoutProperties.some(prop => 
                value.includes(prop)
              );
              
              if (isAnimatingLayout) {
                context.report({
                  node,
                  message: "Animating layout properties may cause CLS. Use transform and opacity instead."
                });
              }
            }
          }
        };
      }
    }
  }
;
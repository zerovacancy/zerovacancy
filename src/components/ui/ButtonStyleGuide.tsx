/**
 * Button Style Guide Component
 * 
 * This component showcases all button styles available in the system.
 * Use it as a reference when implementing buttons throughout the site.
 */

import React from 'react';
import { 
  buttonColors, 
  buttonSizes, 
  shadowStyles, 
  getCompleteButtonStyles 
} from '@/styles/button-style-guide';
import { ShieldCheck, UserPlus, ArrowRight, Check, Plus, Settings } from 'lucide-react';

export function ButtonStyleGuide() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">ZeroVacancy Button Style Guide</h1>
      
      {/* Color Variants */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Color Variants (Large Size)</h2>
        <p className="text-gray-600 mb-6">
          These are the standard color variants available for buttons across the site.
          Each maintains the same 3D physical appearance with colors appropriate to its purpose.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.keys(buttonColors).map(color => {
            const { button, iconContainer, icon, textPadding } = getCompleteButtonStyles(
              color as keyof typeof buttonColors, 
              'lg', 
              { iconPosition: 'left' }
            );
            
            return (
              <div key={color} className="flex flex-col space-y-2">
                <p className="text-sm font-medium text-gray-700 capitalize">{color} Button</p>
                <button 
                  className="relative"
                  style={{...button, ...textPadding, width: '100%'}}
                >
                  <div style={iconContainer}>
                    <ShieldCheck style={icon} />
                  </div>
                  {color.toUpperCase()} BUTTON
                </button>
              </div>
            );
          })}
        </div>
      </section>
      
      {/* Size Variants */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Size Variants (Purple Color)</h2>
        <p className="text-gray-600 mb-6">
          Buttons come in different sizes for different contexts. Each size maintains the same
          proportions and styling principles.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          {Object.keys(buttonSizes).map(size => {
            const { button, iconContainer, icon, textPadding } = getCompleteButtonStyles(
              'purple', 
              size as keyof typeof buttonSizes, 
              { iconPosition: 'left' }
            );
            
            return (
              <div key={size} className="flex flex-col space-y-2">
                <p className="text-sm font-medium text-gray-700 capitalize">{size} Size</p>
                <button 
                  className="relative"
                  style={{...button, ...textPadding, width: '100%'}}
                >
                  <div style={iconContainer}>
                    <ArrowRight style={icon} />
                  </div>
                  {size.toUpperCase()} BUTTON
                </button>
              </div>
            );
          })}
        </div>
      </section>
      
      {/* Icon Positions */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Icon Positions (White Color)</h2>
        <p className="text-gray-600 mb-6">
          Button icons can be positioned on either side of the text.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['left', 'right'].map(position => {
            const { button, iconContainer, icon, textPadding } = getCompleteButtonStyles(
              'white', 
              'lg', 
              { iconPosition: position as 'left' | 'right' }
            );
            
            return (
              <div key={position} className="flex flex-col space-y-2">
                <p className="text-sm font-medium text-gray-700 capitalize">{position} Icon</p>
                <button 
                  className="relative"
                  style={{...button, ...textPadding, width: '100%'}}
                >
                  <div style={iconContainer}>
                    <UserPlus style={icon} />
                  </div>
                  ICON {position.toUpperCase()}
                </button>
              </div>
            );
          })}
        </div>
      </section>
      
      {/* Shadow Variations */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Shadow Variations (Blue Color)</h2>
        <p className="text-gray-600 mb-6">
          Different shadow intensities for different prominence levels.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.keys(shadowStyles).filter(s => s !== 'pressed').map(shadow => {
            const { button, iconContainer, icon, textPadding } = getCompleteButtonStyles(
              'blue', 
              'lg', 
              { 
                iconPosition: 'left',
                customShadow: shadowStyles[shadow as keyof typeof shadowStyles]
              }
            );
            
            return (
              <div key={shadow} className="flex flex-col space-y-2">
                <p className="text-sm font-medium text-gray-700 capitalize">{shadow} Shadow</p>
                <button 
                  className="relative"
                  style={{...button, ...textPadding, width: '100%'}}
                >
                  <div style={iconContainer}>
                    <Check style={icon} />
                  </div>
                  {shadow.toUpperCase()} SHADOW
                </button>
              </div>
            );
          })}
        </div>
      </section>
      
      {/* Hero Section Buttons */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Hero Section Buttons</h2>
        <p className="text-gray-600 mb-6">
          These are the exact buttons used in the hero section, with their specific styling.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* RESERVE EARLY ACCESS Button */}
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-gray-700">Reserve Early Access Button</p>
            <ReserveEarlyAccessButton />
          </div>
          
          {/* JOIN AS CREATOR Button */}
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-gray-700">Join As Creator Button</p>
            <JoinAsCreatorButton />
          </div>
        </div>
      </section>
      
      {/* Mobile Examples */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Mobile-Optimized Buttons</h2>
        <p className="text-gray-600 mb-6">
          These buttons have been optimized for mobile displays.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mobile RESERVE EARLY ACCESS Button */}
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-gray-700">Mobile Reserve Early Access</p>
            <MobileReserveEarlyAccessButton />
          </div>
          
          {/* Mobile JOIN AS CREATOR Button */}
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-gray-700">Mobile Join As Creator</p>
            <MobileJoinAsCreatorButton />
          </div>
        </div>
      </section>
      
      <section className="border-t border-gray-200 pt-8 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Usage Guidelines</h2>
        <div className="prose max-w-none">
          <p>
            When implementing these buttons across the site, follow these guidelines:
          </p>
          <ul>
            <li><strong>Maintain Consistency:</strong> Use the same button style for the same action across different sections</li>
            <li><strong>Color Meaning:</strong> 
              <ul>
                <li>Purple buttons are for primary actions</li>
                <li>White buttons are for secondary or alternate actions</li>
                <li>Blue buttons are for informational actions</li>
                <li>Gray buttons are for neutral or tertiary actions</li>
              </ul>
            </li>
            <li><strong>Size Usage:</strong> 
              <ul>
                <li>Large buttons for primary hero CTAs</li>
                <li>Medium buttons for secondary actions</li>
                <li>Small buttons for utility functions</li>
                <li>Mobile-specific sizing for all mobile views</li>
              </ul>
            </li>
            <li><strong>Icon Placement:</strong> Be consistent with icon placement for similar actions</li>
          </ul>
          <p>
            For implementation, import the appropriate functions from the button style guide:
          </p>
          <pre>
{`import { getCompleteButtonStyles } from '@/styles/button-style-guide';

// Then in your component:
const { button, iconContainer, icon, textPadding } = getCompleteButtonStyles('purple', 'lg');`}
          </pre>
        </div>
      </section>
    </div>
  );
}

// Sample implementations of the hero section buttons

function ReserveEarlyAccessButton() {
  const { button, iconContainer, icon, textPadding } = getCompleteButtonStyles('white', 'lg', { iconPosition: 'left' });
  
  return (
    <button 
      className="relative"
      style={{...button, ...textPadding, width: '100%', color: '#7837DB'}}
    >
      <div style={iconContainer}>
        <ShieldCheck style={icon} />
      </div>
      RESERVE EARLY ACCESS
    </button>
  );
}

function JoinAsCreatorButton() {
  const { button, iconContainer, icon, textPadding } = getCompleteButtonStyles('white', 'lg', { iconPosition: 'left' });
  
  return (
    <button 
      className="relative"
      style={{...button, ...textPadding, width: '100%'}}
    >
      <div style={iconContainer}>
        <UserPlus style={icon} />
      </div>
      JOIN AS CREATOR
    </button>
  );
}

function MobileReserveEarlyAccessButton() {
  const { button, iconContainer, icon, textPadding } = getCompleteButtonStyles('white', 'mobile', { iconPosition: 'left' });
  
  return (
    <button 
      className="relative"
      style={{
        ...button, 
        ...textPadding, 
        width: '100%', 
        maxWidth: '280px', 
        color: '#7837DB',
        fontSize: '14px',
        fontWeight: 600
      }}
    >
      <div style={iconContainer}>
        <ShieldCheck style={icon} />
      </div>
      RESERVE EARLY ACCESS
    </button>
  );
}

function MobileJoinAsCreatorButton() {
  const { button, iconContainer, icon, textPadding } = getCompleteButtonStyles('white', 'mobile', { iconPosition: 'left' });
  
  return (
    <button 
      className="relative"
      style={{
        ...button, 
        ...textPadding, 
        width: '100%', 
        maxWidth: '280px',
        fontSize: '14px',
        fontWeight: 600
      }}
    >
      <div style={iconContainer}>
        <UserPlus style={icon} />
      </div>
      JOIN AS CREATOR
    </button>
  );
}

export default ButtonStyleGuide;